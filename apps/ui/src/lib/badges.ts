/**
 * One badge palette for the whole shop.
 *
 * It used to live in three places (the product tile, the product page, the card
 * grid) with three slightly different maps — a "sale" badge could end up a
 * different colour depending on where you looked at it.
 */
export const BADGE_COLORS = {
  bronze: "bg-brand-bronze text-white",
  orange: "bg-brand-orange text-brand-navy",
  sale: "bg-brand-crimson text-white",
  stock: "bg-brand-moss text-white",
} as const

export type BadgeColor = keyof typeof BADGE_COLORS

export const badgeClass = (color: string | null | undefined) =>
  BADGE_COLORS[(color ?? "bronze") as BadgeColor] ?? BADGE_COLORS.bronze
