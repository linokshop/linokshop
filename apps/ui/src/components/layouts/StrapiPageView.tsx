import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import {
  type BreadcrumbsTheme,
  Breadcrumbs,
} from "@/components/elementary/Breadcrumbs"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { SECTION_X_PADDING } from "@/lib/layout"
import { logger } from "@/lib/logging"
import { fetchPage } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import { getMockPage } from "@/mock/pages"

interface Props {
  params: {
    locale: string
    rest?: string[]
  }
  searchParams?: Record<string, string | string[] | undefined>
}

export default function StrapiPageView({ params, searchParams }: Props) {
  const locale = params.locale as Locale

  setRequestLocale(locale)

  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")
  const response = use(fetchPage(fullPath, locale))

  // Fall back to mock content while the matching Strapi page is not populated.
  // Remove the mock registry once pages live in Strapi.
  const data =
    response?.data?.content == null ? getMockPage(fullPath) : response?.data

  if (data?.content == null) {
    notFound()
  }

  const { content, ...restPageData } = data
  const breadcrumbs = response?.meta?.breadcrumbs

  // Breadcrumbs float over the first section, so by default they follow its
  // theme (`sections.*` with a `theme` enum); a page can force dark/light.
  const firstSectionTheme = (content[0] as undefined | { theme?: string })
    ?.theme
  const themeSetting = restPageData.breadcrumbsTheme ?? "auto"
  const breadcrumbsTheme: BreadcrumbsTheme =
    themeSetting === "auto"
      ? firstSectionTheme === "light"
        ? "light"
        : "dark"
      : themeSetting
  // A page with no parent yields a single crumb (itself) — a trail that leads
  // nowhere, so it's not worth rendering. Show them only from 2 crumbs up.
  const showBreadcrumbs = (breadcrumbs?.length ?? 0) > 1

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      {/* Page surface (#15301f) — matches the design wrapper, so any section
          without its own background never exposes the white body. */}
      <main
        className={cn(
          "bg-brand-surface relative flex w-full flex-1 flex-col overflow-hidden"
        )}
      >
        {/* Breadcrumbs float transparently over the first section instead of
            being a band of their own — sections already carry enough top
            padding, so nothing gets pushed down. `pointer-events-none` keeps
            the section underneath clickable; the links opt back in. */}
        {showBreadcrumbs ? (
          <div
            className={cn(
              SECTION_X_PADDING,
              "pointer-events-none absolute inset-x-0 top-0 z-10 pt-4"
            )}
          >
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              locale={locale}
              theme={breadcrumbsTheme}
              className="pointer-events-auto"
            />
          </div>
        ) : null}

        {content
          .filter((comp) => comp != null)
          .map((comp) => {
            const name = comp.__component
            const id = comp.id
            const key = `${name}-${id}`
            const Component = PageContentComponents[name]
            if (Component == null) {
              logger.warn("Unknown page-builder component", { name, id })

              return (
                <div key={key} className="font-medium text-red-500">
                  Component &quot;{key}&quot; is not implemented on the
                  frontend.
                </div>
              )
            }

            return (
              // Sections are full-bleed and carry their own vertical padding,
              // so they stack flush — no wrapper margins between them.
              <ErrorBoundary key={key}>
                <Component
                  component={comp}
                  pageParams={params}
                  page={restPageData}
                  searchParams={searchParams}
                />
              </ErrorBoundary>
            )
          })}
      </main>
    </>
  )
}
