import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import HeaderInner from "@/components/page-builder/single-types/header/HeaderInner"
import { fetchHeader } from "@/lib/strapi-api/content/server"
import { mockHeader } from "@/mock/header"

export function StrapiHeader({ locale }: { readonly locale: Locale }) {
  const response = use(fetchHeader(locale))
  // Fall back to mock content while the Strapi header is not yet populated.
  // Remove the mock import once the CMS content exists.
  const header = response?.data ?? mockHeader

  return <HeaderInner locale={locale} headerData={header} />
}
StrapiHeader.displayName = "StrapiHeader"

export default StrapiHeader
