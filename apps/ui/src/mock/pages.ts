import { ROOT_PAGE_PATH } from "@repo/shared-data"
import type { Data } from "@repo/strapi-types"

import { mockHomePage } from "@/mock/home-page"
import { mockVeteranPage } from "@/mock/veteran-page"

/**
 * Registry of TEMPORARY mock pages, keyed by Strapi `fullPath`. StrapiPageView
 * falls back to these while the corresponding Strapi page is not yet populated.
 *
 * Add a page: create `mock/<name>-page.ts`, import it, map its fullPath here.
 * Delete the whole `apps/ui/src/mock` folder once pages live in Strapi.
 */
export const mockPages: Record<string, Data.ContentType<"api::page.page">> = {
  [ROOT_PAGE_PATH]: mockHomePage,
  "/veteran": mockVeteranPage,
}

export const getMockPage = (
  fullPath: string
): Data.ContentType<"api::page.page"> | undefined => mockPages[fullPath]
