"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

import type { CheckoutLine } from "@/components/cart/useCheckout"
import type { CartItem } from "@/lib/cart"
import { FREE_SHIPPING_FROM, LOW_STOCK_AT } from "@/lib/checkout"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/styles"

export interface CrossSellItem extends Omit<CartItem, "quantity" | "option"> {
  readonly category: string | null
}

/**
 * Cart lines, the free-shipping nudge above them and the "often bought together"
 * rail below. Quantities are capped by what the shelf actually holds.
 */
export function CartLines({
  lines,
  lineIdOf,
  subtotal,
  discount,
  shippingIsPickup,
  crossSell,
  onQuantity,
  onRemove,
  onAdd,
}: {
  readonly lines: readonly CheckoutLine[]
  readonly lineIdOf: (item: { slug: string; option?: string }) => string
  readonly subtotal: number
  readonly discount: number
  readonly shippingIsPickup: boolean
  readonly crossSell: readonly CrossSellItem[]
  readonly onQuantity: (id: string, quantity: number) => void
  readonly onRemove: (id: string) => void
  readonly onAdd: (item: CrossSellItem) => void
}) {
  const t = useTranslations("shop.cart")
  const tc = useTranslations("shop.common")
  const afterDiscount = subtotal - discount
  const remaining = Math.max(0, FREE_SHIPPING_FROM - afterDiscount)
  const reached = remaining === 0
  const pct = Math.min(
    100,
    Math.round((afterDiscount / FREE_SHIPPING_FROM) * 100)
  )

  return (
    <div>
      {/* Pickup is always free, so the nudge would be nonsense there. */}
      {shippingIsPickup ? null : (
        <div className="border-brand-border bg-brand-green mb-5 rounded-xl border px-5.5 py-4.5">
          <div className="text-brand-nav mb-3 flex items-center gap-2.5 text-[14.5px]">
            <span aria-hidden className="text-[17px]">
              {reached ? "🎉" : "🚚"}
            </span>
            <span>
              {reached
                ? t("freeShipReached")
                : t("freeShipRemaining", { amount: formatPrice(remaining) })}
            </span>
          </div>
          <div className="border-brand-field bg-brand-surface h-[7px] overflow-hidden rounded-md border">
            <div
              className="from-brand-bronze to-brand-gold h-full rounded-md bg-gradient-to-r transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <ul className="border-brand-border bg-brand-green mb-5 list-none overflow-hidden rounded-xl border">
        {lines.map((line) => {
          const id = lineIdOf(line)
          const low = line.stockQty != null && line.stockQty <= LOW_STOCK_AT

          return (
            <li
              key={id}
              className="border-brand-border flex flex-wrap items-center gap-5 border-b p-5 last:border-b-0"
            >
              <span className="bg-brand-surface relative block size-24 shrink-0 overflow-hidden rounded-lg">
                {line.imageUrl ? (
                  <Image
                    src={line.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </span>

              <span className="min-w-[150px] flex-1">
                {line.category ? (
                  <span className="font-oswald text-brand-muted block text-xs tracking-[0.05em] uppercase">
                    {line.category}
                  </span>
                ) : null}
                <Link
                  href={`/product/${line.slug}`}
                  className="text-brand-cream hover:text-brand-orange my-1 block text-[17px] font-semibold transition-colors"
                >
                  {line.name}
                </Link>
                {line.option ? (
                  <span className="text-brand-muted mb-1.5 block text-[13px]">
                    {line.option}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "block text-[12.5px]",
                    low ? "text-brand-gold" : "text-brand-moss"
                  )}
                >
                  {low
                    ? t("lowStock", { count: line.stockQty ?? 0 })
                    : t("inStockDot")}
                </span>
              </span>

              <span className="flex flex-col items-center gap-2">
                <span className="border-brand-field flex items-center overflow-hidden rounded-lg border-[1.5px]">
                  <QtyButton
                    label={t("decreaseQtyFor", { name: line.name })}
                    onClick={() => onQuantity(id, line.quantity - 1)}
                  >
                    −
                  </QtyButton>
                  <span className="font-oswald text-brand-cream w-9.5 text-center">
                    {line.quantity}
                  </span>
                  <QtyButton
                    label={t("increaseQtyFor", { name: line.name })}
                    // The shelf is the ceiling — never let the cart promise more.
                    disabled={line.quantity >= line.maxQty}
                    onClick={() =>
                      onQuantity(id, Math.min(line.maxQty, line.quantity + 1))
                    }
                  >
                    +
                  </QtyButton>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  className="text-brand-faded hover:text-brand-crimson cursor-pointer text-[13px] transition-colors"
                >
                  {t("removeLine")}
                </button>
              </span>

              <span className="w-32 text-right">
                <span className="font-oswald text-brand-gold block text-[21px] font-semibold">
                  {formatPrice(line.price * line.quantity)}
                </span>
                {line.quantity > 1 ? (
                  <span className="text-brand-muted mt-0.5 block text-[12.5px]">
                    {t("perUnit", { price: formatPrice(line.price) })}
                  </span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>

      {crossSell.length ? (
        <div className="mb-7">
          <div className="font-oswald text-brand-sand mb-3.5 text-[15px] tracking-[0.06em] uppercase">
            {t("oftenTogether")}
          </div>
          <div className="grid gap-3.5 min-[600px]:grid-cols-2">
            {crossSell.map((item) => (
              <div
                key={item.slug}
                className="border-brand-border bg-brand-green flex items-center gap-3.5 rounded-[10px] border p-3.5"
              >
                <span className="bg-brand-surface relative block size-13.5 shrink-0 overflow-hidden rounded-lg">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="54px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-brand-cream block text-[14.5px] leading-tight font-semibold">
                    {item.name}
                  </span>
                  <span className="font-oswald text-brand-gold mt-0.5 block text-base">
                    {formatPrice(item.price)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onAdd(item)}
                  aria-label={tc("addToCartFor", { name: item.name })}
                  className="border-brand-field bg-brand-surface text-brand-gold hover:bg-brand-bronze size-10 shrink-0 cursor-pointer rounded-lg border text-xl leading-none transition-colors hover:text-white"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function QtyButton({
  label,
  onClick,
  disabled,
  children,
}: {
  readonly label: string
  readonly onClick: () => void
  readonly disabled?: boolean
  readonly children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="text-brand-nav hover:text-brand-cream flex h-11 w-9.5 cursor-pointer items-center justify-center text-lg transition-colors disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}

export default CartLines
