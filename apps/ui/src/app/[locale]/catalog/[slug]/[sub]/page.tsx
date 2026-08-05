import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import {
  CatalogBrowser,
  type SearchParams,
} from "@/components/page-builder/components/elements/CatalogBrowser"
import { CategoryTileGrid } from "@/components/page-builder/components/elements/CategoryTileGrid"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import { createPublicFullPath } from "@/lib/navigation"
import {
  fetchCategoryBySlug,
  fetchSubSubcategoryCounts,
} from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

interface SubcategoryPageProps {
  readonly params: Promise<{ locale: string; slug: string; sub: string }>
  readonly searchParams: Promise<SearchParams>
}

/** The category and subcategory named by the path, or nothing if either is wrong. */
async function resolve(slug: string, sub: string, locale: Locale) {
  const category = await fetchCategoryBySlug(slug, locale)
  const subcategory = (category?.subcategories ?? []).find(
    (item) => item.slug === sub
  )

  return category && subcategory ? { category, subcategory } : undefined
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { locale, slug, sub } = await params
  const found = await resolve(slug, sub, locale as Locale)

  return {
    title: found?.subcategory.name ?? undefined,
    // The same products are also reachable as a filtered `/catalog` view; this
    // names the nested path as the one crawlers should keep.
    alternates: {
      canonical: createPublicFullPath(
        `/catalog/${slug}/${sub}`,
        locale as Locale
      ),
    },
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { locale, slug, sub } = await params
  setRequestLocale(locale as Locale)
  const tc = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.categories",
  })

  // A subcategory that does not belong to the category in the path is a 404 —
  // the URL claims a relationship that does not exist.
  const found = await resolve(slug, sub, locale as Locale)
  if (!found) {
    notFound()
  }

  const { category, subcategory } = found
  const query = await searchParams
  // Most subcategories are leaves; only a few (Вудилища → Поплавочні) split
  // further. Tiles for the third level only render when there is one.
  const subSubcategories = subcategory.subSubcategories ?? []
  const subSubcategoryCounts = subSubcategories.length
    ? await fetchSubSubcategoryCounts(locale as Locale)
    : []
  const subSubCountBySlug = new Map(
    subSubcategoryCounts.map((c) => [c.slug, c.count])
  )

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
            <span className="text-brand-nav"> · {subcategory.name}</span>
          </nav>

          <h1 className="font-oswald text-brand-cream text-[38px] leading-tight font-bold tracking-[0.01em] uppercase min-[600px]:text-[52px]">
            {subcategory.name}
          </h1>
          {subSubcategories.length ? (
            <p className="text-brand-nav mt-2.5 text-lg">
              {t("chooseSubSubcategory")}
            </p>
          ) : null}
        </div>
      </div>

      {subSubcategories.length ? (
        <div className={SECTION_X_PADDING}>
          <section className={cn(CONTENT_MAX_W, "pt-2 pb-8")}>
            <CategoryTileGrid
              tiles={subSubcategories.map((subSub) => ({
                documentId: subSub.documentId,
                name: subSub.name ?? "",
                imageUrl: formatStrapiMediaUrl(subSub.image?.url),
                href: `/catalog/${category.slug}/${subcategory.slug}/${subSub.slug}`,
                count: subSubCountBySlug.get(subSub.slug ?? "") ?? 0,
              }))}
              itemsLabel={(count) => t("items", { count })}
            />
          </section>
        </div>
      ) : null}

      <CatalogBrowser
        locale={locale as Locale}
        searchParams={query}
        lockedCategory={category.slug ?? undefined}
        lockedSubcategory={subcategory.slug ?? undefined}
      />
    </main>
  )
}
