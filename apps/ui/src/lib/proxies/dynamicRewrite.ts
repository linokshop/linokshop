import { type NextRequest, NextResponse } from "next/server"
import type { Locale } from "next-intl"

import { routing } from "@/lib/navigation"

const dynamicPrefix = "dynamic"

/**
 * Ignores requests to certain paths, allowing them to be handled by other middleware or routes.
 *
 * `/product` and `/cart` are hand-written routes, not page-builder pages. Without
 * them here, any query string — `?utm_source=…` on an ad click, `?fbclid=…` on a
 * shared link — rewrites them onto the Strapi page route, which has no such page
 * and answers 404.
 */
const ignoredPaths = ["/api", "/dev", "/auth", "/product", "/cart"]

/**
 * Removes the locale prefix from the pathname if present, returning the path without the locale segment.
 */
const stripLocalePrefix = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean)
  const hasLocale =
    parts.length >= 1 && routing.locales.includes(parts[0] as Locale)

  if (!hasLocale) {
    return pathname
  }

  const rest = parts.slice(1).join("/")

  return rest ? `/${rest}` : "/"
}

/**
 * Rewrites requests with search params to the /dynamic/ route segment,
 * enabling dynamic rendering for pages that need access to searchParams.
 * Also blocks direct access to the bare /dynamic path.
 * Returns null if no rewrite is needed.
 */
export const dynamicRewrite = (
  req: NextRequest,
  intlProxy: (req: NextRequest) => NextResponse
): NextResponse | null => {
  const { pathname, search } = req.nextUrl

  const pathWithoutLocale = stripLocalePrefix(pathname)

  const dynamicPathRegex = new RegExp(
    `^/(?:${routing.locales.join("|")}/)?${dynamicPrefix}$`
  )
  if (dynamicPathRegex.test(pathname)) {
    return NextResponse.rewrite(new URL("/not-found", req.url))
  }

  if (
    ignoredPaths.some((path) => pathWithoutLocale.startsWith(path)) ||
    !search
  ) {
    return null
  }

  const parts = pathname.split("/").filter(Boolean)

  const hasLocale =
    parts.length >= 1 && routing.locales.includes(parts[0] as Locale)
  const locale = hasLocale ? parts[0] : routing.defaultLocale
  const rest = parts.slice(hasLocale ? 1 : 0).join("/")

  if (rest.startsWith(dynamicPrefix)) {
    return null
  }

  // The path must be absolute (leading slash). A relative path resolves against
  // req.url and, on a locale-prefixed URL like `/ru/catalog`, would double the
  // prefix into `/ru/ru/dynamic/...` → 404. This only surfaced once a non-default
  // locale (ru) started carrying a URL prefix.
  const rewriteUrl = new URL(
    `/${[locale, dynamicPrefix, rest].filter(Boolean).join("/")}`,
    req.url
  )

  rewriteUrl.search = search

  const rewriteResponse = NextResponse.rewrite(rewriteUrl, intlProxy(req))
  rewriteResponse.headers.set("x-original-path", pathname)

  return rewriteResponse
}
