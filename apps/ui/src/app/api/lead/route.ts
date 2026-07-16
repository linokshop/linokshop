import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { type ShippingMethod, orderTotals } from "@/lib/checkout"
import { getEnvVar } from "@/lib/env-vars"
import { formatPrice as price } from "@/lib/format"
import { isProduction } from "@/lib/general-helpers"
import { logError, logger } from "@/lib/logging"
import {
  fetchProductBySlug,
  fetchPromoByCode,
} from "@/lib/strapi-api/content/server"

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

/**
 * Only the slug, the chosen option and the quantity come from the browser.
 * Names and prices are re-read from Strapi below: a client-supplied price is a
 * price anyone can edit in devtools, and a cart sitting in localStorage for a
 * month would otherwise re-send a price we no longer charge.
 */
const orderItemSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  option: z.string().trim().max(100).optional(),
  quantity: z.number().int().min(1).max(99),
})

const orderSchema = z.object({
  kind: z.literal("order"),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  shipping: z.enum(["pickup", "branch", "courier"]),
  city: z.string().trim().max(120).optional(),
  branch: z.string().trim().max(200).optional(),
  street: z.string().trim().max(200).optional(),
  comment: z.string().trim().max(500).optional(),
  payment: z.enum(["card", "cash"]),
  /**
   * What the customer says they hold on «Дія». Payment happens outside this
   * site, so this is a note for whoever calls them back — never a charge.
   */
  vetAmount: z.number().int().min(0).max(1_000_000).optional(),
  /** Only the code travels; the discount itself is looked up server-side. */
  promo: z.string().trim().max(40).optional(),
  items: z.array(orderItemSchema).min(1).max(50),
  company: z.string().max(200).optional(),
})

const leadSchema = z.discriminatedUnion("kind", [contactSchema, orderSchema])

type Lead = z.infer<typeof leadSchema>

// The shop reads Telegram in Ukrainian regardless of which locale the customer
// ordered from — these labels are for staff, not for the buyer.
const PAYMENT_LABELS: Record<string, string> = {
  card: "Картка онлайн",
  cash: "Готівкою / карткою при отриманні",
}

