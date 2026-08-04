"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useRef } from "react"

import type { CheckoutLine } from "@/components/cart/useCheckout"
import type { CartItem } from "@/lib/cart"
import { LOW_STOCK_AT } from "@/lib/checkout"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/styles"

export interface CrossSellItem extends Omit<CartItem, "quantity" | "option"> {
  readonly category: string | null
}

/** Card width plus the gap — one arrow press moves by exactly one card. */
const CROSS_CARD_STEP = 320

/**
 * Cart lines and the "often bought together" rail below. Quantities are capped
 * by what the shelf actually holds.
 */
export function CartLines({
  lines,
  lineIdOf,
  crossSell,
  onQuantity,
  onRemove,
  onAdd,
}: {
  readonly lines: readonly CheckoutLine[]
  readonly lineIdOf: (item: { slug: string; option?: string }) => string
  readonly crossSell: readonly CrossSellItem[]
  readonly onQuantity: (id: string, quantity: number) => void
  readonly onRemove: (id: string) => void
  readonly onAdd: (item: CrossSellItem) => void
}) {
  const t = useTranslations("shop.cart")
  const tc = useTranslations("shop.common")
  const crossTrack = useRef<HTMLDivElement>(null)

  /** One card-width nudge along the cross-sell rail. */
  const scrollCross = (direction: 1 | -1) => {
    crossTrack.current?.scrollBy({
      left: direction * CROSS_CARD_STEP,
      behavior: "smooth",
    })
  }

  return (
    <div>
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
          <div className="mb-3.5 flex items-center justify-between gap-4">
            <div className="font-oswald text-brand-sand text-[15px] tracking-[0.06em] uppercase">
              {t("oftenTogether")}
            </div>
            {/* Arrows only once the rail can actually move. */}
            {crossSell.length > 2 ? (
              <div className="flex gap-2">
                <CrossNav
                  label={t("crossPrev")}
                  onClick={() => scrollCross(-1)}
                >
                  ‹
                </CrossNav>
                <CrossNav label={t("crossNext")} onClick={() => scrollCross(1)}>
                  ›
                </CrossNav>
              </div>
            ) : null}
          </div>

          {/* A rail rather than a grid: the cards carry a full-width photo now,
              so two of them would push the checkout form off the first screen. */}
          <div
            ref={crossTrack}
            className="flex snap-x snap-proximity [scrollbar-width:none] gap-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          >
            {crossSell.map((item) => (
              <div
                key={item.slug}
                className="border-brand-border bg-brand-green hover:border-brand-field-hover w-75 flex-none snap-start overflow-hidden rounded-md border transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
              >
                <span className="bg-brand-surface relative block h-37.5 w-full overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </span>
                <div className="p-4">
                  {item.category ? (
                    <div className="font-oswald text-brand-muted text-xs tracking-[0.05em] uppercase">
                      {item.category}
                    </div>
                  ) : null}
                  <div className="text-brand-cream mt-1.5 mb-3 min-h-10 text-[15px] leading-snug font-semibold">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-oswald text-brand-gold text-[19px] font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                      aria-label={tc("addToCartFor", { name: item.name })}
                      className="bg-brand-bronze hover:bg-brand-orange size-9 shrink-0 cursor-pointer rounded-md text-lg leading-none text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Round arrow beside the "often bought together" heading. */
function CrossNav({
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
      className="border-brand-field bg-brand-green text-brand-gold hover:bg-brand-surface flex size-9 cursor-pointer items-center justify-center rounded-full border text-base transition-colors"
    >
      {children}
    </button>
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
