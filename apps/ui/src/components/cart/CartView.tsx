"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { useCart } from "@/lib/cart"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/styles"

const PAYMENT_METHODS = [
  { id: "card", label: "Картка онлайн" },
  { id: "cod", label: "Готівкою / карткою при отриманні" },
] as const

const FIELD =
  "bg-brand-surface text-brand-nav placeholder:text-brand-muted focus:border-brand-bronze w-full rounded-lg border border-[#2f4f3a] px-4 py-3.5 text-[15px] outline-none transition-colors"

type Status = "idle" | "sending" | "sent" | "error"

export function CartView() {
  const { items, count, total, setQuantity, remove, clear } = useCart()

  const [payment, setPayment] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("card")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    office: "",
  })
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string>()

  const isFormFilled =
    form.name.trim().length > 1 && form.phone.trim().length > 5
  const canSubmit = isFormFilled && status !== "sending" && items.length > 0

  /**
   * The order goes to Telegram (via /API/lead) and nowhere else — there is no
   * Order collection yet. On success the cart is cleared, so a refresh cannot
   * resend it.
   */
  async function submitOrder() {
    if (!canSubmit) return

    setStatus("sending")
    setError(undefined)

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "order",
          name: form.name,
          phone: form.phone,
          city: form.city || undefined,
          office: form.office || undefined,
          payment,
          items: items.map((item) => ({
            name: item.name,
            option: item.option,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const body = await readError(response)
        throw new Error(body.error ?? "Не вдалося надіслати замовлення.")
      }

      clear()
      setStatus("sent")
    } catch (caught) {
      setStatus("error")
      setError(
        caught instanceof Error
          ? caught.message
          : "Не вдалося надіслати замовлення."
      )
    }
  }

  if (status === "sent") {
    return (
      <div className="border-brand-border bg-brand-green rounded-xl border p-12 text-center">
        <p className="text-brand-cream mb-2 text-xl font-semibold">
          Замовлення прийнято
        </p>
        <p className="text-brand-nav mb-6 text-[15px]">
          Ми зателефонуємо вам найближчим часом, щоб підтвердити деталі.
        </p>
        <Link
          href="/catalog"
          className="bg-brand-bronze font-oswald hover:bg-brand-orange inline-flex rounded-lg px-7 py-3.5 text-sm tracking-[0.05em] text-white uppercase transition-colors"
        >
          Продовжити покупки
        </Link>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="border-brand-border bg-brand-green rounded-xl border p-12 text-center">
        <p className="text-brand-cream mb-2 text-xl font-semibold">
          Кошик порожній
        </p>
        <p className="text-brand-nav mb-6 text-[15px]">
          Оберіть спорядження в каталозі — воно з&apos;явиться тут.
        </p>
        <Link
          href="/catalog"
          className="bg-brand-bronze font-oswald hover:bg-brand-orange inline-flex rounded-lg px-7 py-3.5 text-sm tracking-[0.05em] text-white uppercase transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="grid items-start gap-8 min-[900px]:grid-cols-[1fr_400px]">
      <div>
        <ul className="border-brand-border bg-brand-green mb-7 list-none overflow-hidden rounded-xl border">
          {items.map((item) => (
            <li
              key={item.slug}
              className="border-brand-border flex flex-wrap items-center gap-5 border-b p-5 last:border-b-0"
            >
              <span className="bg-brand-surface relative block size-24 shrink-0 overflow-hidden rounded-lg">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </span>

              <span className="min-w-[150px] flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-brand-cream hover:text-brand-orange block text-[17px] font-semibold transition-colors"
                >
                  {item.name}
                </Link>
                {item.option ? (
                  <span className="text-brand-muted mt-1 block text-[13px]">
                    {item.option}
                  </span>
                ) : null}
              </span>

              <span className="flex items-center overflow-hidden rounded-lg border-[1.5px] border-[#2f4f3a]">
                <QuantityButton
                  label={`Зменшити кількість: ${item.name}`}
                  onClick={() => setQuantity(item.slug, item.quantity - 1)}
                >
                  −
                </QuantityButton>
                <span className="font-oswald text-brand-cream w-9.5 text-center">
                  {item.quantity}
                </span>
                <QuantityButton
                  label={`Збільшити кількість: ${item.name}`}
                  onClick={() => setQuantity(item.slug, item.quantity + 1)}
                >
                  +
                </QuantityButton>
              </span>

              <span className="font-oswald text-brand-gold ml-auto w-30 text-right text-[21px] font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>

              <button
                type="button"
                onClick={() => remove(item.slug)}
                aria-label={`Прибрати з кошика: ${item.name}`}
                className="text-brand-faded hover:text-brand-orange cursor-pointer text-xl transition-colors"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <h2 className="font-oswald text-brand-cream mb-4.5 text-2xl font-semibold tracking-[0.02em] uppercase">
          Дані отримувача
        </h2>
        <div className="mb-3.5 grid gap-3.5 min-[600px]:grid-cols-2">
          <input
            className={FIELD}
            placeholder="Ім'я та прізвище"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={FIELD}
            placeholder="Телефон"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <input
          className={cn(FIELD, "mb-3.5")}
          placeholder="Місто"
          autoComplete="address-level2"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className={cn(FIELD, "mb-7")}
          placeholder="Відділення Нової Пошти"
          value={form.office}
          onChange={(e) => setForm({ ...form, office: e.target.value })}
        />

        <h2 className="font-oswald text-brand-cream mb-4.5 text-2xl font-semibold tracking-[0.02em] uppercase">
          Оплата
        </h2>
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={cn(
                "bg-brand-green flex cursor-pointer items-center gap-3.5 rounded-[10px] border-[1.5px] p-4 transition-colors",
                payment === method.id
                  ? "border-brand-bronze"
                  : "border-brand-border hover:border-[#3f6a4d]"
              )}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === method.id}
                onChange={() => setPayment(method.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  payment === method.id
                    ? "border-brand-bronze"
                    : "border-[#3a5a44]"
                )}
              >
                {payment === method.id ? (
                  <span className="bg-brand-bronze block size-2.5 rounded-full" />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[15.5px]",
                  payment === method.id ? "text-brand-cream" : "text-brand-nav"
                )}
              >
                {method.label}
              </span>
            </label>
          ))}

          <Link
            href="/veteran"
            className="bg-brand-steel border-brand-orange hover:bg-brand-steel/80 flex items-center gap-3.5 rounded-[10px] border-[1.5px] p-4 transition-colors"
          >
            <span className="flex-1">
              <span className="block text-[15.5px] font-semibold text-white">
                Програма «Ветеранський спорт» через «Дія»
              </span>
              <span className="text-brand-mist mt-0.5 block text-[13px]">
                Для ветеранів та ветеранок — державна підтримка
              </span>
            </span>
            <span aria-hidden className="text-brand-orange text-lg">
              →
            </span>
          </Link>
        </div>
      </div>

      <aside className="border-brand-border bg-brand-green rounded-xl border p-6.5">
        <div className="font-oswald text-brand-sand mb-5 text-lg tracking-[0.06em] uppercase">
          Разом
        </div>

        <SummaryRow label={`Товари (${count})`} value={formatPrice(total)} />
        <SummaryRow label="Доставка" value="за тарифами НП" />

        <div className="border-brand-border mt-3.5 flex items-baseline justify-between border-t pt-4.5">
          <span className="font-oswald text-brand-cream text-lg uppercase">
            До сплати
          </span>
          <span className="font-oswald text-brand-gold text-[32px] font-bold">
            {formatPrice(total)}
          </span>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submitOrder}
          className="bg-brand-bronze font-oswald hover:bg-brand-orange mt-5 w-full cursor-pointer rounded-lg py-4.5 text-[17px] font-medium tracking-[0.05em] text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status === "sending" ? "Надсилаємо…" : "Оформити замовлення"}
        </button>

        {status === "error" && error ? (
          <p className="text-brand-orange mt-3 text-center text-sm">{error}</p>
        ) : null}
        {!isFormFilled && status !== "error" ? (
          <p className="text-brand-muted mt-3 text-center text-[13px]">
            Заповніть ім&apos;я та телефон, щоб оформити замовлення.
          </p>
        ) : null}

        <Link
          href="/catalog"
          className="text-brand-muted hover:text-brand-cream mt-3.5 block text-center text-sm transition-colors"
        >
          ← Продовжити покупки
        </Link>
      </aside>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div className="text-brand-nav flex justify-between py-2 text-[15px]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function QuantityButton({
  label,
  onClick,
  children,
}: {
  readonly label: string
  readonly onClick: () => void
  readonly children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-brand-nav hover:text-brand-cream flex h-11 w-9.5 cursor-pointer items-center justify-center text-lg transition-colors"
    >
      {children}
    </button>
  )
}

/** The error body may be missing or not JSON at all — never let that throw. */
async function readError(response: Response): Promise<{ error?: string }> {
  try {
    return (await response.json()) as { error?: string }
  } catch {
    return {}
  }
}

export default CartView
