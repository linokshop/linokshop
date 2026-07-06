import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import HeaderInner from "@/components/page-builder/single-types/header/HeaderInner"
import { fetchHeader } from "@/lib/strapi-api/content/server"

export function StrapiHeader({ locale }: { readonly locale: Locale }) {
  const response = use(fetchHeader(locale))
  // Header content now lives in Strapi (no mock fallback).
  const header = response?.data ?? undefined

  return <HeaderInner locale={locale} headerData={header} />
}
StrapiHeader.displayName = "StrapiHeader"

export default StrapiHeader
