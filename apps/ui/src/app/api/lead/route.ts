import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getEnvVar } from "@/lib/env-vars"
import { formatPrice as price } from "@/lib/format"
import { isProduction } from "@/lib/general-helpers"
import { logError, logger } from "@/lib/logging"

/**
 * Sends a lead to Telegram: either a "write to us" message from the contacts
 * page, or an order from the cart.
 *
 * Nothing is stored — Telegram is the inbox. If we ever need order history,
 * that becomes an Order collection in Strapi; this route would then write there
 * first and notify Telegram second.
 *
 * The bot token never reaches the browser: the form posts here, and only this
 * route (server-side) talks to Telegram.
 */
const contactSchema = z.object({
  kind: z.literal("contact"),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(2000).optional(),
  // Honeypot: a real person leaves this empty; bots fill every field. It is
  // accepted by the schema on purpose — rejecting it here would answer 400 and
  // tell the bot which field gave it away.
  company: z.string().max(200).optional(),
})

const orderItemSchema = z.object({
  name: z.string().trim().min(1).max(200),
  option: z.string().trim().max(100).optional(),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(99),
})

const orderSchema = z.object({
  kind: z.literal("order"),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().max(120).optional(),
  office: z.string().trim().max(160).optional(),
  payment: z.enum(["card", "cod"]),
  items: z.array(orderItemSchema).min(1).max(50),
  company: z.string().max(200).optional(),
})

const leadSchema = z.discriminatedUnion("kind", [contactSchema, orderSchema])

type Lead = z.infer<typeof leadSchema>

const PAYMENT_LABELS: Record<string, string> = {
  card: "Картка онлайн",
  cod: "Готівкою / карткою при отриманні",
}

/** Telegram renders HTML — escape anything the user typed. */
const esc = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

/**
 * Everything that is not production (local, preview, staging) is loud about it:
 * the same bot writes into the same chats, and a test order that looks real is
 * a phone call to a customer who never ordered anything.
 */
function testBanner(): string[] {
  if (isProduction()) {
    return []
  }

  return [
    "⚠️ <b>ТЕСТОВЕ ПОВІДОМЛЕННЯ</b> — не реагуйте на нього",
    `<i>Середовище: ${esc(getEnvVar("APP_ENV") ?? "не задано")}</i>`,
    "",
  ]
}

function buildMessage(lead: Lead): string {
  if (lead.kind === "contact") {
    return [
      ...testBanner(),
      "<b>📨 Повідомлення з сайту</b>",
      "",
      `<b>Ім'я:</b> ${esc(lead.name)}`,
      `<b>Телефон:</b> ${esc(lead.phone)}`,
      ...(lead.message ? ["", esc(lead.message)] : []),
    ].join("\n")
  }

  const total = lead.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return [
    ...testBanner(),
    "<b>🛒 Нове замовлення</b>",
    "",
    `<b>Отримувач:</b> ${esc(lead.name)}`,
    `<b>Телефон:</b> ${esc(lead.phone)}`,
    ...(lead.city ? [`<b>Місто:</b> ${esc(lead.city)}`] : []),
    ...(lead.office ? [`<b>Відділення:</b> ${esc(lead.office)}`] : []),
    `<b>Оплата:</b> ${PAYMENT_LABELS[lead.payment] ?? lead.payment}`,
    "",
    "<b>Товари:</b>",
    ...lead.items.map(
      (item) =>
        `• ${esc(item.name)}${item.option ? ` (${esc(item.option)})` : ""} — ${item.quantity} × ${price(item.price)}`
    ),
    "",
    `<b>Разом: ${price(total)}</b>`,
  ].join("\n")
}

// A crude per-IP throttle. Enough to stop a form being hammered; it lives in
// process memory, so it resets on deploy and is per-instance — good enough for
// a shop's contact form, not a substitute for a real rate limiter.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  )

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent)

    return true
  }

  recent.push(now)
  hits.set(ip, recent)

  return false
}

/** A malformed body is a 400, not a crash. */
async function readBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/**
 * One bot, two chats: contact-form messages and cart orders are read by
 * different people, so they land in different places.
 *
 * The bot has to be a member of both chats, otherwise Telegram answers 403.
 */
function chatIdFor(kind: Lead["kind"]) {
  const variable =
    kind === "order" ? "TELEGRAM_ORDER_CHAT_ID" : "TELEGRAM_CONTACT_CHAT_ID"

  return {
    chatId:
      kind === "order"
        ? process.env.TELEGRAM_ORDER_CHAT_ID
        : process.env.TELEGRAM_CONTACT_CHAT_ID,
    variable,
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
    "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Забагато спроб. Спробуйте за хвилину." },
      { status: 429 }
    )
  }

  const parsed = leadSchema.safeParse(await readBody(request))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Перевірте заповнені поля." },
      { status: 400 }
    )
  }

  // The honeypot was filled — a bot. Answer 200 so it learns nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const { chatId, variable } = chatIdFor(parsed.data.kind)

  if (!token || !chatId) {
    logger.error(
      `Telegram is not configured — set TELEGRAM_BOT_TOKEN and ${variable}`
    )

    return NextResponse.json(
      { error: "Форма тимчасово недоступна. Зателефонуйте нам, будь ласка." },
      { status: 503 }
    )
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(parsed.data),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Telegram responded ${response.status}: ${await response.text()}`
      )
    }
  } catch (error) {
    logError(error, "Failed to deliver a lead to Telegram", {
      kind: parsed.data.kind,
    })

    return NextResponse.json(
      { error: "Не вдалося надіслати. Спробуйте ще раз або зателефонуйте." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
