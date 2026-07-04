import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeProducts({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-products">
}) {
  const { title, products } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h2"
            className="font-oswald text-brand-cream mb-8 text-3xl font-bold uppercase"
          >
            {title}
          </Typography>
        ) : null}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products?.map((product) => (
            <article
              key={product.id}
              className="border-brand-border bg-brand-surface flex flex-col overflow-hidden rounded-sm border"
            >
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
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiHomeProducts.displayName = "StrapiHomeProducts"

export default StrapiHomeProducts
