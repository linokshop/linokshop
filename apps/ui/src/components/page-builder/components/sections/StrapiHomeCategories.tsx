import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import {
  fetchCategories,
  fetchCategoryCounts,
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
  const { title, link, limit } = component

  const [categoriesResponse, counts] = await Promise.all([
    fetchCategories(locale),
    fetchCategoryCounts(locale),
  ])

  const countBySlug = new Map(counts.map((c) => [c.slug, c.count]))
  const categories = [...(categoriesResponse?.data ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, limit ?? 6)

  if (!categories.length) {
    return null
  }

  return (
    <section
      className={cn(SECTION_X_PADDING, "bg-brand-green font-golos py-8")}
    >
      {title || link ? (
        <div className="mb-6.5 flex items-end justify-between gap-4">
          {title ? (
            <h2 className="font-oswald text-brand-cream mb-0 text-[30px] leading-tight font-semibold tracking-[0.02em] uppercase min-[600px]:text-[40px]">
              {title}
            </h2>
          ) : null}
          {link ? (
            <StrapiLink
              component={link}
              unstyled
              className="font-oswald text-brand-gold hover:text-brand-cream shrink-0 text-[15px] tracking-[0.04em] whitespace-nowrap uppercase transition-colors"
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4.5 min-[600px]:grid-cols-3 min-[1024px]:grid-cols-6">
        {categories.map((category) => (
          <AppLink
            key={category.documentId}
            // A tile filters the catalog rather than opening a page of its own.
            href={`/catalog?category=${category.slug}`}
            unstyled
            className="border-brand-border bg-brand-green hover:border-brand-orange group/tile block overflow-hidden rounded-xl border transition-colors"
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
                {t("items", {
                  count: countBySlug.get(category.slug ?? "") ?? 0,
                })}
              </span>
            </span>
          </AppLink>
        ))}
      </div>
    </section>
  )
}

StrapiHomeCategories.displayName = "StrapiHomeCategories"

export default StrapiHomeCategories
