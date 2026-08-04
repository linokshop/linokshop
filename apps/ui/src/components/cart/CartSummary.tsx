"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import type { ErrorKey, useCheckout } from "@/components/cart/useCheckout"
import { VETERAN_DISCOUNT_PERCENT } from "@/lib/checkout"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/styles"

type Checkout = ReturnType<typeof useCheckout>

/**
 * The sticky money column. Every figure here is a preview — `/api/lead` recomputes
 * the order from Strapi when it is placed, so nothing shown can decide the price.
 */
export function CartSummary({ checkout }: { readonly checkout: Checkout }) {
  const t = useTranslations("shop.cart")
  const tc = useTranslations("shop.common")
  const {
    count,
    totals,
    shipping,
    deliveryCost,
    veteran,
    toggleVeteran,
    errorKeys,
    submitted,
    status,
    error,
    submit,
  } = checkout

  const failMessage = t("sendFailed")
  const errorLabels: Record<ErrorKey, string> = {
    name: t("errName"),
    phone: t("errPhone"),
    city: t("errCity"),
    branch: t("errBranch"),
    street: t("errStreet"),
  }

  return (
    <aside className="border-brand-border bg-brand-green sticky top-5 rounded-xl border p-6.5">
      <div className="font-oswald text-brand-sand mb-5 text-lg tracking-[0.06em] uppercase">
        {t("summary")}
      </div>

      <Row
        label={t("itemsCount", { count })}
        value={formatPrice(totals.subtotal)}
      />
      {totals.discount > 0 ? (
        <Row
          label={`${t("discount")} · ${t("veteranDiscountTag")}`}
          value={`−${formatPrice(totals.discount)}`}
          valueClass="text-brand-crimson"
        />
      ) : null}
      {shipping === "pickup" ? (
        <Row
          label={t("delivery")}
          value={t("free")}
          valueClass="text-brand-moss"
        />
      ) : (
        <div className="text-brand-nav flex justify-between gap-2 py-2 text-[15px]">
          <span>{t("delivery")}</span>
          <span className="text-right">
            <span className="text-brand-cream block">
              {deliveryCost == null
                ? t("deliveryByCarrier")
                : t("deliveryFrom", { amount: formatPrice(deliveryCost) })}
            </span>
            {deliveryCost == null ? null : (
              <span className="text-brand-muted block text-[12px]">
                {t("byWeightNote")}
              </span>
            )}
          </span>
        </div>
      )}

      {/* No arrival estimate is shown anywhere: real delivery times vary far too
          much to promise a date, and a promise the shop cannot keep costs more
          than the reassurance it buys. */}

      <div className="border-brand-border mt-3.5 flex items-baseline justify-between border-t pt-4.5">
        <span className="font-oswald text-brand-cream text-lg uppercase">
          {t("toPay")}
        </span>
        <span className="font-oswald text-brand-gold text-[32px] font-bold">
          {formatPrice(totals.total)}
        </span>
      </div>

      {/* Label left, benefit right — the same shape as the money rows above, so
          it reads as part of the bill rather than a form to fill in. Nothing is
          verified, so nothing is asked for beyond the tick. */}
      <button
        type="button"
        onClick={toggleVeteran}
        aria-pressed={veteran}
        className="bg-brand-steel border-brand-steel-line mt-3.5 flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left"
      >
        <span
          aria-hidden
          className={cn(
            "border-brand-orange text-brand-navy flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 text-[13px] font-extrabold transition-colors",
            veteran ? "bg-brand-orange" : "bg-transparent"
          )}
        >
          {veteran ? "✓" : null}
        </span>
        <span className="text-brand-mist flex-1 text-[14.5px]">
          {t("veteranDiscount")}
        </span>
        <span className="font-oswald text-brand-orange shrink-0 text-sm font-semibold">
          −{VETERAN_DISCOUNT_PERCENT}%
        </span>
      </button>

      {submitted && errorKeys.length ? (
        <div className="border-brand-crimson mb-3 rounded-lg border bg-[rgba(207,59,59,0.1)] px-4 py-3.5">
          <p className="mb-1.5 text-[13.5px] font-semibold text-[#e79a9a]">
            {t("fixPlease")}
          </p>
          {errorKeys.map((key) => (
            <p key={key} className="py-0.5 text-[13px] text-[#d8a0a0]">
              • {errorLabels[key]}
            </p>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void submit(failMessage)}
        disabled={status === "sending"}
        className="bg-brand-bronze font-oswald hover:bg-brand-orange mt-1.5 w-full cursor-pointer rounded-lg py-4.5 text-[17px] font-medium tracking-[0.05em] text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
      >
        {t(status === "sending" ? "sending" : "placeOrder")}
      </button>

      {status === "error" && error ? (
        <p className="text-brand-orange mt-3 text-center text-sm">{error}</p>
      ) : null}

      <Link
        href="/catalog"
        className="text-brand-muted hover:text-brand-cream mt-5 block text-center text-sm transition-colors"
      >
        {tc("continueShopping")}
      </Link>
    </aside>
  )
}

function Row({
  label,
  value,
  valueClass,
}: {
  readonly label: string
  readonly value: string
  readonly valueClass?: string
}) {
  return (
    <div className="text-brand-nav flex justify-between py-2 text-[15px]">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

export default CartSummary
