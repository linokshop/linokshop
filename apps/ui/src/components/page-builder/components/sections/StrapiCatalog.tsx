import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { CatalogBrowser } from "@/components/page-builder/components/elements/CatalogBrowser"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The CMS entry point to the catalog. Everything it renders lives in
 * {@link CatalogBrowser}, which the `/category/<category>/<subcategory>` route
 * shares — the grid, filters and pagination must not drift between the two.
 */
export async function StrapiCatalog({
  component,
  pageParams,
  searchParams = {},
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.catalog">
}) {
  return (
    <CatalogBrowser
      locale={(pageParams?.locale ?? "uk") as Locale}
      searchParams={searchParams}
      pageSize={component.pageSize ?? 24}
    />
  )
}

StrapiCatalog.displayName = "StrapiCatalog"

export default StrapiCatalog
