import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import { CategoryCarousel } from "@/components/page-builder/components/elements/CategoryCarousel"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import {
  fetchCategoryCounts,
  fetchTopCategories,
} from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * Tiles come from the Category collection and the counts are computed from the
 * products themselves — nothing here is typed in by hand, so the grid cannot
 * drift out of sync with the catalog the way the old manual cards did.
 */
export async function StrapiHomeCategories({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-categories">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const t = await getTranslations({ locale, namespace: "shop.categories" })
  const { title, link } = component

  const [categoriesResponse, counts] = await Promise.all([
    fetchTopCategories(locale),
    fetchCategoryCounts(locale),
  ])

  const countBySlug = new Map(counts.map((c) => [c.slug, c.count]))
  // Show every category — the rail scrolls (swipe or arrows), so there is no
  // reason to cap it the way the old fixed grid did.
  const categories = [...(categoriesResponse?.data ?? [])]

  if (!categories.length) {
    return null
  }

  // Products live in subcategories, so a category's tally is the sum of its
  // subcategories' counts.
  const countForCategory = (category: (typeof categories)[number]): number =>
    (category.subcategories ?? []).reduce(
      (sum, sub) => sum + (countBySlug.get(sub.slug ?? "") ?? 0),
      0
    )

  return (
    <section
      className={cn(SECTION_X_PADDING, "bg-brand-green font-golos py-8")}
    >
      <CategoryCarousel
        // Arrows only once the rail overflows a desktop view (6 per view).
        showArrows={categories.length > 6}
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
              className="font-oswald text-brand-gold hover:text-brand-cream shrink-0 text-[15px] tracking-[0.04em] whitespace-nowrap uppercase transition-colors"
            />
          ) : null
        }
        items={categories.map((category) => (
          <AppLink
            key={category.documentId}
            // A tile opens the category's subcategory page, not the catalog.
            href={`/category/${category.slug}`}
            unstyled
            className="border-brand-border bg-brand-green hover:border-brand-orange group/tile block h-full overflow-hidden rounded-xl border transition-colors"
          >
            <span className="bg-brand-surface relative block h-26 w-full overflow-hidden">
              {category.image ? (
                <StrapiBasicImage
                  component={
                    {
                      media: category.image,
                      alt: category.name,
                    } as unknown as Data.Component<"utilities.basic-image">
                  }
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 600px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover/tile:scale-105"
                />
              ) : null}
            </span>
            <span className="block p-3.5 text-center">
              <span className="font-oswald text-brand-cream block text-base tracking-[0.04em] uppercase">
                {category.name}
              </span>
              <span className="text-brand-muted mt-1 block text-[12.5px]">
                {t("items", { count: countForCategory(category) })}
              </span>
            </span>
          </AppLink>
        ))}
      />
    </section>
  )
}

StrapiHomeCategories.displayName = "StrapiHomeCategories"

export default StrapiHomeCategories
