"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { CartLines, type CrossSellItem } from "@/components/cart/CartLines"
import { CartSummary } from "@/components/cart/CartSummary"
import { CheckoutFields } from "@/components/cart/CheckoutFields"
import { useCheckout } from "@/components/cart/useCheckout"

/**
 * The cart and checkout. The basket lives in the browser, so this is a client
 * component; the recommended products beside it are fetched on the server and
 * handed down.
 */
export function CartView({
  recommended,
  deliveryDate,
}: {
  readonly recommended: readonly CrossSellItem[]
  /**
   * Formatted on the server. Reading the clock while rendering would make the
   * server and the browser disagree on the date and break hydration.
   */
  readonly deliveryDate: string
}) {
  const t = useTranslations("shop.cart")
  const checkout = useCheckout()
  const { lines, lineId, count, totals, status, orderNo } = checkout

  if (status === "sent") {
    return (
      <div className="border-brand-border bg-brand-green mx-auto mt-8 max-w-180 rounded-2xl border p-10 text-center min-[600px]:p-14">
        <div className="bg-brand-forest mx-auto mb-5.5 flex size-19 items-center justify-center rounded-full text-[38px] text-white">
          ✓
        </div>
        <h2 className="font-oswald text-brand-cream mb-2.5 text-[30px] tracking-[0.02em] uppercase">
          {t("doneTitle")}
        </h2>
        <p className="text-brand-nav mx-auto mb-7 max-w-115 text-[15.5px] leading-relaxed">
          {t("doneNote")}
        </p>
        {orderNo ? (
          <div className="border-brand-field bg-brand-surface mx-auto mb-7 max-w-105 rounded-xl border p-6 text-left">
            <div className="text-brand-nav flex justify-between py-2 text-[15px]">
              <span>{t("orderNo")}</span>
              <span className="font-oswald text-brand-cream tracking-[0.04em]">
                {orderNo}
              </span>
            </div>
          </div>
        ) : null}
        <Link
          href="/catalog"
          className="bg-brand-bronze font-oswald hover:bg-brand-orange inline-flex rounded-lg px-8 py-3.5 text-sm tracking-[0.05em] text-white uppercase transition-colors"
        >
          {t("toCatalogDone")}
        </Link>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="border-brand-border bg-brand-green mt-8 rounded-2xl border p-10 text-center min-[600px]:p-17.5">
        <h2 className="font-oswald text-brand-cream mb-3 text-[26px] tracking-[0.02em] uppercase">
          {t("emptyTitle")}
        </h2>
        <p className="text-brand-nav mb-6.5 text-[15.5px]">{t("emptyNote")}</p>
        <Link
          href="/catalog"
          className="bg-brand-bronze font-oswald hover:bg-brand-orange inline-flex rounded-lg px-8 py-3.5 text-sm tracking-[0.05em] text-white uppercase transition-colors"
        >
          {t("toCatalogArrow")}
        </Link>
      </div>
    )
  }

  // Nothing already in the basket should show up as a suggestion.
  const inCart = new Set(lines.map((line) => line.slug))
  const crossSell = recommended
    .filter((item) => !inCart.has(item.slug))
    .slice(0, 4)

  return (
    <>
      <p className="text-brand-nav mt-2.5 mb-8 text-base">
        {t("countLabel", { count })}
      </p>

      <div className="grid items-start gap-8 min-[900px]:grid-cols-[1fr_400px]">
        <div>
          <CartLines
            lines={lines}
            lineIdOf={lineId}
            subtotal={totals.subtotal}
            discount={totals.discount}
            shippingIsPickup={checkout.shipping === "pickup"}
            crossSell={crossSell}
            onQuantity={checkout.setQuantity}
            onRemove={checkout.remove}
            onAdd={(item) => checkout.add(item)}
          />
          <CheckoutFields
            checkout={checkout}
            afterDiscount={totals.subtotal - totals.discount}
          />
        </div>

        <CartSummary checkout={checkout} deliveryDate={deliveryDate} />
      </div>
    </>
  )
}

export default CartView
