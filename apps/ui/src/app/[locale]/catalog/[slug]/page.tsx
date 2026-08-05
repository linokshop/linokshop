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
import {
  fetchCategoryBySlug,
  fetchCategoryCounts,
} from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

interface CategoryPageProps {
  readonly params: Promise<{ locale: string; slug: string }>
  readonly searchParams: Promise<SearchParams>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await fetchCategoryBySlug(slug, locale as Locale)

  return { title: category?.name ?? undefined }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.categories",
  })
  const tc = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })

  const category = await fetchCategoryBySlug(slug, locale as Locale)
  if (!category) {
    notFound()
  }

  const query = await searchParams
  const counts = await fetchCategoryCounts(locale as Locale)
  const subcategories = category.subcategories ?? []
  const countBySlug = new Map(counts.map((c) => [c.slug, c.count]))
  const total = subcategories.reduce(
    (sum, sub) => sum + (countBySlug.get(sub.slug ?? "") ?? 0),
    0
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
            <span className="text-brand-nav"> · {category.name}</span>
          </nav>

          <h1 className="font-oswald text-brand-cream text-[38px] leading-tight font-bold tracking-[0.01em] uppercase min-[600px]:text-[52px]">
            {category.name}
          </h1>
          {subcategories.length ? (
            <p className="text-brand-nav mt-2.5 text-lg">
              {t("chooseSubcategory")} — {t("items", { count: total })}
            </p>
          ) : null}
        </div>
      </div>

      <div className={SECTION_X_PADDING}>
        <section className={cn(CONTENT_MAX_W, "pt-2 pb-17.5")}>
          {/* A category with no subcategories holds no products either — products
              attach to subcategories. Say so instead of showing an empty grid. */}
          {subcategories.length === 0 ? (
            <div className="border-brand-border bg-brand-green rounded-xl border p-10 text-center">
              <p className="text-brand-nav text-[15.5px]">{t("empty")}</p>
              <AppLink
                href="/catalog"
                unstyled
                className="font-oswald text-brand-gold hover:text-brand-cream mt-4 inline-block text-[15px] tracking-[0.04em] uppercase transition-colors"
              >
                {tc("toCatalog")}
              </AppLink>
            </div>
          ) : null}

          <CategoryTileGrid
            tiles={subcategories.map((sub) => ({
              documentId: sub.documentId,
              name: sub.name ?? "",
              imageUrl: formatStrapiMediaUrl(sub.image?.url),
              href: `/catalog/${category.slug}/${sub.slug}`,
              count: countBySlug.get(sub.slug ?? "") ?? 0,
            }))}
            itemsLabel={(count) => t("items", { count })}
          />
        </section>
      </div>

      {/* Everything in the category, under the tiles. The tiles are for a reader
          who knows which shelf they want; this is for one who would rather see
          the whole aisle and filter it down. */}
      <CatalogBrowser
        locale={locale as Locale}
        searchParams={query}
        lockedCategory={category.slug ?? undefined}
      />
    </main>
  )
}
