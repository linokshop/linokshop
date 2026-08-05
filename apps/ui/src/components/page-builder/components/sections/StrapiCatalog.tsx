import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { CatalogBrowser } from "@/components/page-builder/components/elements/CatalogBrowser"
import { CategoryTileGrid } from "@/components/page-builder/components/elements/CategoryTileGrid"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import {
  fetchCategoryCounts,
  fetchTopCategories,
} from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The CMS entry point to the catalog. Tiles for the top-level categories sit
 * above the grid — the same "pick the next branch" widget a category page
 * shows for its subcategories, one level higher. Below that, everything lives
 * in {@link CatalogBrowser}, which the `/catalog/<category>[/<sub>[/<subsub>]]`
 * routes share — the grid, filters and pagination must not drift between them.
 */
export async function StrapiCatalog({
  component,
  pageParams,
  searchParams = {},
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.catalog">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const t = await getTranslations({ locale, namespace: "shop.categories" })

  const [categoriesResponse, counts] = await Promise.all([
    fetchTopCategories(locale),
    fetchCategoryCounts(locale),
  ])
  const categories = categoriesResponse?.data ?? []
  const countBySlug = new Map(counts.map((c) => [c.slug, c.count]))
  // Products live in subcategories, so a category's tally is the sum of its
  // subcategories' counts.
  const countForCategory = (category: (typeof categories)[number]): number =>
    (category.subcategories ?? []).reduce(
      (sum, sub) => sum + (countBySlug.get(sub.slug ?? "") ?? 0),
      0
    )

  return (
    <>
      {categories.length ? (
        <div className={cn(SECTION_X_PADDING, "bg-brand-surface font-golos")}>
          <div className={cn(CONTENT_MAX_W, "pt-0 pb-2")}>
            <p className="text-brand-nav mb-3 text-lg">{t("chooseCategory")}</p>
            <CategoryTileGrid
              className="pb-6"
              tiles={categories.map((category) => ({
                documentId: category.documentId,
                name: category.name ?? "",
                imageUrl: formatStrapiMediaUrl(category.image?.url),
                href: `/catalog/${category.slug}`,
                count: countForCategory(category),
              }))}
              itemsLabel={(count) => t("items", { count })}
            />
          </div>
        </div>
      ) : null}

      <CatalogBrowser
        locale={locale}
        searchParams={searchParams}
        pageSize={component.pageSize ?? 24}
      />
    </>
  )
}

StrapiCatalog.displayName = "StrapiCatalog"

export default StrapiCatalog
