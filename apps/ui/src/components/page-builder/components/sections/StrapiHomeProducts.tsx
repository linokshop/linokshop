import "server-only"

import type { Data } from "@repo/strapi-types"

import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiHomeProducts.displayName = "StrapiHomeProducts"

export default StrapiHomeProducts
