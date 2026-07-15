"use client"

import type { Data } from "@repo/strapi-types"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { useCart } from "@/lib/cart"

/** The cart button, with a live item count from the cart store. */
export function HeaderCartButton({
  component,
}: {
  readonly component: Data.Component<"utilities.link">
}) {
  const { count } = useCart()
  const tc = useTranslations("shop.common")

  // The CMS label may still carry a hardcoded count from the mock era
  // («Кошик · 2») — drop everything after the separator.
  const label =
    (component.label ?? tc("cart")).split("·", 1)[0]?.trim() ?? tc("cart")
  const href =
    component.type === "external"
      ? (component.href ?? "/cart")
      : (component.page?.fullPath ?? "/cart")

  return (
    <Link
      href={href}
      className="bg-brand-bronze font-oswald inline-flex shrink-0 items-center rounded-sm px-3 py-2.5 text-sm font-medium tracking-[0.04em] text-white uppercase transition-all hover:brightness-110 min-[600px]:px-4.5"
    >
      {label}
      {/* No count on the server render — the store's server snapshot is empty,
          so hydration matches and the real number arrives right after mount. */}
      {count > 0 ? ` · ${count}` : null}
    </Link>
  )
}

export default HeaderCartButton
