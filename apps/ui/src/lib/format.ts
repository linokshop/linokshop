const PRICE_FORMAT = new Intl.NumberFormat("uk-UA")

/**
 * 1290 → "1 290 ₴".
 *
 * Lives in its own module on purpose: the cart store is a client module, and a
 * server component cannot call a function exported from one.
 */
export const formatPrice = (value: number) =>
  `${PRICE_FORMAT.format(Math.round(value))} ₴`
