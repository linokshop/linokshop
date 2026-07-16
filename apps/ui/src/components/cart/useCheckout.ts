"use client"

import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

import { type CartItem, lineId, useCart } from "@/lib/cart"
import {
  type PaymentMethod,
  type ShippingMethod,
  maxQuantityFor,
  orderTotals,
} from "@/lib/checkout"
import { readError } from "@/lib/http"

/** What Strapi says about a product right now, keyed by slug. */
interface FreshInfo {
  readonly price: number | null
  readonly category: string | null
  readonly inStock: boolean
  readonly stockQty: number | null
  readonly imageUrl: string | null
}

export interface CheckoutLine extends CartItem {
  readonly category: string | null
  readonly inStock: boolean
  readonly stockQty: number | null
  readonly maxQty: number
}

export type CheckoutStatus = "idle" | "sending" | "sent" | "error"
export type ErrorKey = "name" | "phone" | "city" | "branch" | "street" | "vet"

/**
 * Turns a browser-side cart into an order.
 *
 * The cart in localStorage may be weeks old, so price and stock are re-read from
 * the server on mount and those values — not the stored ones — drive the screen.
 * The money shown here is still only a preview: `/api/lead` recomputes every
 * number when the order is placed.
 */
export function useCheckout() {
  const { items, setQuantity, remove, add, clear } = useCart()
  const locale = useLocale()

  const [fresh, setFresh] = useState<Record<string, FreshInfo>>({})
  const [shipping, setShipping] = useState<ShippingMethod>("branch")
  const [payment, setPayment] = useState<PaymentMethod>("card")
  const [useVet, setUseVet] = useState(false)
  const [vetAmount, setVetAmount] = useState("")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    cityPicked: "",
    branch: "",
    street: "",
    comment: "",
  })
  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState<{ code: string; percent: number }>()
  const [promoChecked, setPromoChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<CheckoutStatus>("idle")
  const [orderNo, setOrderNo] = useState<string>()
  const [error, setError] = useState<string>()

  // Re-read price/stock for whatever is in the cart. Keyed by the slug list so a
  // added/removed line refetches, but editing quantities does not.
  const slugKey = items
    .map((item) => item.slug)
    .sort((a, b) => a.localeCompare(b))
    .join(",")
  useEffect(() => {
    // An empty cart needs no lookup; leftover entries are harmless because the
    // lines below are built from `items`, not from this map.
    if (!slugKey) {
      return
    }

    let cancelled = false
    void (async () => {
      try {
        const response = await fetch("/api/cart-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs: slugKey.split(","), locale }),
        })
        if (!response.ok) return
        const body = (await response.json()) as {
          items: (FreshInfo & { slug: string })[]
        }
        // The cart may have changed while this was in flight.
        if (!cancelled) {
          setFresh(
            Object.fromEntries(body.items.map((item) => [item.slug, item]))
          )
        }
      } catch {
        // A failed lookup just leaves the stored values on screen; the order is
        // priced server-side regardless, so this is never a correctness issue.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [slugKey, locale])

  const lines: CheckoutLine[] = items.map((item) => {
    const info = fresh[item.slug]
    const stockQty = info?.stockQty ?? null

    return {
      ...item,
      price: info?.price ?? item.price,
      imageUrl: info?.imageUrl ?? item.imageUrl,
      category: info?.category ?? null,
      inStock: info?.inStock ?? true,
      stockQty,
      maxQty: maxQuantityFor(stockQty),
    }
  })

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const count = lines.reduce((sum, l) => sum + l.quantity, 0)
  const totals = orderTotals(subtotal, promo?.percent ?? 0, shipping)

  const vetRaw = Number(vetAmount.replaceAll(/\D/g, "")) || 0
  const vetPay = useVet ? Math.min(vetRaw, totals.total) : 0
  const remainder = useVet ? Math.max(0, totals.total - vetPay) : 0

  const errors: Partial<Record<ErrorKey, true>> = {}
  if (!form.name.trim()) errors.name = true
  if (form.phone.replaceAll(/\D/g, "").length < 12) errors.phone = true
  if (shipping === "branch") {
    if (!form.cityPicked) errors.city = true
    if (!form.branch.trim()) errors.branch = true
  } else if (shipping === "courier") {
    if (!form.cityPicked) errors.city = true
    if (!form.street.trim()) errors.street = true
  }
  if (useVet && vetRaw <= 0) errors.vet = true

  const errorKeys = Object.keys(errors) as ErrorKey[]

  /** Digits in, `+380 XX XXX XX XX` out — the country code is not the user's job. */
  const formatPhone = (raw: string): string => {
    let d = raw.replaceAll(/\D/g, "")
    if (d.startsWith("380")) d = d.slice(3)
    else if (d.startsWith("80")) d = d.slice(2)
    if (d.startsWith("0")) d = d.slice(1)
    d = d.slice(0, 9)
    if (!d) return ""
    let out = "+380"
    if (d.length > 0) out += ` ${d.slice(0, 2)}`
    if (d.length > 2) out += ` ${d.slice(2, 5)}`
    if (d.length > 5) out += ` ${d.slice(5, 7)}`
    if (d.length > 7) out += ` ${d.slice(7, 9)}`

    return out
  }

  async function checkPromo() {
    const code = promoInput.trim()
    if (!code) return
    setPromoChecked(true)
    try {
      const response = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const body = (await response.json()) as {
        valid: boolean
        code?: string
        percent?: number
      }
      setPromo(
        body.valid && body.percent
          ? { code: body.code ?? code, percent: body.percent }
          : undefined
      )
    } catch {
      setPromo(undefined)
    }
  }

  async function submit(failMessage: string) {
    if (errorKeys.length) {
      setSubmitted(true)

      return
    }
    if (status === "sending" || !lines.length) return

    setStatus("sending")
    setError(undefined)
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "order",
          name: form.name,
          phone: form.phone,
          shipping,
          city: form.cityPicked || undefined,
          branch: shipping === "branch" ? form.branch : undefined,
          street: shipping === "courier" ? form.street : undefined,
          comment: form.comment || undefined,
          payment,
          vetAmount: useVet ? vetRaw : undefined,
          promo: promo?.code,
          // Only what and how many — every price is decided server-side.
          items: lines.map((l) => ({
            slug: l.slug,
            option: l.option,
            quantity: l.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const body = await readError(response)
        throw new Error(body.error ?? failMessage)
      }

      const body = (await response.json()) as { orderNo?: string }
      setOrderNo(body.orderNo)
      clear()
      setStatus("sent")
    } catch (caught) {
      setStatus("error")
      setError(caught instanceof Error ? caught.message : failMessage)
    }
  }

  return {
    lines,
    lineId,
    count,
    subtotal,
    totals,
    setQuantity,
    remove,
    add,
    shipping,
    setShipping,
    payment,
    setPayment,
    useVet,
    toggleVet: () => setUseVet((on) => !on),
    vetAmount,
    setVetAmount: (raw: string) => setVetAmount(raw.replaceAll(/\D/g, "")),
    vetPay,
    remainder,
    showSplit: useVet && vetRaw > 0 && remainder > 0,
    vetCoversAll: useVet && vetRaw > 0 && remainder === 0,
    form,
    setForm,
    formatPhone,
    promoInput,
    setPromoInput,
    promo,
    promoChecked,
    checkPromo,
    errors,
    errorKeys,
    submitted,
    status,
    orderNo,
    error,
    submit,
  }
}
