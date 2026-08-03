import "server-only"

import type { Data } from "@repo/strapi-types"
import { unstable_cache } from "next/cache"

/**
 * Live price and stock from the Vchasno kasa — the source of truth for money and
 * availability. Strapi holds only the "shop window" (photos, description, the
 * `isReadyToTrade` flag); everything numeric comes from here.
 *
 * The kasa can't be queried by article — it only returns the full paginated dump
 * — so pulling one product's price live is impossible. Instead the whole list is
 * fetched and cached for an hour, then every catalog/product render merges
 * against that snapshot by `code`. One refresh serves every visitor: traffic
 * never touches the kasa directly.
 */

const KASA_URL = "https://kasa.vchasno.ua/api/groups/products"
const PAGE_SIZE = 100
/** How long a kasa snapshot is served before the next refresh (seconds). */
const REVALIDATE_SECONDS = 60 * 60

/** One product's live figures, already in display units. */
export interface KasaLive {
  /** UAH (kasa stores копійки). */
  readonly price: number
  /** Units in stock (kasa stores ×1000). */
  readonly stock: number
}

/** What a product page needs after merging kasa onto a Strapi entry. */
export interface KasaMerge {
  readonly price: number | null
  readonly stockQty: number | null
  readonly inStock: boolean
  /** False when the code has no kasa match — the product can't be priced or sold. */
  readonly available: boolean
}

async function fetchAllKasa(): Promise<Record<string, KasaLive>> {
  const token = process.env.X_KASA_COMPANY_GROUP_ACCESS_TOKEN
  const edrpou = process.env.KASA_EDRPOU
  if (!token || !edrpou) {
    throw new Error("X_KASA_COMPANY_GROUP_ACCESS_TOKEN / KASA_EDRPOU not set")
  }

  const map: Record<string, KasaLive> = {}
  for (let page = 1; page <= 40; page++) {
    const url = `${KASA_URL}?edrpou=${edrpou}&page=${page}&limit=${PAGE_SIZE}`
    const response = await fetch(url, {
      headers: { "X-KASA-Company-Group-Access-Token": token },
      cache: "no-store",
    })
    if (!response.ok) {
      // Return whatever pages already arrived rather than emptying the shop on a
      // transient hiccup. A hard failure on page 1 yields an empty map — the
      // caller then shows nothing, which is correct: we can't price anything.
      break
    }
    const body = (await response.json()) as {
      items?: {
        code?: string
        price?: number
        amount?: number
      }[]
      has_next?: boolean
    }
    for (const item of body.items ?? []) {
      const code = String(item.code ?? "").trim()
      if (code) {
        map[code] = {
          price: Math.round(Number(item.price)) / 100,
          stock: Math.max(0, Math.floor(Number(item.amount) / 1000)),
        }
      }
    }
    if (!body.has_next) break
    // Space the pages so a full refresh doesn't trip the kasa's rate limit.
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  return map
}

/**
 * The cached kasa snapshot: `code → { price, stock }`. Refreshed at most once per
 * {@link REVALIDATE_SECONDS}; every render in that window reads the same copy.
 */
export const getKasaMap = unstable_cache(fetchAllKasa, ["kasa-products"], {
  revalidate: REVALIDATE_SECONDS,
})

/** Overlay live kasa figures onto a product, keyed by its `kasaCode`. */
export function mergeKasa(
  kasaCode: string | null | undefined,
  map: Record<string, KasaLive>
): KasaMerge {
  const live = kasaCode ? map[kasaCode] : undefined
  if (!live) {
    return { price: null, stockQty: null, inStock: false, available: false }
  }

  return {
    price: live.price,
    stockQty: live.stock,
    inStock: live.stock > 0,
    available: true,
  }
}

type ProductEntity = Data.ContentType<"api::product.product">

/**
 * A Strapi product with its money and stock filled in from the kasa. Price,
 * stockQty and inStock never come from Strapi — they are always overlaid here,
 * so the rest of the app can keep reading `product.price` unchanged.
 */
export type EnrichedProduct = ProductEntity & {
  price: number
  stockQty: number
  inStock: boolean
}

/**
 * Fills a product's price/stock from the kasa snapshot. Returns null when the
 * product has no kasa match — it can't be priced, so it must not be shown.
 */
export function enrichProduct(
  product: ProductEntity,
  map: Record<string, KasaLive>
): EnrichedProduct | null {
  const live = mergeKasa(product.kasaCode, map)
  if (!live.available || live.price == null) {
    return null
  }

  return {
    ...product,
    price: live.price,
    stockQty: live.stockQty ?? 0,
    inStock: live.inStock,
  }
}

/** Enrich a list, dropping products with no kasa match. */
export function enrichProducts(
  products: readonly ProductEntity[],
  map: Record<string, KasaLive>
): EnrichedProduct[] {
  return products
    .map((product) => enrichProduct(product, map))
    .filter((product): product is EnrichedProduct => product !== null)
}
