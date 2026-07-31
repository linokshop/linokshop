import "server-only"

import { CHEAPEST_QUOTE_WEIGHT_KG } from "@/lib/checkout"

/**
 * Thin server-side client for the Nova Poshta directory.
 *
 * Kept on the server so `NOVA_POSHTA_TOKEN` never reaches the browser — the
 * checkout hits our own `/api/np/*` routes, which call through here. Only the
 * two lookups the checkout needs are exposed: settlements (city autocomplete)
 * and their warehouses (branch/parcel-locker picker).
 */

const NP_URL = "https://api.novaposhta.ua/v2.0/json/"

/** Warehouses come 50 at a time; a big city has thousands, so the picker pages. */
export const WAREHOUSE_PAGE_SIZE = 50

/**
 * The shop ships from Житомир. Delivery-date estimates are city-to-city, so this
 * is the fixed sender. (It's the settlement's `DeliveryCity` ref, not the
 * warehouse ref.) Change this if the shop ever ships from elsewhere.
 */
const SHOP_SENDER_CITY_REF = "db5c88c4-391c-11dd-90d9-001a92567626"

export type NpServiceType = "WarehouseWarehouse" | "WarehouseDoors"

export interface NpCity {
  readonly ref: string
  /** The `DeliveryCity` ref — what delivery-date estimates key on. */
  readonly cityRef: string
  readonly name: string
  readonly region: string
}

export interface NpWarehouse {
  readonly name: string
}

export interface NpWarehousePage {
  readonly items: NpWarehouse[]
  /** Total warehouses matching the query — lets the client know when to stop. */
  readonly total: number
}

interface NpResponse {
  success: boolean
  data?: unknown[]
  info?: { totalCount?: number }
  errors?: string[]
}

async function npCall(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, string>
): Promise<NpResponse> {
  const apiKey = process.env.NOVA_POSHTA_TOKEN
  if (!apiKey) {
    throw new Error("NOVA_POSHTA_TOKEN is not set")
  }

  const response = await fetch(NP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
    cache: "no-store",
  })
  const body = (await response.json()) as NpResponse
  if (!body.success) {
    throw new Error(
      `Nova Poshta: ${(body.errors ?? []).join("; ") || "request failed"}`
    )
  }

  return body
}

/** Settlements matching what the user is typing — the city autocomplete. */
export async function searchCities(query: string): Promise<NpCity[]> {
  const body = await npCall("Address", "searchSettlements", {
    CityName: query,
    Limit: "8",
  })
  const first = (body.data?.[0] ?? {}) as { Addresses?: unknown[] }
  const addresses = (first.Addresses ?? []) as {
    Ref: string
    DeliveryCity: string
    MainDescription: string
    Area: string
  }[]

  return addresses.map((a) => ({
    ref: a.Ref,
    cityRef: a.DeliveryCity,
    name: a.MainDescription,
    region: a.Area ? `${a.Area} обл.` : "",
  }))
}

/**
 * Nova Poshta's own estimate of when a parcel sent today would arrive, from the
 * shop's city to the customer's. Returns an ISO date (`2026-08-01`) or null if
 * NP can't answer — the caller then falls back to a rough guess.
 */
export async function estimateDeliveryDate(
  recipientCityRef: string,
  serviceType: NpServiceType
): Promise<string | null> {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const body = await npCall("InternetDocument", "getDocumentDeliveryDate", {
    DateTime: `${day}.${month}.${now.getFullYear()}`,
    ServiceType: serviceType,
    CitySender: SHOP_SENDER_CITY_REF,
    CityRecipient: recipientCityRef,
  })
  const raw = (body.data?.[0] as { DeliveryDate?: { date?: string } })
    ?.DeliveryDate?.date

  // "2026-08-01 09:00:00.000000" → "2026-08-01".
  return raw ? raw.slice(0, 10) : null
}

/**
 * The cheapest ("від") delivery price Nova Poshta would charge to this city — a
 * light-parcel quote at the order's declared value. Actual cost rises with real
 * weight, hence the "від … (залежить від ваги)" wording in the UI. Returns the
 * price in UAH, or null if NP can't answer.
 */
export async function estimateDeliveryCost(
  recipientCityRef: string,
  serviceType: NpServiceType,
  declaredValue: number
): Promise<number | null> {
  // Declared value drives the small insurance surcharge; the real order value
  // keeps the quote honest rather than artificially low.
  const cost = Math.max(1, Math.round(declaredValue))
  const body = await npCall("InternetDocument", "getDocumentPrice", {
    CitySender: SHOP_SENDER_CITY_REF,
    CityRecipient: recipientCityRef,
    ServiceType: serviceType,
    Weight: String(CHEAPEST_QUOTE_WEIGHT_KG),
    Cost: String(cost),
    CargoType: "Parcel",
    SeatsAmount: "1",
  })
  const quoted = (body.data?.[0] as { Cost?: number })?.Cost

  return typeof quoted === "number" ? quoted : null
}

/**
 * One page of warehouses in a settlement, narrowed by what the user typed. The
 * search string is handed to Nova Poshta (FindByString) rather than pulling
 * everything, and `total` drives infinite scroll on the client.
 */
export async function searchWarehouses(
  settlementRef: string,
  query: string,
  page: number
): Promise<NpWarehousePage> {
  const body = await npCall("AddressGeneral", "getWarehouses", {
    SettlementRef: settlementRef,
    FindByString: query,
    Limit: String(WAREHOUSE_PAGE_SIZE),
    Page: String(Math.max(1, page)),
  })
  const data = (body.data ?? []) as { Description: string }[]

  return {
    items: data.map((w) => ({ name: w.Description })),
    total: body.info?.totalCount ?? data.length,
  }
}
