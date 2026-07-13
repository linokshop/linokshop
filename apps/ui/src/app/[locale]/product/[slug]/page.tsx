import type { Data } from "@repo/strapi-types"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { AddToCart } from "@/components/product/AddToCart"
import { ProductGallery } from "@/components/product/ProductGallery"
import { formatPrice as formatUah } from "@/lib/format"
import { SECTION_X_PADDING } from "@/lib/layout"
import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

const BADGE_COLORS = {
  bronze: "bg-brand-bronze text-white",
  sale: "bg-brand-crimson text-white",
  stock: "bg-brand-moss text-white",
} as const

const formatPrice = (value: number | null | undefined) =>
  value == null ? undefined : formatUah(value)

const DELIVERY_NOTES = [
  "Доставка Новою Поштою — 1–2 дні, від 60 ₴",
  "Оплата карткою онлайн або при отриманні",
  "Гарантія 12 місяців · обмін 14 днів",
]

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

  return {
    title: product?.name ?? "Товар",
    description: product?.description ?? undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)

  const product = await getProduct(slug, locale as Locale)
  if (!product) {
    notFound()
  }

  const related = await fetchRelatedProducts(
    locale as Locale,
    product.category?.slug ?? undefined,
    slug
  )

  const name = product.name ?? ""

  const images = (product.images ?? [])
    .map((media) => ({
      url: formatStrapiMediaUrl(media?.url) ?? "",
      alt: name,
    }))
    .filter((image) => image.url)

  const options = (product.options ?? [])
    .map((option) => option.text)
    .filter((text): text is string => Boolean(text))

  const discount =
    product.oldPrice && product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null

  return (
    <main className="bg-brand-surface font-golos flex w-full flex-1 flex-col">
      <div
        className={cn(SECTION_X_PADDING, "mx-auto w-full max-w-[1320px] pt-8")}
      >
        <nav
          aria-label="Breadcrumb"
          className="font-oswald text-brand-muted text-[13px] tracking-[0.06em] uppercase"
        >
          <AppLink href="/" unstyled className="hover:text-brand-cream">
            Головна
          </AppLink>
          {" · "}
          <AppLink href="/catalog" unstyled className="hover:text-brand-cream">
            Каталог
          </AppLink>
          {product.category ? (
            <>
              {" · "}
              <AppLink
                href={`/catalog?category=${product.category.slug}`}
                unstyled
                className="hover:text-brand-cream"
              >
                {product.category.name}
              </AppLink>
            </>
          ) : null}
          <span className="text-brand-nav"> · {product.name}</span>
        </nav>
      </div>

      <div
        className={cn(
          SECTION_X_PADDING,
          "mx-auto grid w-full max-w-[1320px] items-start gap-8 py-6 min-[900px]:grid-cols-[1.05fr_1fr] min-[900px]:gap-12 min-[900px]:pb-15"
        )}
      >
        <ProductGallery
          images={images}
          badge={product.badge}
          badgeClassName={BADGE_COLORS[product.badgeColor ?? "bronze"]}
        />

        <div>
          <div className="font-oswald text-brand-muted mb-2.5 text-[13px] tracking-[0.06em] uppercase">
            {[product.category?.name, product.brand?.name]
              .filter(Boolean)
              .join(" · ")}
          </div>

          <h1 className="font-oswald text-brand-cream mb-3.5 text-[32px] leading-[1.05] font-bold tracking-[0.01em] uppercase min-[600px]:text-[40px]">
            {product.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
            {product.rating ? (
              <span className="text-brand-muted">★ {product.rating}</span>
            ) : null}
            <span
              className={
                product.inStock ? "text-brand-moss" : "text-brand-faded"
              }
            >
              ● {product.inStock ? "В наявності" : "Немає в наявності"}
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
            options={options}
            disabled={!product.inStock}
          />

          <AppLink
            href="/veteran"
            unstyled
            className="bg-brand-steel border-brand-orange hover:bg-brand-steel/80 mb-5.5 flex items-center gap-4 rounded-lg border-l-[3px] px-5 py-4 transition-colors"
          >
            <span className="flex-1">
              <span className="font-oswald block text-sm tracking-[0.04em] text-white uppercase">
                Доступно за програмою «Ветеранський спорт»
              </span>
              <span className="text-brand-mist mt-1 block text-[13px]">
                Оплата державною підтримкою через «Дія» для ветеранів та
                ветеранок
              </span>
            </span>
            <span aria-hidden className="text-brand-orange text-xl">
              →
            </span>
          </AppLink>

          <ul className="border-brand-border text-brand-nav flex list-none flex-col gap-3 border-t pt-5 text-[14.5px]">
            {DELIVERY_NOTES.map((note) => (
              <li key={note} className="flex gap-3">
                <span aria-hidden className="text-brand-gold">
                  ●
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.description || product.specs?.length ? (
        <div
          className={cn(
            SECTION_X_PADDING,
            "mx-auto grid w-full max-w-[1320px] gap-8 pb-15 min-[900px]:grid-cols-2 min-[900px]:gap-12"
          )}
        >
          {product.description ? (
            <section>
              <h2 className="font-oswald text-brand-cream mb-4 text-[26px] font-semibold tracking-[0.02em] uppercase">
                Опис
              </h2>
              {product.description.split(/\n{2,}/).map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-brand-nav mb-3.5 text-[15.5px] leading-[1.8] last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {product.specs?.length ? (
            <section>
              <h2 className="font-oswald text-brand-cream mb-4 text-[26px] font-semibold tracking-[0.02em] uppercase">
                Характеристики
              </h2>
              <dl className="flex flex-col">
                {product.specs.map((spec) => (
                  <div
                    key={spec.id}
                    className="border-brand-border flex justify-between gap-6 border-b py-3.5 text-[15px] last:border-b-0"
                  >
                    <dt className="text-brand-muted">{spec.label}</dt>
                    <dd className="text-brand-cream text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}

      {related.length ? (
        <div
          className={cn(
            SECTION_X_PADDING,
            "mx-auto w-full max-w-[1320px] pb-17.5"
          )}
        >
          <h2 className="font-oswald text-brand-cream mb-6.5 text-[30px] font-semibold tracking-[0.02em] uppercase min-[600px]:text-[32px]">
            Схожі товари
          </h2>
          <div className="grid grid-cols-2 gap-3.5 min-[600px]:gap-5.5 min-[1024px]:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.documentId}
                product={
                  {
                    id: item.id,
                    category: item.category?.name,
                    name: item.name,
                    price: formatPrice(item.price),
                    oldPrice: formatPrice(item.oldPrice),
                    badge: item.badge,
                    badgeColor: item.badgeColor,
                    image: item.images?.[0]
                      ? { media: item.images[0], alt: item.name }
                      : undefined,
                    link: {
                      type: "external",
                      label: item.name,
                      href: `/product/${item.slug}`,
                      newTab: false,
                    },
                  } as unknown as Data.Component<"elements.product-card">
                }
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}
