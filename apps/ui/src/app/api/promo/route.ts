import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { fetchPromoByCode } from "@/lib/strapi-api/content/server"

/**
 * Checks a promo code so the cart can show the discount before checkout.
 *
 * This answer is for display only. `/api/lead` looks the code up again when the
 * order is placed, so a browser that fakes a 200 here still gets charged full
 * price — the discount is only ever decided server-side.
 */
const schema = z.object({ code: z.string().trim().min(1).max(40) })

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ valid: false }, { status: 200 })
  }

  const promo = await fetchPromoByCode(parsed.data.code)
  if (!promo) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({
    valid: true,
    code: promo.code,
    percent: promo.percent,
  })
}
