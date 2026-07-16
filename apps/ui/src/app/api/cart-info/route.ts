import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { fetchProductsBySlugs } from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

/**
 * Fresh facts for the products a cart holds.
 *
 * The cart is localStorage: it knows slugs and quantities, and its copy of the
 * price/stock may be weeks stale. The cart page asks here on mount so what the
 * customer sees — price, stock, availability — is what Strapi says right now.
 * `/api/lead` re-reads the same data when the order is placed; this route is for
 * display only and is never the basis for what we charge.
 */
const schema = z.object({
  slugs: z.array(z.string().trim().min(1).max(200)).min(1).max(50),
  locale: z.enum(["uk", "ru"]).default("uk"),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const products = await fetchProductsBySlugs(
    parsed.data.slugs,
    parsed.data.locale
  )

  return NextResponse.json({
    items: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category?.name ?? null,
      inStock: product.inStock ?? true,
      stockQty: product.stockQty ?? null,
      imageUrl: formatStrapiMediaUrl(product.images?.[0]?.url) ?? null,
    })),
  })
}
