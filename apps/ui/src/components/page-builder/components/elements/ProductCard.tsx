import "server-only"

import type { Data } from "@repo/strapi-types"

import { AddToCartIconButton } from "@/components/page-builder/components/elements/AddToCartIconButton"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { badgeClass } from "@/lib/badges"
import type { CartItem } from "@/lib/cart"
import { cn } from "@/lib/styles"

/** Shared product tile used by the products grid and the catalog. */
export function ProductCard({
  product,
  sizes,
  cartItem,
}: {
  readonly product: Data.Component<"elements.product-card">
  /** Forwarded to next/image — only the grid knows how wide a tile ends up. */
  readonly sizes?: string
  /**
   * Present only where the tile is backed by a real Product (catalog, related).
   * Without it there is no "+" button at all — a button that cannot add to the
   * cart should not be drawn.
   */
  readonly cartItem?: Omit<CartItem, "quantity" | "option">
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
              badgeClass(product.badgeColor)
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
          {cartItem ? <AddToCartIconButton item={cartItem} /> : null}
        </span>
      </span>
    </StrapiLink>
  )
}

export default ProductCard
