import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Cart = Data.Component<"sections.cart">

const sectionHeading =
  "font-oswald text-brand-cream mb-4 text-xl font-semibold uppercase"

function Field({
  label,
  placeholder,
}: {
  readonly label: string
  readonly placeholder: string
}) {
  return (
    <div>
      <span className="text-brand-nav mb-1.5 block text-sm">{label}</span>
      <div className="border-brand-border bg-brand-navy text-brand-muted rounded-sm border px-3 py-2.5 text-sm">
        {placeholder}
      </div>
    </div>
  )
}

function PaymentRow({
  label,
  checked,
  highlighted,
}: {
  readonly label: string
  readonly checked?: boolean
  readonly highlighted?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sm border p-4",
        checked || highlighted ? "border-brand-orange" : "border-brand-border"
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-brand-orange" : "border-brand-border"
        )}
      >
        {checked ? (
          <span className="bg-brand-orange size-2.5 rounded-full" />
        ) : null}
      </span>
      <span
        className={cn(
          "text-sm",
          highlighted ? "text-brand-orange" : "text-brand-cream"
        )}
      >
        {label}
      </span>
    </div>
  )
}

function CartItemRow({
  item,
}: {
  readonly item: Data.Component<"elements.cart-item">
}) {
  return (
    <div className="border-brand-border bg-brand-surface flex flex-wrap items-center gap-4 rounded-sm border p-4">
      <div className="bg-brand-navy relative size-24 shrink-0 overflow-hidden rounded-sm">
        {item.image ? (
          <StrapiBasicImage
            component={item.image}
            fill
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-40 flex-1">
        <div className="text-brand-cream font-medium">{item.name}</div>
        {item.option ? (
          <div className="text-brand-muted text-sm">{item.option}</div>
        ) : null}
      </div>
      <div className="border-brand-border text-brand-nav flex items-center rounded-sm border">
        <span className="px-2.5 py-1.5">−</span>
        <span className="text-brand-cream px-2.5 py-1.5">1</span>
        <span className="px-2.5 py-1.5">+</span>
      </div>
      <div className="font-oswald text-brand-cream text-lg font-semibold">
        {item.price}
      </div>
      <span className="text-brand-muted">✕</span>
    </div>
  )
}

function CartSummary({ component }: { readonly component: Cart }) {
  const { itemsTotal, discount, delivery, total } = component
  const rows: [string, string | null | undefined, boolean?][] = [
    ["Товари", itemsTotal],
    ["Знижка", discount, true],
    ["Доставка", delivery],
  ]

  return (
    <aside className="border-brand-border bg-brand-surface h-fit space-y-4 rounded-sm border p-6 lg:sticky lg:top-24">
      <Typography tag="h2" className={sectionHeading}>
        Разом
      </Typography>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value, accent]) =>
          value ? (
            <div key={label} className="flex justify-between">
              <dt className="text-brand-muted">{label}</dt>
              <dd className={accent ? "text-brand-orange" : "text-brand-cream"}>
                {value}
              </dd>
            </div>
          ) : null
        )}
      </dl>
      {total ? (
        <div className="border-brand-border flex items-center justify-between border-t pt-3">
          <span className="font-oswald text-brand-cream text-lg uppercase">
            До сплати
          </span>
          <span className="font-oswald text-brand-cream text-2xl font-bold">
            {total}
          </span>
        </div>
      ) : null}
      <div className="border-brand-border flex overflow-hidden rounded-sm border">
        <span className="text-brand-muted flex-1 px-3 py-2.5 text-sm">
          Промокод
        </span>
        <span className="bg-brand-border text-brand-nav font-oswald px-4 py-2.5 text-xs uppercase">
          OK
        </span>
      </div>
      <span className="bg-brand-bronze font-oswald block rounded-sm px-6 py-3.5 text-center text-sm font-semibold text-white uppercase">
        Оформити замовлення
      </span>
    </aside>
  )
}

/**
 * Cart / checkout page section. Quantity, form fields and payment are visual
 * placeholders for now — cart state and checkout will be wired later.
 */
export function StrapiCart({
  component,
}: PageBuilderComponentProps & { readonly component: Cart }) {
  const { title, items } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h1"
            className="font-oswald text-brand-cream text-3xl font-bold uppercase lg:text-4xl"
          >
            {title}
            {items?.length ? (
              <span className="text-brand-muted"> ({items.length})</span>
            ) : null}
          </Typography>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Items + form */}
          <div className="space-y-8">
            <div className="space-y-3">
              {items?.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div>
              <Typography tag="h2" className={sectionHeading}>
                Отримувач
              </Typography>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ім'я та прізвище" placeholder="Іван Іваненко" />
                <Field label="Телефон" placeholder="+38 (0__) ___-__-__" />
                <Field label="Місто" placeholder="Житомир" />
                <Field
                  label="Відділення Нової Пошти"
                  placeholder="Відділення №1"
                />
              </div>
            </div>

            <div>
              <Typography tag="h2" className={sectionHeading}>
                Оплата
              </Typography>
              <div className="space-y-3">
                <PaymentRow label="Картка онлайн" checked />
                <PaymentRow label="При отриманні" />
                <PaymentRow
                  label="Програма «Дія» (для ветеранів)"
                  highlighted
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <CartSummary component={component} />
        </div>
      </div>
    </section>
  )
}

StrapiCart.displayName = "StrapiCart"

export default StrapiCart