const SHIPPING_LABELS: Record<ShippingMethod, string> = {
  pickup: "Самовивіз — Житомир, вул. Народицька, 15",
  branch: "Відділення / поштомат Нової Пошти",
  courier: "Курʼєр Нової Пошти",
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

interface PricedItem {
  readonly name: string
  readonly option?: string
  readonly price: number
  readonly quantity: number
}

/**
 * Re-prices the order from Strapi. The browser only says *what* and *how many*;
 * what it costs is decided here.
 *
 * A slug that no longer resolves (unpublished, renamed) fails the whole order
 * rather than quietly dropping a line — the customer must not be told "accepted"
 * for a basket we cannot fulfil.
 */
async function repriceItems(
  items: readonly { slug: string; option?: string; quantity: number }[]
): Promise<PricedItem[]> {
  const priced = await Promise.all(
    items.map(async (item) => {
      const response = await fetchProductBySlug(item.slug, "uk")
      const product = response?.data

      if (!product?.name || product.price == null) {
        throw new Error(`Product '${item.slug}' not found or has no price`)
      }

      return {
        name: product.name,
        option: item.option,
        price: product.price,
        quantity: item.quantity,
      }
    })
  )

  return priced
}

function buildContactMessage(lead: Extract<Lead, { kind: "contact" }>): string {
  return [
    ...testBanner(),
    "<b>📨 Повідомлення з сайту</b>",
    "",
    `<b>Ім'я:</b> ${esc(lead.name)}`,
    `<b>Телефон:</b> ${esc(lead.phone)}`,
    ...(lead.message ? ["", esc(lead.message)] : []),
  ].join("\n")
}

/**
 * A reference the customer can quote back. It is generated here and printed in
 * the Telegram message, so the number on the "order accepted" screen is one the
 * shop can actually find. (The mockup derived it from the cart total, which
 * would have looked real while matching nothing.)
 */
const makeOrderNo = (): string =>
  `ЛН-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`

/** Where the parcel goes, spelled out per shipping method. */
function addressLines(lead: Extract<Lead, { kind: "order" }>): string[] {
  if (lead.shipping === "pickup") {
    return []
  }

  return [
    ...(lead.city ? [`<b>Місто:</b> ${esc(lead.city)}`] : []),
    ...(lead.branch ? [`<b>Відділення:</b> ${esc(lead.branch)}`] : []),
    ...(lead.street ? [`<b>Адреса:</b> ${esc(lead.street)}`] : []),
    ...(lead.comment ? [`<b>Коментар:</b> ${esc(lead.comment)}`] : []),
  ]
}

/**
 * The money lines. Every number here is recomputed from Strapi — the browser's
 * idea of the price, the discount and the delivery cost is discarded.
 */
function buildOrderMessage(
  lead: Extract<Lead, { kind: "order" }>,
  items: readonly PricedItem[],
  promo: undefined | { code: string; percent: number },
  orderNo: string
): string {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const { discount, shipping, total } = orderTotals(
    subtotal,
    promo?.percent ?? 0,
    lead.shipping
  )

  // Payment is arranged off-site, so «Дія» is just how they intend to split it.
  const vetPay = Math.min(lead.vetAmount ?? 0, total)
  const remainder = Math.max(0, total - vetPay)
  const payLabel = PAYMENT_LABELS[lead.payment] ?? lead.payment

  return [
    ...testBanner(),
    `<b>🛒 Нове замовлення ${esc(orderNo)}</b>`,
    "",
    `<b>Отримувач:</b> ${esc(lead.name)}`,
    `<b>Телефон:</b> ${esc(lead.phone)}`,
    "",
    `<b>Доставка:</b> ${SHIPPING_LABELS[lead.shipping]}`,
    ...addressLines(lead),
    "",
    `<b>Оплата:</b> ${payLabel}`,
    ...(vetPay > 0
      ? [
          `<b>«Дія»:</b> ${price(vetPay)}${remainder > 0 ? ` + ${payLabel.toLowerCase()} ${price(remainder)}` : " (покриває все)"}`,
        ]
      : []),
    "",
    "<b>Товари:</b>",
    ...items.map(
      (item) =>
        `• ${esc(item.name)}${item.option ? ` (${esc(item.option)})` : ""} — ${item.quantity} × ${price(item.price)}`
    ),
    "",
    `Сума: ${price(subtotal)}`,
    ...(discount > 0
      ? [
          `Знижка (${esc(promo?.code ?? "")} −${promo?.percent}%): −${price(discount)}`,
        ]
      : []),
    `Доставка: ${shipping === 0 ? "безкоштовно" : price(shipping)}`,
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

  const orderNo = parsed.data.kind === "order" ? makeOrderNo() : undefined

  let text: string
  try {
    if (parsed.data.kind === "contact") {
      text = buildContactMessage(parsed.data)
    } else {
      // The code is re-validated here: a browser that faked a discount at
      // /API/promo still gets priced from what Strapi actually says.
      const [items, promo] = await Promise.all([
        repriceItems(parsed.data.items),
        parsed.data.promo ? fetchPromoByCode(parsed.data.promo) : undefined,
      ])
      text = buildOrderMessage(parsed.data, items, promo, orderNo ?? "")
    }
  } catch (error) {
    logError(error, "Could not price the order from Strapi")

    return NextResponse.json(
      { error: "Товар у кошику більше недоступний. Оновіть сторінку." },
      { status: 409 }
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
          text,
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

  // The number goes back so the confirmation screen shows the same reference
  // that just landed in Telegram.
  return NextResponse.json({ ok: true, orderNo })
}
