import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { ProductCarousel } from "@/components/page-builder/components/elements/ProductCarousel"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { toCartItem, toProductCard } from "@/lib/product-card"
import { fetchCatalogProducts } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/** Tiles per view at the widest breakpoint — beyond this the rail can scroll. */
const SLIDES_PER_VIEW = 4

/**
 * The rail shows real products from the collection: either the ones an editor
 * picked, or — if none are picked — the most popular ones.
 *
 * It used to hold hand-typed copies of products, which is how their links ended
 * up pointing at `/product` with no slug (a 404) and why the "+" button could
 * not add anything to the cart.
 */
export async function StrapiHomeProducts({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-products">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const { title, link, products, limit } = component

  const picked = products ?? []
  const items = picked.length
    ? picked.slice(0, limit ?? 6)
    : ((
        await fetchCatalogProducts(locale, {
          categories: [],
          brands: [],
          inStock: false,
          sort: "popular",
          page: 1,
          pageSize: limit ?? 6,
        })
      )?.data ?? [])

  if (!items.length) {
    return null
  }

  return (
    <section
      className={cn(SECTION_X_PADDING, "font-golos py-10 min-[900px]:py-16")}
    >
      <ProductCarousel
        showArrows={items.length > SLIDES_PER_VIEW}
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
        items={items.map((product) => (
          <ProductCard
            key={product.documentId}
            product={toProductCard(product)}
            cartItem={toCartItem(product)}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ))}
      />
    </section>
  )
}

StrapiHomeProducts.displayName = "StrapiHomeProducts"

export default StrapiHomeProducts
