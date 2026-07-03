import "server-only"

import { headers } from "next/headers"
import type { Locale } from "next-intl"
import { use } from "react"

import HeaderInner from "@/components/page-builder/single-types/header/HeaderInner"
import { getSessionSSR } from "@/lib/auth"
import { fetchHeader } from "@/lib/strapi-api/content/server"

export function StrapiHeader({ locale }: { readonly locale: Locale }) {
  const response = use(fetchHeader(locale))
  const header = response?.data

  if (header == null) {
    return null
  }

  const requestHeaders = use(headers())
  const session = use(getSessionSSR(requestHeaders))

  return <HeaderInner locale={locale} headerData={header} session={session} />
}
StrapiHeader.displayName = "StrapiHeader"

export default StrapiHeader
