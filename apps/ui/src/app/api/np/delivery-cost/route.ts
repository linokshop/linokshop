import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { estimateDeliveryCost } from "@/lib/nova-poshta"

/**
 * Nova Poshta's cheapest ("від") delivery price to the chosen city, proxied so
 * the token stays server-side. `cityRef` is the settlement's DeliveryCity ref;
 * `declaredValue` is the order subtotal (drives the insurance surcharge).
 */
const schema = z.object({
  cityRef: z.string().trim().min(1).max(64),
  serviceType: z.enum(["WarehouseWarehouse", "WarehouseDoors"]),
  declaredValue: z.number().min(0).max(1_000_000).default(0),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ cost: null }, { status: 200 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ cost: null })
  }

  try {
    const cost = await estimateDeliveryCost(
      parsed.data.cityRef,
      parsed.data.serviceType,
      parsed.data.declaredValue
    )

    return NextResponse.json({ cost })
  } catch {
    return NextResponse.json({ cost: null })
  }
}
