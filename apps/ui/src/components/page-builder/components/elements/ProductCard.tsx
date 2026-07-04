import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

/** Shared product tile used by the products grid and the catalog. */
export function ProductCard({
  product,
}: {
  readonly product: Data.Component<"elements.product-card">
}) {
  return (
    <article className="border-brand-border bg-brand-surface flex flex-col overflow-hidden rounded-sm border">
      <div className="bg-brand-navy relative aspect-square">
        {product.image ? (
          <StrapiBasicImage
            component={product.image}
            fill
            className="object-cover"
          />
        ) : null}
        {product.badge ? (
          <span className="bg-brand-orange text-brand-navy font-oswald absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold uppercase">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category ? (
          <span className="font-oswald text-brand-muted text-xs tracking-wide uppercase">
            {product.category}
          </span>
        ) : null}
        {product.name ? (
          <StrapiLink
            component={product.link}
            className="text-brand-cream hover:text-brand-orange font-medium no-underline transition-colors"
          >
            {product.name}
          </StrapiLink>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.price ? (
              <span className="font-oswald text-brand-cream text-lg font-semibold">
                {product.price}
              </span>
            ) : null}
            {product.oldPrice ? (
              <span className="text-brand-muted text-sm line-through">
                {product.oldPrice}
              </span>
            ) : null}
          </div>
          <span
            aria-hidden
            className="bg-brand-bronze flex size-9 items-center justify-center rounded-sm text-xl leading-none text-white"
          >
            +
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
