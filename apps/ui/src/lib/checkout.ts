/**
 * Checkout pricing rules — the single source of truth for both sides.
 *
 * The cart renders these numbers in the browser and `/api/lead` recomputes the
 * order from them on the server. Keeping one module means the two can never
 * quietly disagree; a tariff change is one edit here.
 */

/** Order value (after discount) from which Nova Poshta delivery is free. */
export const FREE_SHIPPING_FROM = 1500

export type ShippingMethod = "pickup" | "branch" | "courier"
export type PaymentMethod = "card" | "cash"

/** Base cost per method; `pickup` is always free, the rest are free over the threshold. */
const SHIPPING_COST: Record<ShippingMethod, number> = {
  pickup: 0,
  branch: 70,
  courier: 110,
}

export const SHIPPING_METHODS: readonly ShippingMethod[] = [
  "pickup",
  "branch",
  "courier",
]

export const isShippingMethod = (value: unknown): value is ShippingMethod =>
  typeof value === "string" &&
  (SHIPPING_METHODS as readonly string[]).includes(value)

/**
 * What delivery costs for this order. Free pickup, and free Nova Poshta once the
 * discounted subtotal clears the threshold.
 */
export function shippingCostFor(
  method: ShippingMethod,
  subtotalAfterDiscount: number
): number {
  if (method === "pickup") {
    return 0
  }

  return subtotalAfterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST[method]
}

/** Base tariff regardless of the free-shipping threshold — for the "від 70 ₴" hint. */
export const baseShippingCost = (method: ShippingMethod): number =>
  SHIPPING_COST[method]

export interface OrderTotals {
  readonly subtotal: number
  readonly discount: number
  readonly shipping: number
  readonly total: number
}

/**
 * Money for one order. `discountPercent` must come from a validated promo — the
 * browser never gets to name its own discount.
 */
export function orderTotals(
  subtotal: number,
  discountPercent: number,
  method: ShippingMethod
): OrderTotals {
  const discount =
    discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0
  const afterDiscount = subtotal - discount
  const shipping = shippingCostFor(method, afterDiscount)

  return { subtotal, discount, shipping, total: afterDiscount + shipping }
}

/** Nova Poshta quotes 1–2 days; we promise the later end of it. */
const DELIVERY_DAYS = 2

/**
 * "You should get it around 18 липня", in the reader's language.
 *
 * Lives here rather than inline in the page so the clock is not read during
 * render — that makes the server and the browser disagree on today's date.
 */
export function estimatedDeliveryDate(locale: string): string {
  const formatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-UA" : "uk-UA",
    { day: "numeric", month: "long" }
  )

  return formatter.format(
    new Date(Date.now() + DELIVERY_DAYS * 24 * 60 * 60 * 1000)
  )
}

/** Cart lines cannot exceed what is on the shelf; an untracked product allows a sane max. */
export const UNTRACKED_STOCK_MAX = 99
export const LOW_STOCK_AT = 5

export const maxQuantityFor = (stockQty?: number | null): number =>
  stockQty == null || stockQty <= 0 ? UNTRACKED_STOCK_MAX : stockQty
