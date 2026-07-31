import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { searchWarehouses } from "@/lib/nova-poshta"

/**
 * One page of warehouses for a chosen settlement, filtered by what the user
 * typed. `ref` is the settlement Ref from the city lookup; `page` drives the
 * checkout's infinite scroll and `total` tells it when to stop.
 */
const schema = z.object({
  ref: z.string().trim().min(1).max(64),
  query: z.string().trim().max(60).default(""),
  page: z.number().int().min(1).max(200).default(1),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ items: [], total: 0 }, { status: 200 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ items: [], total: 0 })
  }

  try {
    const { items, total } = await searchWarehouses(
      parsed.data.ref,
      parsed.data.query,
      parsed.data.page
    )

    return NextResponse.json({ items, total })
  } catch {
    return NextResponse.json({ items: [], total: 0 })
  }
}
