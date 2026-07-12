import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { cn } from "@/lib/styles"

const BADGE_COLORS = {
  bronze: "bg-brand-bronze",
  sale: "bg-brand-crimson",
  stock: "bg-brand-moss",
} as const

/** Shared product tile used by the products grid and the catalog. */
export function ProductCard({
  product,
  sizes,
}: {
  readonly product: Data.Component<"elements.product-card">
  /** Forwarded to next/image — only the grid knows how wide a tile ends up. */
  readonly sizes?: string
}) {
  return (
    <StrapiLink
      component={product.link}
      unstyled
      className="border-brand-border bg-brand-green hover:border-brand-orange flex h-full flex-col overflow-hidden rounded-md border transition-colors"
    >
      <span className="bg-brand-surface relative block h-40 w-full overflow-hidden min-[600px]:h-[210px]">
        {product.image?.media ? (
          <StrapiBasicImage
            component={product.image}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : null}
        {product.badge ? (
          <span
            className={cn(
              "font-oswald absolute top-3 left-3 rounded-[3px] px-2.5 py-1 text-[11px] leading-normal font-bold text-white uppercase",
              BADGE_COLORS[product.badgeColor ?? "bronze"]
            )}
          >
            {product.badge}
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col p-3.5 min-[600px]:p-4.5">
        {product.category ? (
          <span className="font-oswald text-brand-muted block text-xs tracking-[0.05em] uppercase">
            {product.category}
          </span>
        ) : null}
        {product.name ? (
          <span className="text-brand-cream group-hover:text-brand-orange mt-1.5 mb-3 block min-h-11 text-base leading-[1.35] font-semibold transition-colors">
            {product.name}
          </span>
        ) : null}

        <span className="mt-auto flex items-center justify-between gap-2">
          {/* In a 2-up mobile grid a tile is ~135px wide inside its padding —
              the old price only fits next to the price from 600px up. */}
          <span className="flex flex-col gap-0.5 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:gap-2">
            {product.price ? (
              <span className="font-oswald text-brand-gold text-xl leading-none font-semibold whitespace-nowrap min-[600px]:text-[23px]">
                {product.price}
              </span>
            ) : null}
            {product.oldPrice ? (
              <span className="text-brand-faded text-[13px] leading-none whitespace-nowrap line-through">
                {product.oldPrice}
              </span>
            ) : null}
          </span>
          {/* Decorative until the cart is wired up — a real button cannot be
              nested inside the card's anchor anyway. */}
          <span
            aria-hidden
            className="bg-brand-bronze group-hover:bg-brand-orange flex size-9 shrink-0 items-center justify-center rounded-md text-xl leading-none text-white transition-colors min-[600px]:size-10"
          >
            +
          </span>
        </span>
      </span>
    </StrapiLink>
  )
}

export default ProductCard
