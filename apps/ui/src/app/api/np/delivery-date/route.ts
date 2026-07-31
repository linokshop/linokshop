import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { estimateDeliveryDate } from "@/lib/nova-poshta"

/**
 * Nova Poshta's delivery-date estimate for the chosen city, proxied so the token
 * stays server-side. `cityRef` is the settlement's DeliveryCity ref from the
 * city lookup; `serviceType` maps to the shipping method (branch vs courier).
 */
const schema = z.object({
  cityRef: z.string().trim().min(1).max(64),
  serviceType: z.enum(["WarehouseWarehouse", "WarehouseDoors"]),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ date: null }, { status: 200 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ date: null })
  }

  try {
    const date = await estimateDeliveryDate(
      parsed.data.cityRef,
      parsed.data.serviceType
    )

    return NextResponse.json({ date })
  } catch {
    // NP unavailable — the caller falls back to a rough guess.
    return NextResponse.json({ date: null })
  }
}
