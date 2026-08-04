import "server-only"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { CatalogFilters } from "@/components/page-builder/components/elements/CatalogFilters"
import {
  CATALOG_RESULTS_ID,
  CatalogPagination,
} from "@/components/page-builder/components/elements/CatalogPagination"
import {
  CatalogPendingProvider,
  CatalogResultsFade,
} from "@/components/page-builder/components/elements/CatalogPending"
import { CatalogSort } from "@/components/page-builder/components/elements/CatalogSort"
import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import { toCartItem, toProductCard } from "@/lib/product-card"
import {
  type CatalogQuery,
  fetchBrands,
  fetchCatalogProducts,
  fetchCategoryCounts,
  fetchSubcategoryAttributes,
  fetchTopCategories,
} from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

export type SearchParams = Record<string, string | string[] | undefined>

const SORTS = ["popular", "price-asc", "price-desc", "new"] as const

const readOne = (params: SearchParams, key: string) => {
  const value = params[key]

  return Array.isArray(value) ? value[0] : value
}

const readList = (params: SearchParams, key: string) =>
  (readOne(params, key) ?? "").split(",").filter(Boolean)

const readNumber = (params: SearchParams, key: string) => {
  const value = Number(readOne(params, key))

  return Number.isFinite(value) && value >= 0 ? value : undefined
}

/**
 * The product grid with its filters, sort and pagination.
 *
 * Two callers share it: the CMS `sections.catalog` block (the whole catalog) and
 * the `/category/<category>/<subcategory>` route. In the latter the subcategory
 * comes from the path rather than the query, so `lockedSubcategory` pins it and
 * the category filter is dropped — the path already made that choice. Everything
 * else (price, brand, stock, sort, page) stays in the query string and therefore
 * works the same on both, because the filter/pagination links are relative.
 */
