"use client"

import { useEffect } from "react"

import type { ShippingMethod } from "@/lib/checkout"

type ServiceType = "WarehouseWarehouse" | "WarehouseDoors"

/**
 * Asks Nova Poshta what the cheapest delivery to the chosen city would cost and
 * pushes it into checkout state.
 *
 * Only the price is fetched — no arrival estimate. Real delivery times vary far
 * too much to put a date in front of a buyer, and a missed promise costs more
 * than the reassurance it buys. Pickup has no carrier cost, so it clears.
 */
export function useDeliveryCost({
  cityDeliveryRef,
  shipping,
  declaredValue,
  setCost,
}: {
  readonly cityDeliveryRef: string
  readonly shipping: ShippingMethod
  readonly declaredValue: number
  readonly setCost: (value: number | undefined) => void
}) {
  useEffect(() => {
    if (shipping === "pickup" || !cityDeliveryRef) {
      setCost(undefined)

      return
    }

    let cancelled = false
    const serviceType: ServiceType =
      shipping === "courier" ? "WarehouseDoors" : "WarehouseWarehouse"

    void (async () => {
      const cost = await fetchCost(cityDeliveryRef, serviceType, declaredValue)
      if (!cancelled) {
        setCost(cost)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [cityDeliveryRef, shipping, declaredValue, setCost])
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
