import "server-only"

import type { Data } from "@repo/strapi-types"

import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Product = Data.Component<"sections.product">

function ProductGallery({
  image,
  badge,
}: {
  readonly image: Product["image"]
  readonly badge?: string | null
}) {
  return (
    <div>
      <div className="bg-brand-navy relative aspect-square overflow-hidden rounded-sm">
        {image ? (
          <StrapiBasicImage component={image} fill className="object-cover" />
        ) : null}
        {badge ? (
          <span className="bg-brand-orange text-brand-navy font-oswald absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold uppercase">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((thumb) => (
          <div
            key={thumb}
            className="border-brand-border bg-brand-surface aspect-square rounded-sm border"
          />
        ))}
      </div>
    </div>
  )
}

function ProductInfo({ component }: { readonly component: Product }) {
  const {
    category,
    name,
    price,
    oldPrice,
    rating,
    availability,
    optionLabel,
    options,
    deliveryNotes,
    veteranNote,
  } = component

  return (
    <div className="flex flex-col gap-4">
      {category ? (
        <span className="font-oswald text-brand-muted text-xs tracking-wide uppercase">
          {category}
        </span>
      ) : null}
      {name ? (
        <Typography
          tag="h1"
          className="font-oswald text-brand-cream text-3xl font-bold uppercase"
        >
          {name}
        </Typography>
      ) : null}
      <div className="flex items-center gap-4 text-sm">
        {rating ? <span className="text-brand-orange">★ {rating}</span> : null}
        {availability ? (
          <span className="text-brand-nav">{availability}</span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-3">
        {price ? (
          <span className="font-oswald text-brand-cream text-4xl font-bold">
            {price}
          </span>
        ) : null}
        {oldPrice ? (
          <span className="text-brand-muted text-lg line-through">
            {oldPrice}
          </span>
        ) : null}
      </div>

      {options?.length ? (
        <div>
          {optionLabel ? (
            <span className="text-brand-nav mb-2 block text-sm">
              {optionLabel}
            </span>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <span
                key={option.id}
                className={cn(
                  "font-oswald rounded-sm border px-4 py-2 text-sm uppercase",
                  index === 0
                    ? "border-brand-orange text-brand-cream"
                    : "border-brand-border text-brand-nav"
                )}
              >
                {option.text}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="border-brand-border text-brand-nav flex items-center rounded-sm border">
          <span className="px-3 py-2">−</span>
          <span className="text-brand-cream px-3 py-2">1</span>
          <span className="px-3 py-2">+</span>
        </div>
        <span className="bg-brand-bronze font-oswald flex-1 rounded-sm px-6 py-3 text-center text-sm font-semibold text-white uppercase">
          Додати в кошик
        </span>
        <span className="border-brand-border text-brand-orange flex size-11 items-center justify-center rounded-sm border">
          ♡
        </span>
      </div>

      {veteranNote ? (
        <div className="bg-brand-steel border-brand-orange rounded-sm border-l-4 p-4">
          <span className="font-oswald text-brand-orange text-xs font-semibold uppercase">
            Ветеранський спорт
          </span>
          <p className="text-brand-nav mt-1 text-sm">{veteranNote}</p>
        </div>
      ) : null}

      {deliveryNotes?.length ? (
        <ul className="text-brand-nav list-none space-y-1.5 text-sm">
          {deliveryNotes.map((note) => (
            <li key={note.id} className="flex gap-2">
              <span className="text-brand-orange">✓</span>
              {note.text}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/**
 * Product detail page section. Gallery, quantity, options and add-to-cart are
 * visual placeholders for now — cart state will be wired later.
 */
export function StrapiProduct({
  component,
}: PageBuilderComponentProps & { readonly component: Product }) {
  const { image, badge, description, specs, relatedTitle, related } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <ProductGallery image={image} badge={badge} />
          <ProductInfo component={component} />
        </div>

        {/* Description + specs */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {description ? (
            <div>
              <Typography
                tag="h2"
                className="font-oswald text-brand-cream mb-4 text-xl font-semibold uppercase"
              >
                Опис
              </Typography>
              <Typography className="text-brand-nav text-sm/7">
                {description}
              </Typography>
            </div>
          ) : null}
          {specs?.length ? (
            <div>
              <Typography
                tag="h2"
                className="font-oswald text-brand-cream mb-4 text-xl font-semibold uppercase"
              >
                Характеристики
              </Typography>
              <dl className="border-brand-border divide-brand-border divide-y border-t border-b text-sm">
                {specs.map((spec) => (
                  <div key={spec.id} className="flex justify-between py-2.5">
                    <dt className="text-brand-muted">{spec.label}</dt>
                    <dd className="text-brand-cream">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        {/* Related */}
        {related?.length ? (
          <div className="mt-12">
            {relatedTitle ? (
              <Typography
                tag="h2"
                className="font-oswald text-brand-cream mb-6 text-2xl font-bold uppercase"
              >
                {relatedTitle}
              </Typography>
            ) : null}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

StrapiProduct.displayName = "StrapiProduct"

export default StrapiProduct
