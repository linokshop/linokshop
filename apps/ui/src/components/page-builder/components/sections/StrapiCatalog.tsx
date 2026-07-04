import "server-only"

import type { Data } from "@repo/strapi-types"

import { ProductCard } from "@/components/page-builder/components/elements/ProductCard"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

function CheckboxRow({ label }: { readonly label?: string | null }) {
  return (
    <li className="text-brand-nav flex items-center gap-2 text-sm">
      <span className="border-brand-border size-4 rounded-xs border" />
      {label}
    </li>
  )
}

/**
 * Catalog page section. The filter controls are visual placeholders for now —
 * real filtering/sorting/pagination will be wired to Strapi later.
 */
export function StrapiCatalog({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.catalog">
}) {
  const { title, resultsLabel, categories, brands, products } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h1"
            className="font-oswald text-brand-cream text-3xl font-bold uppercase lg:text-4xl"
          >
            {title}
          </Typography>
        ) : null}
        {resultsLabel ? (
          <p className="text-brand-muted mt-2 text-sm">{resultsLabel}</p>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[268px_1fr]">
          {/* Filter sidebar (visual) */}
          <aside className="border-brand-border bg-brand-surface h-fit space-y-6 rounded-sm border p-6">
            {categories?.length ? (
              <div>
                <h3 className="font-oswald text-brand-cream mb-3 text-sm tracking-wide uppercase">
                  Категорії
                </h3>
                <ul className="list-none space-y-2">
                  {categories.map((c) => (
                    <CheckboxRow key={c.id} label={c.text} />
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h3 className="font-oswald text-brand-cream mb-3 text-sm tracking-wide uppercase">
                Ціна, ₴
              </h3>
              <div className="bg-brand-border relative h-1 rounded-full">
                <span className="bg-brand-orange absolute inset-y-0 right-1/4 left-1/5 rounded-full" />
                <span className="bg-brand-orange border-brand-surface absolute top-1/2 left-1/5 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
                <span className="bg-brand-orange border-brand-surface absolute top-1/2 right-1/4 size-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
              </div>
              <div className="text-brand-muted mt-2 flex justify-between text-xs">
                <span>200</span>
                <span>5 000</span>
              </div>
            </div>

            {brands?.length ? (
              <div>
                <h3 className="font-oswald text-brand-cream mb-3 text-sm tracking-wide uppercase">
                  Бренди
                </h3>
                <ul className="list-none space-y-2">
                  {brands.map((b) => (
                    <CheckboxRow key={b.id} label={b.text} />
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="text-brand-nav flex items-center gap-2 text-sm">
              <span className="border-brand-border size-4 rounded-xs border" />
              Тільки в наявності
            </div>

            <div className="flex gap-2 pt-2">
              <span className="bg-brand-bronze font-oswald flex-1 rounded-sm px-4 py-2.5 text-center text-xs font-semibold text-white uppercase">
                Застосувати
              </span>
              <span className="border-brand-border text-brand-nav font-oswald flex-1 rounded-sm border px-4 py-2.5 text-center text-xs font-semibold uppercase">
                Скинути
              </span>
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="border-brand-border mb-6 flex items-center justify-between border-b pb-4">
              <span className="text-brand-muted text-sm">{resultsLabel}</span>
              <span className="border-brand-border text-brand-nav font-oswald rounded-sm border px-4 py-2 text-xs uppercase">
                Сортування: за популярністю ▾
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {["1", "2", "3", "→"].map((page, index) => (
                <span
                  key={page}
                  className={cn(
                    "font-oswald flex size-9 items-center justify-center rounded-sm text-sm",
                    index === 0
                      ? "bg-brand-orange text-brand-navy"
                      : "border-brand-border text-brand-nav border"
                  )}
                >
                  {page}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

StrapiCatalog.displayName = "StrapiCatalog"

export default StrapiCatalog
