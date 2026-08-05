import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

import {
  type EnrichedProduct,
  enrichProduct,
  enrichProducts,
  getKasaMap,
} from "@/lib/kasa"
import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { CustomFetchOptions } from "@/types/general"

// ------ Page fetching functions
export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: { seo: "smart", content: "smart" },
      },
      {
        ...requestInit,
        next: {
          ...requestInit?.next,
          revalidate: requestInit?.next?.revalidate ?? 120,
        },
      },
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export async function fetchAllPages(
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale?: Locale,
  params?: Record<string, unknown>,
  requestInit?: RequestInit
) {
  try {
    return await PublicStrapiClient.fetchAll(
      uid,
      {
        locale,
        fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
        populate: {},
        status: "published",
        ...params,
      },
      requestInit
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
      locale,
      populate: {
        seo: "smart",
        localizations: true,
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Navbar fetching functions

export async function fetchHeader(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne(
      "api::header.header",
      undefined,
      {
        locale,
        populate: {
          logoImage: "smart",
          primaryButtons: "smart",
          navbarItems: "smart",
          topStripLink: "smart",
          veteranLink: "smart",
        },
      },
      {
        next: {
          revalidate: 600, // 10 minutes; tag-revalidated on Strapi publish
          tags: [strapiCacheTag("api::header.header")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching navbar for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne(
      "api::footer.footer",
      undefined,
      {
        locale,
        populate: {
          sections: "smart",
          logoImage: "smart",
          links: "smart",
          ribbonLink: "smart",
          ribbonImage: "smart",
        },
      },
      {
        next: {
          revalidate: 600, // 10 minutes; tag-revalidated on Strapi publish
          tags: [strapiCacheTag("api::footer.footer")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching footer for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Redirect fetching functions

export async function fetchRedirects() {
  try {
    // fetchAll paginates through every page — a redirect list capped at one
    // page would silently drop redirects beyond the page size (easy to hit
    // after a site migration).
    const response = await PublicStrapiClient.fetchAll(
      "api::redirect.redirect",
      {
        status: "published",
      },
      {
        // Redirects are cached in-process by `src/lib/redirects.ts`. Avoid
        // stacking Next's Data Cache underneath it, because proxy refreshes
        // should decide freshness from the local stale-while-refresh cache.
        cache: "no-store",
      }
    )

    return response.data
  } catch (e: unknown) {
    logNonBlockingError({
      message: "Error fetching redirects",
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    // Rethrow instead of returning [] — the redirect cache must distinguish
    // "no redirects exist" from "Strapi unreachable". An empty list here would
    // be cached and wipe the last known good redirects for a full TTL.
    throw e instanceof Error ? e : new Error(String(e))
  }
}

// ------ Product / Category fetching functions

/**
 * Fresh data for the slugs sitting in someone's cart.
 *
 * The cart itself lives in localStorage and can be weeks old, so price, stock
 * and availability must be re-read rather than trusted from the browser. Not
 * cached: a stale stock number is worse than an extra query.
 */
export async function fetchProductsBySlugs(
  slugs: readonly string[],
  locale: Locale
) {
  if (!slugs.length) {
    return []
  }

  try {
    const response = await PublicStrapiClient.fetchMany(
      "api::product.product",
      {
        locale,
        status: "published",
        filters: { slug: { $in: [...slugs] } },
        pagination: { page: 1, pageSize: slugs.length },
        populate: { images: true, subcategory: true },
      },
      { cache: "no-store" }
    )

    return response?.data ?? []
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching cart products for locale '${locale}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })

    return []
  }
}

/**
 * Products flagged "recommended" in the admin — the cart's cross-sell rail.
 * Editors pick these with a checkbox rather than the code guessing.
 */
export async function fetchRecommendedProducts(
  locale: Locale,
  limit = 6
): Promise<EnrichedProduct[]> {
  try {
    const [response, kasaMap] = await Promise.all([
      PublicStrapiClient.fetchMany(
        "api::product.product",
        {
          locale,
          status: "published",
          filters: { recommended: { $eq: true } },
          // Over-fetch: kasa filters out unpriced / out-of-stock ones below, so
          // the visible count is decided after the merge, not by Strapi.
          pagination: { page: 1, pageSize: 50 },
          populate: { images: true, subcategory: true },
        },
        {
          next: {
            revalidate: 300,
            tags: [strapiCacheTag("api::product.product")],
          },
        }
      ),
      getKasaMap(),
    ])

    return enrichProducts(response?.data ?? [], kasaMap)
      .filter((product) => product.inStock)
      .sort((a, b) => a.price - b.price)
      .slice(0, limit)
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching recommended products for locale '${locale}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })

    return []
  }
}

/**
 * One product for its page, priced from the kasa. Returns `{ data: undefined }`
 * when the product has no kasa match — the page then 404s, because a product we
 * can't price is a product we can't sell.
 */
export async function fetchProductBySlug(
  slug: string,
  locale: Locale
): Promise<undefined | { data: EnrichedProduct | undefined }> {
  try {
    const [response, kasaMap] = await Promise.all([
      PublicStrapiClient.fetchOneBySlug(
        "api::product.product",
        slug,
        {
          locale,
          status: "published",
          populate: {
            images: true,
            // The parent category comes along for the breadcrumb (product →
            // subcategory → category), and `alsoBought` carries the
            // subcategories a buyer typically needs alongside this one — each
            // with its own category, because the link is a nested path.
            subcategory: {
              populate: {
                category: { fields: ["name", "slug"] },
                alsoBought: {
                  populate: {
                    image: true,
                    category: { fields: ["slug"] },
                  },
                },
              },
            },
            // Only present for products in a branch that has a third level —
            // most don't. Fields only: the breadcrumb just needs the name/slug.
            subSubcategory: { fields: ["name", "slug"] },
            brand: true,
            specs: true,
            options: true,
            // Rendered as part of the spec table — the structured half of it.
            attributeValues: { populate: { attribute: true } },
          },
        },
        {
          next: {
            revalidate: 300,
            tags: [strapiCacheTag("api::product.product")],
          },
        }
      ),
      getKasaMap(),
    ])

    const product = response?.data
    if (!product) {
      return { data: undefined }
    }

    return { data: enrichProduct(product, kasaMap) ?? undefined }
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching product '${slug}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export interface CatalogQuery {
  /** Whole-category view: every product under this category's subcategories. */
  readonly category?: string
  /** Subcategory slug fixed by the URL path. */
  readonly subcategory?: string
  /** Sub-subcategory slug fixed by the URL path — the optional third level. */
  readonly subSubcategory?: string
  readonly brands: string[]
  /** Chosen attribute-value slugs, e.g. ["3-6-m", "karbon"]. */
  readonly attributeValues: string[]
  readonly priceMin?: number
  readonly priceMax?: number
  readonly inStock: boolean
  readonly sort: "popular" | "price-asc" | "price-desc" | "new"
  readonly page: number
  readonly pageSize: number
}

/**
 * Does a product satisfy the chosen attribute options?
 *
 * Options of the *same* property widen the result (Довжина 3.0 **or** 3.6) while
 * options of *different* properties narrow it (Довжина 3.6 **and** Карбон) —
 * ticking a second length must not empty the page, but ticking a material must.
 * That is the behaviour every shop filter has, and getting it backwards makes
 * the sidebar feel broken.
 */
function matchesAttributes(
  product: EnrichedProduct,
  selected: readonly string[],
  attributeOfValue: Record<string, string>
): boolean {
  const owned = new Set(
    (product.attributeValues ?? [])
      .map((value) => value.slug)
      .filter((slug): slug is string => Boolean(slug))
  )

  const byAttribute = new Map<string, string[]>()
  for (const slug of selected) {
    const attribute = attributeOfValue[slug] ?? slug
    byAttribute.set(attribute, [...(byAttribute.get(attribute) ?? []), slug])
  }

  for (const slugs of byAttribute.values()) {
    const satisfied = slugs.some((slug) => owned.has(slug))
    if (!satisfied) {
      return false
    }
  }

  return true
}

/** Epoch millis for a Strapi datetime, tolerant of a missing value. */
function timeOf(value: string | Date | null | undefined): number {
  const date = new Date(value ?? 0)

  return date.getTime()
}

/** In-memory catalog sort, applied to the kasa-merged list. */
function sortCatalog(
  items: EnrichedProduct[],
  sort: CatalogQuery["sort"]
): EnrichedProduct[] {
  const sorted = [...items]
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price)
      break
    case "new":
      sorted.sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt))
      break

    default:
      sorted.sort(
        (a, b) =>
          (b.popularity ?? 0) - (a.popularity ?? 0) ||
          (a.name ?? "").localeCompare(b.name ?? "")
      )
  }

  return sorted
}

export interface CatalogPage {
  readonly data: EnrichedProduct[]
  readonly meta: {
    readonly pagination: {
      readonly page: number
      readonly pageSize: number
      readonly total: number
      readonly pageCount: number
    }
  }
  /** How many products carry each attribute value, keyed by value slug. */
  readonly attributeCounts: Record<string, number>
  /** How many products carry each brand, keyed by brand slug. */
  readonly brandCounts: Record<string, number>
  /**
   * Cheapest and dearest product in this view, before the price filter narrows
   * it — the ends of the price slider. Taken pre-filter so dragging a handle
   * never shrinks the track under the reader's finger.
   */
  readonly priceBounds: { readonly min: number; readonly max: number }
}

/**
 * The catalog grid. Category/brand filtering stays in Strapi; everything that
 * depends on the kasa — price range, in-stock, price sort — runs in memory after
 * the merge, because those numbers no longer live in the database. Products with
 * no kasa match drop out (they can't be priced).
 */
export async function fetchCatalogProducts(
  locale: Locale,
  query: CatalogQuery
): Promise<CatalogPage> {
  const emptyPage: CatalogPage = {
    data: [],
    meta: {
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: 0,
        pageCount: 1,
      },
    },
    attributeCounts: {},
    brandCounts: {},
    priceBounds: { min: 0, max: 0 },
  }

  const filters: Record<string, unknown> = {}
  // Category/subcategory/sub-subcategory is pure navigation now, not a
  // multi-select filter — exactly one of these three is ever set, decided by
  // how deep the URL path goes, so the narrowest one simply wins.
  if (query.subSubcategory) {
    filters.subSubcategory = { slug: { $eq: query.subSubcategory } }
  } else if (query.subcategory) {
    filters.subcategory = { slug: { $eq: query.subcategory } }
  } else if (query.category) {
    // No subcategory/sub-subcategory picked — the category page's "whole
    // aisle" view, everything under any of its subcategories.
    filters.subcategory = { category: { slug: { $eq: query.category } } }
  }
  if (query.brands.length) {
    filters.brand = { slug: { $in: query.brands } }
  }

  try {
    const [response, kasaMap] = await Promise.all([
      PublicStrapiClient.fetchAll(
        "api::product.product",
        {
          locale,
          status: "published",
          filters,
          // Attribute values come along so the sidebar can both filter on them
          // and count them without a second pass over the catalogue.
          populate: {
            images: true,
            subcategory: true,
            brand: true,
            // The parent attribute comes along so the filter can tell options of
            // the same property apart from options of different ones.
            attributeValues: { populate: { attribute: true } },
          },
        },
        {
          next: {
            revalidate: 300,
            tags: [strapiCacheTag("api::product.product")],
          },
        }
      ),
      getKasaMap(),
    ])

    let items = enrichProducts(response?.data ?? [], kasaMap)

    // Counts are taken before the attribute filter is applied, so a sidebar
    // option still shows how many products it would bring back rather than
    // collapsing to zero the moment a sibling option is ticked.
    const prices = items.map((product) => product.price)
    const priceBounds = {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
    }

    const attributeCounts: Record<string, number> = {}
    const attributeOfValue: Record<string, string> = {}
    const brandCounts: Record<string, number> = {}
    for (const product of items) {
      for (const value of product.attributeValues ?? []) {
        if (value.slug) {
          attributeCounts[value.slug] = (attributeCounts[value.slug] ?? 0) + 1
          attributeOfValue[value.slug] = value.attribute?.slug ?? value.slug
        }
      }
      const brand = product.brand?.slug
      if (brand) {
        brandCounts[brand] = (brandCounts[brand] ?? 0) + 1
      }
    }

    if (query.attributeValues.length) {
      items = items.filter((product) =>
        matchesAttributes(product, query.attributeValues, attributeOfValue)
      )
    }

    const { priceMin, priceMax } = query
    if (query.inStock) {
      items = items.filter((product) => product.inStock)
    }
    if (priceMin != null) {
      items = items.filter((product) => product.price >= priceMin)
    }
    if (priceMax != null) {
      items = items.filter((product) => product.price <= priceMax)
    }
    items = sortCatalog(items, query.sort)

    const total = items.length
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
    const start = (query.page - 1) * query.pageSize

    return {
      data: items.slice(start, start + query.pageSize),
      meta: {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          total,
          pageCount,
        },
      },
      attributeCounts,
      brandCounts,
      priceBounds,
    }
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching catalog products for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return emptyPage
  }
}

export async function fetchBrands(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchMany(
      "api::brand.brand",
      {
        locale,
        status: "published",
        sort: ["name:asc"],
        pagination: { page: 1, pageSize: 100 },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::brand.brand")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching brands for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export interface CategoryCount {
  readonly documentId: string
  readonly name: string
  readonly slug: string
  readonly count: number
}

/**
 * Product counts per category, for the filter sidebar. A custom Strapi endpoint
 * answers all of them in one query — the standard API has no facet counts, and
 * one request per category would be a request per row.
 */
export async function fetchCategoryCounts(
  locale: Locale
): Promise<CategoryCount[]> {
  try {
    const response = await PublicStrapiClient.fetchAPI(
      "/categories/counts",
      { locale },
      {
        next: {
          revalidate: 300,
          tags: [
            strapiCacheTag("api::category.category"),
            strapiCacheTag("api::product.product"),
          ],
        },
      }
    )

    return (response?.data ?? []) as CategoryCount[]
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching category counts for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return []
  }
}

/**
 * Product counts per sub-subcategory — the same `/categories/counts` response
 * carries these alongside the subcategory counts above, so this is a second,
 * differently-shaped read of the same (Next-deduped) request rather than a
 * separate round trip.
 */
export async function fetchSubSubcategoryCounts(
  locale: Locale
): Promise<CategoryCount[]> {
  try {
    const response = await PublicStrapiClient.fetchAPI(
      "/categories/counts",
      { locale },
      {
        next: {
          revalidate: 300,
          tags: [
            strapiCacheTag("api::category.category"),
            strapiCacheTag("api::product.product"),
          ],
        },
      }
    )

    return (response?.subSubcategories ?? []) as CategoryCount[]
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching sub-subcategory counts for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return []
  }
}

export async function fetchCategories(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchMany(
      "api::category.category",
      {
        locale,
        status: "published",
        populate: { image: true },
        pagination: { page: 1, pageSize: 100 },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::category.category")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching categories for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

/**
 * The filterable attributes of one subcategory, each with its options.
 *
 * Attributes are attached to the subcategories they make sense for, so browsing
 * bait never offers a rod's "Тест". Returns [] outside a subcategory — the whole
 * catalogue has no single set of attributes worth showing.
 */
export async function fetchSubcategoryAttributes(
  subcategorySlug: string | undefined,
  locale: Locale
) {
  if (!subcategorySlug) {
    return []
  }

  try {
    const response = await PublicStrapiClient.fetchMany(
      "api::attribute.attribute",
      {
        locale,
        status: "published",
        filters: { subcategories: { slug: { $eq: subcategorySlug } } },
        populate: { values: true },
        sort: ["order:asc", "name:asc"],
        pagination: { page: 1, pageSize: 50 },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::attribute.attribute")],
        },
      }
    )

    return response?.data ?? []
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching attributes for '${subcategorySlug}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })

    return []
  }
}

/**
 * Every published product's slug, for the sitemap.
 *
 * Deliberately not kasa-merged: an item that is briefly out of stock, or that
 * the kasa did not answer for on this request, still has a page worth indexing —
 * dropping it would make the sitemap flicker between crawls.
 */
export async function fetchSitemapProducts(locale: Locale) {
  try {
    const response = await PublicStrapiClient.fetchAll(
      "api::product.product",
      {
        locale,
        status: "published",
        fields: ["slug", "updatedAt"],
        populate: {},
      },
      { next: { revalidate: 3600 } }
    )

    return response?.data ?? []
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching products for sitemap '${locale}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })

    return []
  }
}

/**
 * Categories for the home grid — each carries its subcategory slugs so the
 * caller can roll a category's product count up from its subcategories (products
 * live in subcategories, not directly under a category).
 */
export async function fetchTopCategories(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchMany(
      "api::category.category",
      {
        locale,
        status: "published",
        populate: {
          image: true,
          subcategories: { populate: { subSubcategories: true } },
        },
        sort: ["order:asc", "name:asc"],
        pagination: { page: 1, pageSize: 100 },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::category.category")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching top categories for locale '${locale}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })
  }
}

/**
 * One category with its subcategories — the `/catalog/<slug>` page, which shows
 * the subcategories as tiles linking into the catalog.
 */
export async function fetchCategoryBySlug(slug: string, locale: Locale) {
  try {
    const response = await PublicStrapiClient.fetchMany(
      "api::category.category",
      {
        locale,
        status: "published",
        filters: { slug: { $eq: slug } },
        populate: {
          image: true,
          subcategories: {
            populate: {
              image: true,
              subSubcategories: {
                populate: { image: true },
                sort: ["order:asc", "name:asc"],
              },
            },
            sort: ["order:asc", "name:asc"],
          },
        },
        pagination: { page: 1, pageSize: 1 },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::category.category")],
        },
      }
    )

    return response?.data?.[0]
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching category '${slug}' for locale '${locale}'`,
      error: { error: e instanceof Error ? e.message : String(e) },
    })
  }
}
