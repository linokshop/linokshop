"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import type { ErrorKey, useCheckout } from "@/components/cart/useCheckout"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/styles"

type Checkout = ReturnType<typeof useCheckout>

/**
 * The sticky money column. Every figure here is a preview — `/api/lead` recomputes
 * the order from Strapi when it is placed, so nothing shown can decide the price.
 */
export function CartSummary({
  checkout,
  deliveryDate,
}: {
  readonly checkout: Checkout
  readonly deliveryDate: string
}) {
  const t = useTranslations("shop.cart")
  const tc = useTranslations("shop.common")
  const {
    count,
    totals,
    shipping,
    promoInput,
    setPromoInput,
    promo,
    promoChecked,
    checkPromo,
    payment,
    showSplit,
    vetPay,
    remainder,
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
    vet: t("errVet"),
  }
  const methodLabel = t(payment === "card" ? "payCardShort" : "payCashShort")

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
          label={`${t("discount")}${promo ? ` · ${promo.code}` : ""}`}
          value={`−${formatPrice(totals.discount)}`}
          valueClass="text-brand-crimson"
        />
      ) : null}
      <Row
        label={t("delivery")}
        value={totals.shipping === 0 ? t("free") : formatPrice(totals.shipping)}
        valueClass={totals.shipping === 0 ? "text-brand-moss" : undefined}
      />

      <p className="text-brand-moss flex items-center gap-2 pt-3 pb-0.5 text-[13.5px]">
        <span aria-hidden>📦</span>
        {t("willArrive", {
          date: shipping === "pickup" ? t("arriveToday") : deliveryDate,
        })}
      </p>

      <div className="border-brand-border mt-3.5 flex items-baseline justify-between border-t pt-4.5">
        <span className="font-oswald text-brand-cream text-lg uppercase">
          {t("toPay")}
        </span>
        <span className="font-oswald text-brand-gold text-[32px] font-bold">
          {formatPrice(totals.total)}
        </span>
      </div>

      {showSplit ? (
        <div className="bg-brand-steel border-brand-steel-line mt-3.5 rounded-lg border px-3.5 py-3">
          <div className="text-brand-mist flex justify-between py-0.5 text-[13.5px]">
            <span>«Дія»</span>
            <span className="text-brand-orange">{formatPrice(vetPay)}</span>
          </div>
          <div className="text-brand-mist flex justify-between py-0.5 text-[13.5px]">
            <span>{methodLabel}</span>
            <span className="text-white">{formatPrice(remainder)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-5 mb-2 flex gap-2.5">
        <input
          className="bg-brand-surface text-brand-nav placeholder:text-brand-muted focus:border-brand-bronze border-brand-field flex-1 rounded-lg border px-4 py-3.5 text-[15px] transition-colors outline-none"
          placeholder={t("promoPlaceholder")}
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void checkPromo()}
          className="border-brand-field text-brand-nav hover:border-brand-orange hover:text-brand-cream font-oswald cursor-pointer rounded-lg border px-4.5 text-sm uppercase transition-colors"
        >
          OK
        </button>
      </div>
      {promoChecked ? (
        <p
          className={cn(
            "mb-3.5 text-[13px]",
            promo ? "text-brand-moss" : "text-brand-crimson"
          )}
        >
          {promo ? t("promoOk", { percent: promo.percent }) : t("promoBad")}
        </p>
      ) : null}

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

      <div className="border-brand-border mt-5 flex flex-col gap-2.5 border-t pt-4.5">
        <Trust icon="🔒">{t("trustPay")}</Trust>
        <Trust icon="↩">{t("trustReturn")}</Trust>
        <Trust icon="✓">{t("trustWarranty")}</Trust>
      </div>

      <Link
        href="/catalog"
        className="text-brand-muted hover:text-brand-cream mt-4 block text-center text-sm transition-colors"
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

function Trust({
  icon,
  children,
}: {
  readonly icon: string
  readonly children: React.ReactNode
}) {
  return (
    <p className="text-brand-muted flex items-center gap-2.5 text-[13px]">
      <span aria-hidden className="text-brand-moss">
        {icon}
      </span>
      {children}
    </p>
  )
}

export default CartSummary
