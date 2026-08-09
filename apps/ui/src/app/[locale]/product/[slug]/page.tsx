import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import CkEditorRenderer from "@/components/elementary/ck-editor"
import { AddToCart } from "@/components/product/AddToCart"
import { AlsoBought, toAlsoBoughtTiles } from "@/components/product/AlsoBought"
import { ProductGallery } from "@/components/product/ProductGallery"
import { badgeClass } from "@/lib/badges"
import { formatPrice as formatUah } from "@/lib/format"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import { fetchProductBySlug } from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

const formatPrice = (value: number | null | undefined) =>
  value == null ? undefined : formatUah(value)

interface ProductPageProps {
  readonly params: Promise<{ locale: string; slug: string }>
}

async function getProduct(slug: string, locale: Locale) {
  const response = await fetchProductBySlug(slug, locale)

  return response?.data
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProduct(slug, locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.product",
  })

  return {
    title: product?.name ?? t("metaFallback"),
    description: product?.description ?? undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.product",
  })
  const tc = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })

  const product = await getProduct(slug, locale as Locale)
  if (!product) {
    notFound()
  }

  const name = product.name ?? ""

  const images = (product.images ?? [])
    .map((media) => ({
      url: formatStrapiMediaUrl(media?.url) ?? "",
      alt: name,
    }))
    .filter((image) => image.url)

  const specRows = (product.specs ?? [])
    .map((spec) => ({
      label: spec.label ?? "",
      value: spec.value ?? "",
    }))
    .filter((row) => row.label && row.value)

  // Whole subcategories a buyer typically needs alongside this one — a rod wants
  // worms, not one specific jar of them. Configured on the subcategory in the
  // CMS, so it is set once for every rod rather than product by product.
  const alsoBoughtTiles = toAlsoBoughtTiles(
    product.subcategory?.alsoBought ?? []
  )

  const discount =
    product.oldPrice && product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null

  return (
    <main className="bg-brand-surface font-golos flex w-full flex-1 flex-col">
      <div className={cn(SECTION_X_PADDING, CONTENT_MAX_W, "pt-8")}>
        <nav
          aria-label="Breadcrumb"
          className="font-oswald text-brand-muted text-[13px] tracking-[0.06em] uppercase"
        >
          <AppLink href="/" unstyled className="hover:text-brand-cream">
            {tc("home")}
          </AppLink>
          {" · "}
          <AppLink href="/catalog" unstyled className="hover:text-brand-cream">
            {tc("catalog")}
          </AppLink>
          {product.subcategory?.category ? (
            <>
              {" · "}
              <AppLink
                href={`/catalog/${product.subcategory.category.slug}`}
                unstyled
                className="hover:text-brand-cream"
              >
                {product.subcategory.category.name}
              </AppLink>
            </>
          ) : null}
          {product.subcategory ? (
            <>
              {" · "}
              <AppLink
                href={
                  product.subcategory.category
                    ? `/catalog/${product.subcategory.category.slug}/${product.subcategory.slug}`
                    : "/catalog"
                }
                unstyled
                className="hover:text-brand-cream"
              >
                {product.subcategory.name}
              </AppLink>
            </>
          ) : null}
          {product.subSubcategory && product.subcategory?.category ? (
            <>
              {" · "}
              <AppLink
                href={`/catalog/${product.subcategory.category.slug}/${product.subcategory.slug}/${product.subSubcategory.slug}`}
                unstyled
                className="hover:text-brand-cream"
              >
                {product.subSubcategory.name}
              </AppLink>
            </>
          ) : null}
          <span className="text-brand-nav"> · {product.name}</span>
        </nav>
      </div>

      <div
        className={cn(
          SECTION_X_PADDING,
          CONTENT_MAX_W,
          "grid items-start gap-8 py-6 min-[900px]:grid-cols-[1.05fr_1fr] min-[900px]:gap-12 min-[900px]:pb-15"
        )}
      >
        <ProductGallery
          images={images}
          badge={product.badge}
          badgeClassName={badgeClass(product.badgeColor)}
        />

        <div>
          <div className="font-oswald text-brand-muted mb-2.5 text-[13px] tracking-[0.06em] uppercase">
            {[product.subcategory?.name, product.brand?.name]
              .filter(Boolean)
              .join(" · ")}
          </div>

          <h1 className="font-oswald text-brand-cream mb-3.5 text-[32px] leading-[1.05] font-bold tracking-[0.01em] uppercase min-[600px]:text-[40px]">
            {product.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
            <span
              className={
                product.inStock ? "text-brand-moss" : "text-brand-faded"
              }
            >
              ● {tc(product.inStock ? "inStock" : "outOfStock")}
            </span>
          </div>

          <div className="mb-6.5 flex flex-wrap items-baseline gap-3.5">
            <span className="font-oswald text-brand-gold text-[38px] leading-none font-bold min-[600px]:text-[46px]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <span className="text-brand-faded text-xl line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
            {discount && discount > 0 ? (
              <span className="font-oswald bg-brand-crimson rounded px-2.5 py-1.5 text-[13px] font-bold text-white">
                −{discount}%
              </span>
            ) : null}
          </div>

          <AddToCart
            item={{
              slug,
              name,
              price: product.price ?? 0,
              imageUrl: images[0]?.url,
            }}
            disabled={!product.inStock}
          />

          <AppLink
            href="/veteran"
            unstyled
            className="bg-brand-steel border-brand-orange hover:bg-brand-steel/80 mb-5.5 flex items-center gap-4 rounded-lg border-l-[3px] px-5 py-4 transition-colors"
          >
            <span className="flex-1">
              <span className="font-oswald block text-sm tracking-[0.04em] text-white uppercase">
                {t("veteranTitle")}
              </span>
              <span className="text-brand-mist mt-1 block text-[13px]">
                {t("veteranNote")}
              </span>
            </span>
            <span aria-hidden className="text-brand-orange text-xl">
              →
            </span>
          </AppLink>
        </div>
      </div>

      {product.description || specRows.length ? (
        <div
          className={cn(
            SECTION_X_PADDING,
            CONTENT_MAX_W,
            "grid gap-8 pb-15 min-[900px]:grid-cols-2 min-[900px]:gap-12"
          )}
        >
          {product.description ? (
            <section>
              <h2 className="font-oswald text-brand-cream mb-4 text-[26px] font-semibold tracking-[0.02em] uppercase">
                {t("description")}
              </h2>
              <CkEditorRenderer
                htmlContent={product.description}
                className="[&_p]:text-brand-nav [&_p]:mb-3.5 [&_p]:text-[15.5px] [&_p]:leading-[1.8] [&_p:last-child]:mb-0"
              />
            </section>
          ) : null}

          {specRows.length ? (
            <section>
              <h2 className="font-oswald text-brand-cream mb-4 text-[26px] font-semibold tracking-[0.02em] uppercase">
                {t("specs")}
              </h2>
              <dl className="flex flex-col">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="border-brand-border flex justify-between gap-6 border-b py-3.5 text-[15px] last:border-b-0"
                  >
                    <dt className="text-brand-muted">{row.label}</dt>
                    <dd className="text-brand-cream text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}

      {alsoBoughtTiles.length ? (
        <div className={cn(SECTION_X_PADDING, CONTENT_MAX_W, "pb-17.5")}>
          <AlsoBought tiles={alsoBoughtTiles} locale={locale as Locale} />
        </div>
      ) : null}
    </main>
  )
}
