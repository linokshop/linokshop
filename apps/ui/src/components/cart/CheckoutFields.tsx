"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import type { useCheckout } from "@/components/cart/useCheckout"
import { useDeliveryCost } from "@/components/cart/useDeliveryCost"
import type { ShippingMethod } from "@/lib/checkout"
import { cn } from "@/lib/styles"

const FIELD =
  "bg-brand-surface text-brand-nav placeholder:text-brand-muted focus:border-brand-bronze w-full rounded-lg border px-4 py-3.5 text-[15px] outline-none transition-colors"

interface CityOption {
  readonly ref: string
  readonly cityRef: string
  readonly name: string
  readonly region: string
}

type Checkout = ReturnType<typeof useCheckout>

/**
 * Everything between the cart lines and the summary: how it ships, who gets it,
 * how they intend to pay. Payment itself is arranged off-site, and whether any
 * of it comes from «Дія» is settled by the manager on the call — asking the
 * buyer to declare a split here only invited numbers nobody could act on.
 */
export function CheckoutFields({
  checkout,
  afterDiscount,
}: {
  readonly checkout: Checkout
  readonly afterDiscount: number
}) {
  const t = useTranslations("shop.cart")
  const {
    shipping,
    setShipping,
    setDeliveryCost,
    payment,
    setPayment,
    form,
    setForm,
    formatPhone,
    errors,
    submitted,
  } = checkout

  const [cityOpen, setCityOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const [cityOptions, setCityOptions] = useState<CityOption[]>([])
  const [warehouses, setWarehouses] = useState<string[]>([])
  const [whTotal, setWhTotal] = useState(0)
  const [whPage, setWhPage] = useState(1)
  const [whLoading, setWhLoading] = useState(false)
  // The settlement Ref from Nova Poshta — warehouses are looked up by it, not by
  // the city's display name.
  const [cityRef, setCityRef] = useState("")
  // The DeliveryCity ref — the delivery-cost estimate keys on this, not the
  // warehouse/settlement ref.
  const [cityDeliveryRef, setCityDeliveryRef] = useState("")

  const border = (bad?: true) =>
    submitted && bad ? "border-brand-crimson" : "border-brand-field"

  const methods: { key: ShippingMethod; title: string; desc: string }[] = [
    { key: "pickup", title: t("shipPickup"), desc: t("shipPickupDesc") },
    { key: "branch", title: t("shipBranch"), desc: t("shipBranchDesc") },
    { key: "courier", title: t("shipCourier"), desc: t("shipCourierDesc") },
  ]

  // City autocomplete — debounced so a fast typist makes one request, not ten.
  // The lookup (and the clear) live inside the timeout so nothing sets state
  // synchronously during render.
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      void (async () => {
        const query = form.city.trim()
        if (form.cityPicked || query.length < 2) {
          if (!cancelled) setCityOptions([])

          return
        }
        try {
          const response = await fetch("/api/np/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          })
          const body = (await response.json()) as { items?: CityOption[] }
          if (!cancelled) setCityOptions(body.items ?? [])
        } catch {
          // Offline — the field still accepts free text; the order is text anyway.
        }
      })()
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [form.city, form.cityPicked])

  // First page of warehouses for the chosen city, re-queried (debounced) as the
  // user narrows the branch. Further pages arrive via infinite scroll below.
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      void (async () => {
        if (shipping !== "branch" || !cityRef) {
          if (!cancelled) {
            setWarehouses([])
            setWhTotal(0)
          }

          return
        }
        try {
          const response = await fetch("/api/np/warehouses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ref: cityRef,
              query: form.branch.trim(),
              page: 1,
            }),
          })
          const body = (await response.json()) as {
            items?: { name: string }[]
            total?: number
          }
          if (!cancelled) {
            setWarehouses((body.items ?? []).map((w) => w.name))
            setWhTotal(body.total ?? 0)
            setWhPage(1)
          }
        } catch {
          // Offline — leave the last list; the branch field still takes text.
        }
      })()
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [cityRef, form.branch, shipping])

  // Nova Poshta's cheapest price for the chosen city and method, pushed into
  // shared state for the summary. No arrival date is fetched — see the hook.
  useDeliveryCost({
    cityDeliveryRef,
    shipping,
    declaredValue: afterDiscount,
    setCost: setDeliveryCost,
  })

  // Pull the next page of warehouses and append — called as the dropdown nears
  // its bottom. A big city (thousands of branches) is browsable without ever
  // loading them all at once.
  const loadMoreWarehouses = async () => {
    if (whLoading || warehouses.length >= whTotal) {
      return
    }
    setWhLoading(true)
    try {
      const response = await fetch("/api/np/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref: cityRef,
          query: form.branch.trim(),
          page: whPage + 1,
        }),
      })
      const body = (await response.json()) as { items?: { name: string }[] }
      const more = (body.items ?? []).map((w) => w.name)
      // De-dupe defensively: a warehouse must never appear twice as a key.
      setWarehouses((prev) => [
        ...prev,
        ...more.filter((name) => !prev.includes(name)),
      ])
      setWhPage((p) => p + 1)
    } catch {
      // Offline — keep what we have.
    } finally {
      setWhLoading(false)
    }
  }

  return (
    <>
      <h2 className="font-oswald text-brand-cream mb-4.5 text-2xl font-semibold tracking-[0.02em] uppercase">
        {t("shipping")}
      </h2>
      <div className="mb-5.5 flex flex-col gap-3">
        {methods.map((method) => {
          const on = shipping === method.key
          // Pickup is free; delivery is a weight-dependent Nova Poshta quote, so
          // the card only labels it — the "від X ₴" figure lives in the summary.
          const isFree = method.key === "pickup"

          return (
            <button
              key={method.key}
              type="button"
              onClick={() => setShipping(method.key)}
              className={cn(
                "bg-brand-green flex cursor-pointer items-start gap-3.5 rounded-[10px] border-[1.5px] p-4 text-left transition-colors",
                on
                  ? "border-brand-bronze"
                  : "border-brand-border hover:border-brand-field-hover"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  on ? "border-brand-bronze" : "border-brand-check"
                )}
              >
                {on ? (
                  <span className="bg-brand-bronze block size-2.5 rounded-full" />
                ) : null}
              </span>
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2.5">
                  <span className="text-brand-cream text-[15.5px] font-semibold">
                    {method.title}
                  </span>
                  <span
                    className={cn(
                      "font-oswald text-sm whitespace-nowrap",
                      isFree ? "text-brand-moss" : "text-brand-gold"
                    )}
                  >
                    {t(isFree ? "free" : "costByWeight")}
                  </span>
                </span>
                <span className="text-brand-muted mt-0.5 block text-[13px]">
                  {method.desc}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <h2 className="font-oswald text-brand-cream mb-4.5 text-2xl font-semibold tracking-[0.02em] uppercase">
        {t("recipient")}
      </h2>
      <div className="mb-3.5 grid gap-3.5 min-[600px]:grid-cols-2">
        <input
          className={cn(FIELD, border(errors.name))}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={cn(FIELD, border(errors.phone))}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("phonePlaceholder")}
          value={form.phone}
          onFocus={() => {
            if (!form.phone) setForm({ ...form, phone: "+380 " })
          }}
          onChange={(e) =>
            setForm({ ...form, phone: formatPhone(e.target.value) })
          }
        />
      </div>
      <div className="mb-3.5 grid gap-3.5 min-[600px]:grid-cols-2">
        <input
          className={cn(FIELD, "border-brand-field")}
          placeholder={t("viberPlaceholder")}
          value={form.viber}
          onChange={(e) => setForm({ ...form, viber: e.target.value })}
        />
        <input
          className={cn(FIELD, "border-brand-field")}
          placeholder={t("telegramPlaceholder")}
          value={form.telegram}
          onChange={(e) => setForm({ ...form, telegram: e.target.value })}
        />
      </div>

      {shipping === "pickup" ? (
        <div className="border-brand-field bg-brand-surface mb-7 flex items-start gap-3 rounded-lg border px-4.5 py-4">
          <span aria-hidden className="mt-px text-lg">
            📍
          </span>
          <div className="text-brand-nav text-[14.5px] leading-relaxed">
            {t("pickupNote")}{" "}
            <b className="text-brand-cream">{t("pickupAddress")}</b>
            <br />
            {t("pickupHours")}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-3.5">
            <span
              aria-hidden
              className="text-brand-muted absolute top-1/2 left-4 -translate-y-1/2 text-[15px]"
            >
              🔍
            </span>
            <input
              className={cn(FIELD, border(errors.city), "pl-10.5")}
              placeholder={t("cityPlaceholder")}
              value={form.city}
              onChange={(e) => {
                setForm({
                  ...form,
                  city: e.target.value,
                  cityPicked: "",
                  branch: "",
                })
                setCityRef("")
                setCityDeliveryRef("")
                setCityOpen(true)
              }}
              onBlur={() => setTimeout(() => setCityOpen(false), 120)}
            />
            {cityOpen && !form.cityPicked && cityOptions.length ? (
              <div className="border-brand-field bg-brand-surface absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                {cityOptions.map((city) => (
                  <button
                    key={city.ref}
                    type="button"
                    onMouseDown={() => {
                      setForm({
                        ...form,
                        city: city.name,
                        cityPicked: city.name,
                        branch: "",
                      })
                      setCityRef(city.ref)
                      setCityDeliveryRef(city.cityRef)
                    }}
                    className="border-brand-border hover:bg-brand-green flex w-full items-center justify-between gap-2.5 border-b px-4 py-3 text-left text-[14.5px] transition-colors last:border-b-0"
                  >
                    <span className="text-brand-cream">{city.name}</span>
                    <span className="text-brand-muted text-[12.5px]">
                      {city.region}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {shipping === "branch" ? (
            <>
              <div className="relative mb-2.5">
                <span
                  aria-hidden
                  className="text-brand-muted absolute top-1/2 left-4 -translate-y-1/2 text-[15px]"
                >
                  📦
                </span>
                <input
                  className={cn(FIELD, border(errors.branch), "pl-10.5")}
                  placeholder={t("branchPlaceholder")}
                  // A branch without a city is meaningless — the list needs one first.
                  disabled={!form.cityPicked}
                  value={form.branch}
                  onChange={(e) => {
                    setForm({ ...form, branch: e.target.value })
                    setBranchOpen(true)
                  }}
                  onFocus={() => setBranchOpen(true)}
                  onBlur={() => setTimeout(() => setBranchOpen(false), 120)}
                />
                {branchOpen && form.cityPicked ? (
                  <div
                    // Near the bottom, pull the next page — infinite scroll over
                    // however many branches the city has.
                    onScroll={(e) => {
                      const el = e.currentTarget
                      if (
                        el.scrollTop + el.clientHeight >=
                        el.scrollHeight - 48
                      ) {
                        void loadMoreWarehouses()
                      }
                    }}
                    className="border-brand-field bg-brand-surface absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-70 overflow-y-auto rounded-lg border shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                  >
                    {warehouses.length ? (
                      warehouses.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onMouseDown={() => setForm({ ...form, branch: w })}
                          className="border-brand-border text-brand-nav hover:bg-brand-green block w-full border-b px-4 py-3 text-left text-[14.5px] transition-colors last:border-b-0"
                        >
                          {w}
                        </button>
                      ))
                    ) : (
                      <p className="text-brand-muted px-4 py-3 text-[13.5px]">
                        {t("branchEmptyHint")}
                      </p>
                    )}
                    {whLoading ? (
                      <p className="text-brand-muted px-4 py-2.5 text-center text-[12.5px]">
                        {t("branchLoading")}
                      </p>
                    ) : warehouses.length && warehouses.length < whTotal ? (
                      <p className="border-brand-border text-brand-muted bg-brand-surface sticky bottom-0 border-t px-4 py-2 text-center text-[12px]">
                        {t("branchShownOf", {
                          shown: warehouses.length,
                          total: whTotal,
                        })}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p className="text-brand-muted mb-7 flex items-center gap-1.5 text-[12.5px]">
                <span aria-hidden className="text-brand-crimson text-[15px]">
                  ●
                </span>
                {t("branchHint")}
              </p>
            </>
          ) : (
            <>
              <input
                className={cn(FIELD, border(errors.street), "mb-3.5")}
                placeholder={t("streetPlaceholder")}
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <input
                className={cn(FIELD, "border-brand-field mb-7")}
                placeholder={t("commentPlaceholder")}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </>
          )}
        </>
      )}

      <h2 className="font-oswald text-brand-cream mb-4.5 text-2xl font-semibold tracking-[0.02em] uppercase">
        {t("payment")}
      </h2>
      <div className="flex flex-col gap-3">
        {(["card", "cash"] as const).map((method) => (
          <div key={method}>
            <button
              type="button"
              onClick={() => setPayment(method)}
              className={cn(
                "bg-brand-green flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] border-[1.5px] p-4 text-left transition-colors",
                payment === method
                  ? "border-brand-bronze"
                  : "border-brand-border hover:border-brand-field-hover"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  payment === method
                    ? "border-brand-bronze"
                    : "border-brand-check"
                )}
              >
                {payment === method ? (
                  <span className="bg-brand-bronze block size-2.5 rounded-full" />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[15.5px]",
                  payment === method ? "text-brand-cream" : "text-brand-nav"
                )}
              >
                {t(method === "card" ? "paymentCard" : "paymentCod")}
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
export default CheckoutFields
