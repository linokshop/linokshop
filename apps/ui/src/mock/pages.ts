import { ROOT_PAGE_PATH } from "@repo/shared-data"
import type { Data } from "@repo/strapi-types"

import { mockCartPage } from "@/mock/cart-page"
import { mockHomePage } from "@/mock/home-page"

/**
 * Registry of TEMPORARY mock pages, keyed by Strapi `fullPath`. StrapiPageView
 * falls back to these while the corresponding Strapi page is not yet populated.
 *
 * The product page is no longer here: it is a real route (`/product/[slug]`)
 * rendered from the Product collection, not a page-builder page.
 *
 * Delete the whole `apps/ui/src/mock` folder once the cart lives on real data.
 */
export const mockPages: Record<string, Data.ContentType<"api::page.page">> = {
  [ROOT_PAGE_PATH]: mockHomePage,
  "/cart": mockCartPage,
}

export const getMockPage = (
  fullPath: string
): Data.ContentType<"api::page.page"> | undefined => mockPages[fullPath]
