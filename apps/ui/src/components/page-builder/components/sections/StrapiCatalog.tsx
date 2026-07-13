import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { Fragment } from "react"

import AppLink from "@/components/elementary/AppLink"
import { CatalogFilters } from "@/components/page-builder/components/elements/CatalogFilters"
import { CatalogSort } from "@/components/page-builder/components/elements/CatalogSort"
import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { formatPrice as formatUah } from "@/lib/format"
import { SECTION_X_PADDING } from "@/lib/layout"
import {
  type CatalogQuery,
  fetchBrands,
  fetchCatalogProducts,
  fetchCategoryCounts,
} from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type SearchParams = Record<string, string | string[] | undefined>
type Product = NonNullable<
  Awaited<ReturnType<typeof fetchCatalogProducts>>
>["data"][number]

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

const formatPrice = (value: number | null | undefined) =>
  value == null ? undefined : formatUah(value)

/**
 * Products, categories and brands are their own Strapi collections, so this
 * section holds no product data. The filter/sort/page state lives in the URL and
 * is turned into a Strapi query here, on the server.
 */
export async function StrapiCatalog({
  component,
  pageParams,
  searchParams = {},
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.catalog">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const pageSize = component.pageSize ?? 12

  const sortParam = readOne(searchParams, "sort")
  const query: CatalogQuery = {
    categories: readList(searchParams, "category"),
    brands: readList(searchParams, "brand"),
    priceMin: readNumber(searchParams, "priceMin"),
    priceMax: readNumber(searchParams, "priceMax"),
    inStock: readOne(searchParams, "inStock") === "true",
    sort: (SORTS as readonly string[]).includes(sortParam ?? "")
      ? (sortParam as CatalogQuery["sort"])
      : "popular",
    page: Math.max(1, readNumber(searchParams, "page") ?? 1),
    pageSize,
  }

  const [products, categoryCounts, brands] = await Promise.all([
    fetchCatalogProducts(locale, query),
    fetchCategoryCounts(locale),
    fetchBrands(locale),
  ])

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
      <div className="mx-auto grid max-w-[1320px] items-start gap-8 min-[900px]:grid-cols-[268px_1fr]">
        <CatalogFilters
          categories={categoryCounts}
          brands={(brands?.data ?? []).map((brand) => ({
            slug: brand.slug ?? "",
            name: brand.name ?? "",
          }))}
          labels={{
            categories: "Категорії",
            price: "Ціна, ₴",
            brand: "Бренд",
            inStock: "Тільки в наявності",
            apply: "Застосувати",
            reset: "Скинути",
          }}
        />

        <div>
          <div className="border-brand-border bg-brand-green mb-5.5 flex flex-col gap-3 rounded-[10px] border px-5 py-3.5 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
            <span className="text-brand-muted text-sm">
              {total === 0
                ? "Нічого не знайдено"
                : `Показано ${firstShown}–${lastShown} з ${total}`}
            </span>
            <CatalogSort current={query.sort} />
          </div>

          {items.length ? (
            <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 min-[600px]:gap-5.5 min-[1024px]:grid-cols-3">
              {items.map((product) => (
                <ProductCard
                  key={product.documentId}
                  product={toCard(product)}
                  cartItem={toCartItem(product)}
                  sizes="(min-width: 1024px) 30vw, (min-width: 420px) 45vw, 90vw"
                />
              ))}
            </div>
          ) : (
            <p className="border-brand-border bg-brand-green text-brand-nav rounded-xl border p-10 text-center">
              За цими фільтрами товарів немає. Спробуйте зняти частину умов.
            </p>
          )}

          {pageCount > 1 ? (
            <Pagination
              page={query.page}
              pageCount={pageCount}
              searchParams={searchParams}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** The data the tile's "+" button needs to put this product in the cart. */
function toCartItem(product: Product) {
  return {
    slug: product.slug ?? "",
    name: product.name ?? "",
    price: product.price ?? 0,
    imageUrl: formatStrapiMediaUrl(product.images?.[0]?.url) ?? undefined,
  }
}

/** Adapts a Product entity to the shape the shared tile renders. */
function toCard(product: Product) {
  return {
    id: product.id,
    category: product.category?.name,
    name: product.name,
    price: formatPrice(product.price),
    oldPrice: formatPrice(product.oldPrice),
    badge: product.badge,
    badgeColor: product.badgeColor,
    image: product.images?.[0]
      ? { media: product.images[0], alt: product.name }
      : undefined,
    link: {
      type: "external",
      label: product.name,
      href: `/product/${product.slug}`,
      newTab: false,
    },
  } as unknown as Data.Component<"elements.product-card">
}

function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  readonly page: number
  readonly pageCount: number
  readonly searchParams: SearchParams
}) {
  const hrefFor = (target: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      const single = Array.isArray(value) ? value[0] : value
      if (key === "page" || single == null) continue
      params.set(key, single)
    }
    if (target > 1) params.set("page", String(target))

    return params.size ? `?${params.toString()}` : "?"
  }

  // A 400-product catalog is 34 pages — rendering every one of them as a link
  // is a wall of numbers. Show the first, the last, and a window around current.
  const window = new Set([1, pageCount, page - 1, page, page + 1])
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (target) => window.has(target)
  )

  return (
    <nav
      aria-label="Сторінки каталогу"
      className="font-oswald mt-10 flex items-center justify-center gap-2"
    >
      {pages.map((target, index) => (
        <Fragment key={target}>
          {/* A gap in the sequence means pages were skipped — say so. */}
          {index > 0 && target - (pages[index - 1] ?? 0) > 1 ? (
            <span aria-hidden className="text-brand-muted px-1">
              …
            </span>
          ) : null}
          <AppLink
            href={hrefFor(target)}
            unstyled
            aria-current={target === page ? "page" : undefined}
            className={cn(
              "flex size-10.5 items-center justify-center rounded-md border transition-colors",
              target === page
                ? "bg-brand-bronze border-brand-bronze text-white"
                : "bg-brand-green border-brand-border text-brand-nav hover:border-brand-orange"
            )}
          >
            {target}
          </AppLink>
        </Fragment>
      ))}
      {page < pageCount ? (
        <AppLink
          href={hrefFor(page + 1)}
          unstyled
          aria-label="Наступна сторінка"
          className="bg-brand-green border-brand-border text-brand-nav hover:border-brand-orange flex size-10.5 items-center justify-center rounded-md border transition-colors"
        >
          →
        </AppLink>
      ) : null}
    </nav>
  )
}

StrapiCatalog.displayName = "StrapiCatalog"

export default StrapiCatalog
