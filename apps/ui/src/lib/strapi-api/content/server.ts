import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

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

export async function fetchProductBySlug(slug: string, locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOneBySlug(
      "api::product.product",
      slug,
      {
        locale,
        status: "published",
        populate: {
          images: true,
          category: true,
          brand: true,
          specs: true,
          options: true,
        },
      },
      {
        next: {
          revalidate: 300,
          tags: [strapiCacheTag("api::product.product")],
        },
      }
    )
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
  readonly categories: string[]
  readonly brands: string[]
  readonly priceMin?: number
  readonly priceMax?: number
  readonly inStock: boolean
  readonly sort: "popular" | "price-asc" | "price-desc" | "new"
  readonly page: number
  readonly pageSize: number
}

// `as const` on purpose: Strapi's `sort` param is typed against the field names,
// so widening these to string[] makes them unassignable.
const CATALOG_SORT = {
  popular: ["popularity:desc", "name:asc"],
  "price-asc": ["price:asc"],
  "price-desc": ["price:desc"],
  new: ["createdAt:desc"],
} as const

/** The catalog grid: filtered, sorted and paginated by Strapi, not in the UI. */
export async function fetchCatalogProducts(
  locale: Locale,
  query: CatalogQuery
) {
  const filters: Record<string, unknown> = {}

  if (query.categories.length) {
    filters.category = { slug: { $in: query.categories } }
  }
  if (query.brands.length) {
    filters.brand = { slug: { $in: query.brands } }
  }
  if (query.inStock) {
    filters.inStock = { $eq: true }
  }
  if (query.priceMin != null || query.priceMax != null) {
    filters.price = {
      ...(query.priceMin != null && { $gte: query.priceMin }),
      ...(query.priceMax != null && { $lte: query.priceMax }),
    }
  }

  try {
    return await PublicStrapiClient.fetchMany(
      "api::product.product",
      {
        locale,
        status: "published",
        filters,
        sort: [...CATALOG_SORT[query.sort]],
        populate: { images: true, category: true, brand: true },
        pagination: { page: query.page, pageSize: query.pageSize },
      },
      {
        next: {
          revalidate: 300,
          tags: [strapiCacheTag("api::product.product")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching catalog products for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

/** Other products from the same category — the "related" rail on a product page. */
export async function fetchRelatedProducts(
  locale: Locale,
  categorySlug: string | undefined,
  excludeSlug: string,
  limit = 4
) {
  if (!categorySlug) return []

  try {
    const response = await PublicStrapiClient.fetchMany(
      "api::product.product",
      {
        locale,
        status: "published",
        filters: {
          category: { slug: { $eq: categorySlug } },
          slug: { $ne: excludeSlug },
        },
        sort: ["popularity:desc"],
        populate: { images: true, category: true },
        pagination: { page: 1, pageSize: limit },
      },
      {
        next: {
          revalidate: 300,
          tags: [strapiCacheTag("api::product.product")],
        },
      }
    )

    return response.data
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching related products for '${excludeSlug}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return []
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
