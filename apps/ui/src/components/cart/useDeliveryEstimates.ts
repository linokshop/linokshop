"use client"

import { useEffect } from "react"

import type { ShippingMethod } from "@/lib/checkout"

type ServiceType = "WarehouseWarehouse" | "WarehouseDoors"

/**
 * Asks Nova Poshta for the delivery date and the cheapest ("від") price for the
 * chosen city + method, and pushes both into checkout state.
 *
 * One effect for the pair: they share a trigger, so they fetch together and are
 * cancelled together, and the checkout component stays free of two near-identical
 * fetch blocks. Pickup has neither a date nor a cost, so both clear.
 */
export function useDeliveryEstimates({
  cityDeliveryRef,
  shipping,
  declaredValue,
  locale,
  setDate,
  setCost,
}: {
  readonly cityDeliveryRef: string
  readonly shipping: ShippingMethod
  readonly declaredValue: number
  readonly locale: string
  readonly setDate: (value: string | undefined) => void
  readonly setCost: (value: number | undefined) => void
}) {
  useEffect(() => {
    if (shipping === "pickup" || !cityDeliveryRef) {
      setDate(undefined)
      setCost(undefined)

      return
    }

    let cancelled = false
    const serviceType: ServiceType =
      shipping === "courier" ? "WarehouseDoors" : "WarehouseWarehouse"

    void (async () => {
      const [date, cost] = await Promise.all([
        fetchDate(cityDeliveryRef, serviceType, locale),
        fetchCost(cityDeliveryRef, serviceType, declaredValue),
      ])
      if (!cancelled) {
        setDate(date)
        setCost(cost)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [cityDeliveryRef, shipping, declaredValue, locale, setDate, setCost])
}

/** NP's arrival estimate, already formatted in the reader's language. */
async function fetchDate(
  cityRef: string,
  serviceType: ServiceType,
  locale: string
): Promise<string | undefined> {
  try {
    const response = await fetch("/api/np/delivery-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityRef, serviceType }),
    })
    const body = (await response.json()) as { date?: string | null }
    if (!body.date) {
      return undefined
    }
    const formatter = new Intl.DateTimeFormat(
      locale === "ru" ? "ru-UA" : "uk-UA",
      { day: "numeric", month: "long" }
    )

    return formatter.format(new Date(body.date))
  } catch {
    return undefined
  }
}

/** NP's cheapest price to the city, in UAH. */
async function fetchCost(
  cityRef: string,
  serviceType: ServiceType,
  declaredValue: number
): Promise<number | undefined> {
  try {
    const response = await fetch("/api/np/delivery-cost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityRef, serviceType, declaredValue }),
    })
    const body = (await response.json()) as { cost?: number | null }

    return typeof body.cost === "number" ? body.cost : undefined
  } catch {
    return undefined
  }
}
