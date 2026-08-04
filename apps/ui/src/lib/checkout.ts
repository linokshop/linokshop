/**
 * Checkout pricing rules — the single source of truth for both sides.
 *
 * The cart renders these numbers in the browser and `/api/lead` recomputes the
 * order from them on the server, so the two can never quietly disagree.
 *
 * Delivery is NOT part of the order total: it is quoted as "від X ₴ (залежить
 * від ваги)" from Nova Poshta and settled with the carrier, so `orderTotals`
 * only ever covers goods minus discount.
 */

export type ShippingMethod = "pickup" | "branch" | "courier"
export type PaymentMethod = "card" | "cash"

export const SHIPPING_METHODS: readonly ShippingMethod[] = [
  "pickup",
  "branch",
  "courier",
]

export const isShippingMethod = (value: unknown): value is ShippingMethod =>
  typeof value === "string" &&
  (SHIPPING_METHODS as readonly string[]).includes(value)

/**
 * Weight used to ask Nova Poshta for the cheapest ("від") delivery price. A
 * light parcel gives the floor tariff; the real cost rises with actual weight,
 * which is why the quote is labelled "від … (залежить від ваги)".
 */
export const CHEAPEST_QUOTE_WEIGHT_KG = 0.5

/**
 * What a combat veteran takes off the order by ticking the box in the cart.
 *
 * Nothing is checked: the shop would rather lose a tenth of an order now and
 * then than put paperwork between a veteran and a fishing rod.
 */
export const VETERAN_DISCOUNT_PERCENT = 10

export interface OrderTotals {
  readonly subtotal: number
  readonly discount: number
  readonly total: number
}

/**
 * Money for one order — goods minus a validated promo discount. Delivery is
 * quoted separately (see the summary), never folded in here. `discountPercent`
 * must come from a server-validated promo.
 */
export function orderTotals(
  subtotal: number,
  discountPercent: number
): OrderTotals {
  const discount =
    discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0

  return { subtotal, discount, total: subtotal - discount }
}

/** Cart lines cannot exceed what is on the shelf; an untracked product allows a sane max. */
export const UNTRACKED_STOCK_MAX = 99
export const LOW_STOCK_AT = 5

export const maxQuantityFor = (stockQty?: number | null): number =>
  stockQty == null || stockQty <= 0 ? UNTRACKED_STOCK_MAX : stockQty