export async function CatalogBrowser({
  locale,
  searchParams = {},
  // 24 rather than a dozen: at 12 a full catalogue runs to hundreds of pages,
  // and 24 divides evenly into the 3-per-row grid.
  pageSize = 24,
  lockedSubcategory,
  lockedCategory,
}: {
  readonly locale: Locale
  readonly searchParams?: SearchParams
  readonly pageSize?: number
  /** Subcategory slug fixed by the URL path; hides the category filter. */
  readonly lockedSubcategory?: string
  /** Category slug fixed by the URL path: everything under its subcategories. */
  readonly lockedCategory?: string
}) {
  const t = await getTranslations({ locale, namespace: "shop.catalog" })

  const sortParam = readOne(searchParams, "sort")
  const query: CatalogQuery = {
    categories: lockedSubcategory
      ? [lockedSubcategory]
      : readList(searchParams, "subcategory"),
    category: lockedCategory,
    brands: readList(searchParams, "brand"),
    attributeValues: readList(searchParams, "attr"),
    priceMin: readNumber(searchParams, "priceMin"),
    priceMax: readNumber(searchParams, "priceMax"),
    inStock: readOne(searchParams, "inStock") === "true",
    sort: (SORTS as readonly string[]).includes(sortParam ?? "")
      ? (sortParam as CatalogQuery["sort"])
      : "popular",
    page: Math.max(1, readNumber(searchParams, "page") ?? 1),
    pageSize,
  }

  // The tree is fetched in both modes: inside a subcategory it is how the reader
  // steps sideways to a sibling, so hiding it would strand them there.
  const [products, topCategories, categoryCounts, brands, attributes] =
    await Promise.all([
      fetchCatalogProducts(locale, query),
      fetchTopCategories(locale),
      fetchCategoryCounts(locale),
      fetchBrands(locale),
      fetchSubcategoryAttributes(lockedSubcategory, locale),
    ])

  // Nested category filter: each category with its subcategories and their
  // product counts. Categories with no subcategories are left out.
  const countBySlug = new Map(categoryCounts.map((c) => [c.slug, c.count]))
  const categoryTree = (topCategories?.data ?? [])
    // Inside a category the tree narrows to that category: offering a sibling
    // category as a checkbox would silently carry the reader out of the page
    // they are on.
    .filter((category) => !lockedCategory || category.slug === lockedCategory)
    .map((category) => ({
      slug: category.slug ?? "",
      name: category.name ?? "",
      subcategories: (category.subcategories ?? []).map((sub) => ({
        slug: sub.slug ?? "",
        name: sub.name ?? "",
        count: countBySlug.get(sub.slug ?? "") ?? 0,
      })),
    }))
    .filter((category) => category.subcategories.length > 0)

  // Attribute facets for the sidebar. Options nobody has are dropped — an
  // option that can only ever return nothing is a dead end, not a filter.
  const attributeGroups = attributes
    .map((attribute) => ({
      slug: attribute.slug ?? "",
      name: attribute.name ?? "",
      values: (attribute.values ?? [])
        .map((value) => ({
          slug: value.slug ?? "",
          name: value.name ?? "",
          count: products.attributeCounts[value.slug ?? ""] ?? 0,
        }))
        .filter((value) => value.count > 0),
    }))
    .filter((attribute) => attribute.values.length > 0)

  const items = products?.data ?? []
  const pagination = products?.meta?.pagination
  const total = pagination?.total ?? 0
  const pageCount = pagination?.pageCount ?? 1
  const firstShown = total === 0 ? 0 : (query.page - 1) * pageSize + 1
  const lastShown = Math.min(query.page * pageSize, total)

  return (
    <section
      className={cn(SECTION_X_PADDING, "bg-brand-surface font-golos pb-17.5")}
    >
      <div
        className={cn(
          CONTENT_MAX_W,
          "grid items-start gap-8 min-[900px]:grid-cols-[268px_1fr]"
        )}
      >
        {/* One transition shared by the filters and the grid beside them: a
            checkbox already shows its own tick instantly, so what's missing
            without this is any sign the *grid* is still catching up. */}
        <CatalogPendingProvider>
          <CatalogFilters
            categoryTree={categoryTree}
            currentSubcategory={lockedSubcategory}
            attributeGroups={attributeGroups}
            priceBounds={products.priceBounds}
            // Only brands actually present here, with their tallies. A brand that
            // no product in this view carries is a tick that guarantees an empty
            // page — the same reason the attribute options are pruned.
            brands={(brands?.data ?? [])
              .map((brand) => ({
                slug: brand.slug ?? "",
                name: brand.name ?? "",
                count: products.brandCounts[brand.slug ?? ""] ?? 0,
              }))
              .filter((brand) => brand.count > 0)}
            labels={{
              categories: t("categories"),
              price: t("price"),
              brand: t("brand"),
              inStock: t("inStockOnly"),
              reset: t("reset"),
              // The hints quote the real ends of this catalogue rather than a
              // made-up round number — "до 10000" beside a 470 ₴ shelf is noise.
              priceFromPlaceholder: t("priceFromPlaceholder", {
                value: products.priceBounds.min,
              }),
              priceToPlaceholder: t("priceToPlaceholder", {
                value: products.priceBounds.max,
              }),
              priceFromAria: t("priceFromAria"),
              priceToAria: t("priceToAria"),
            }}
          />

          <CatalogResultsFade>
            <div>
              {/* Paging links point here, so a page change lands on the products
              rather than at the very top of the document. */}
              <div
                id={CATALOG_RESULTS_ID}
                className="border-brand-border bg-brand-green mb-5.5 flex scroll-mt-24 flex-col gap-3 rounded-[10px] border px-5 py-3.5 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between"
              >
                <span className="text-brand-muted text-sm">
                  {total === 0
                    ? t("nothingFound")
                    : t("shown", { from: firstShown, to: lastShown, total })}
                </span>
                <CatalogSort current={query.sort} />
              </div>

              {items.length ? (
                <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 min-[600px]:gap-5.5 min-[1024px]:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard
                      key={product.documentId}
                      product={toProductCard(product)}
                      cartItem={toCartItem(product)}
                      sizes="(min-width: 1024px) 30vw, (min-width: 420px) 45vw, 90vw"
                    />
                  ))}
                </div>
              ) : (
                <p className="border-brand-border bg-brand-green text-brand-nav rounded-xl border p-10 text-center">
                  {t("emptyFiltered")}
                </p>
              )}

              {pageCount > 1 ? (
                <CatalogPagination
                  page={query.page}
                  pageCount={pageCount}
                  searchParams={searchParams}
                  navLabel={t("pagesAria")}
                  prevLabel={t("prevPageAria")}
                  nextLabel={t("nextPageAria")}
                />
              ) : null}
            </div>
          </CatalogResultsFade>
        </CatalogPendingProvider>
      </div>
    </section>
  )
}

export default CatalogBrowser
