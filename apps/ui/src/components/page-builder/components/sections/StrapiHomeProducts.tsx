import "server-only"

import type { Data } from "@repo/strapi-types"

import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { ProductCarousel } from "@/components/page-builder/components/elements/ProductCarousel"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/** Tiles per view at the widest breakpoint — beyond this the rail can scroll. */
const SLIDES_PER_VIEW = 4

export function StrapiHomeProducts({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-products">
}) {
  const { title, link, products } = component

  if (!products?.length) {
    return null
  }

  return (
    <section
      className={cn(SECTION_X_PADDING, "font-golos py-10 min-[900px]:py-16")}
    >
      <ProductCarousel
        showArrows={products.length > SLIDES_PER_VIEW}
        title={
          title ? (
            <h2 className="font-oswald text-brand-cream mb-0 text-[30px] leading-tight font-semibold tracking-[0.02em] uppercase min-[600px]:text-[40px]">
              {title}
            </h2>
          ) : null
        }
        link={
          link ? (
            <StrapiLink
              component={link}
              unstyled
              className="font-oswald text-brand-gold hover:text-brand-cream text-[15px] tracking-[0.04em] whitespace-nowrap uppercase transition-colors"
            />
          ) : null
        }
        items={products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ))}
      />
    </section>
  )
}

StrapiHomeProducts.displayName = "StrapiHomeProducts"

export default StrapiHomeProducts
