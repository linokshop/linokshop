import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import {
  CatalogBrowser,
  type SearchParams,
} from "@/components/page-builder/components/elements/CatalogBrowser"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import { createPublicFullPath } from "@/lib/navigation"
import { fetchCategoryBySlug } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

interface SubSubcategoryPageProps {
  readonly params: Promise<{
    locale: string
    slug: string
    sub: string
    subsub: string
  }>
  readonly searchParams: Promise<SearchParams>
}

/** The category, subcategory and sub-subcategory named by the path, or nothing if any link is wrong. */
async function resolve(
  slug: string,
  sub: string,
  subsub: string,
  locale: Locale
) {
  const category = await fetchCategoryBySlug(slug, locale)
  const subcategory = (category?.subcategories ?? []).find(
    (item) => item.slug === sub
  )
  const subSubcategory = (subcategory?.subSubcategories ?? []).find(
    (item) => item.slug === subsub
  )

  return category && subcategory && subSubcategory
    ? { category, subcategory, subSubcategory }
    : undefined
}

export async function generateMetadata({
  params,
}: SubSubcategoryPageProps): Promise<Metadata> {
  const { locale, slug, sub, subsub } = await params
  const found = await resolve(slug, sub, subsub, locale as Locale)

  return {
    title: found?.subSubcategory.name ?? undefined,
    alternates: {
      canonical: createPublicFullPath(
        `/catalog/${slug}/${sub}/${subsub}`,
        locale as Locale
      ),
    },
  }
}

export default async function SubSubcategoryPage({
  params,
  searchParams,
}: SubSubcategoryPageProps) {
  const { locale, slug, sub, subsub } = await params
  setRequestLocale(locale as Locale)
  const tc = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })

  // A sub-subcategory that does not belong to the subcategory/category in the
  // path is a 404 — the URL claims a relationship that does not exist.
  const found = await resolve(slug, sub, subsub, locale as Locale)
  if (!found) {
    notFound()
  }

  const { category, subcategory, subSubcategory } = found
  const query = await searchParams

  return (
    <main className="bg-brand-surface font-golos flex w-full flex-1 flex-col">
      <div className={SECTION_X_PADDING}>
        <div className={cn(CONTENT_MAX_W, "pt-10 pb-6")}>
          <nav
            aria-label="Breadcrumb"
            className="font-oswald text-brand-muted mb-3.5 text-[13px] tracking-[0.06em] uppercase"
          >
            <AppLink href="/" unstyled className="hover:text-brand-cream">
              {tc("home")}
            </AppLink>
            {" · "}
            <AppLink
              href="/catalog"
              unstyled
              className="hover:text-brand-cream"
            >
              {tc("catalog")}
            </AppLink>
            {" · "}
            <AppLink
              href={`/catalog/${category.slug}`}
              unstyled
              className="hover:text-brand-cream"
            >
              {category.name}
            </AppLink>
            {" · "}
            <AppLink
              href={`/catalog/${category.slug}/${subcategory.slug}`}
              unstyled
              className="hover:text-brand-cream"
            >
              {subcategory.name}
            </AppLink>
            <span className="text-brand-nav"> · {subSubcategory.name}</span>
          </nav>

          <h1 className="font-oswald text-brand-cream text-[38px] leading-tight font-bold tracking-[0.01em] uppercase min-[600px]:text-[52px]">
            {subSubcategory.name}
          </h1>
        </div>
      </div>

      <CatalogBrowser
        locale={locale as Locale}
        searchParams={query}
        lockedCategory={category.slug ?? undefined}
        lockedSubcategory={subcategory.slug ?? undefined}
        lockedSubSubcategory={subSubcategory.slug ?? undefined}
      />
    </main>
  )
}
