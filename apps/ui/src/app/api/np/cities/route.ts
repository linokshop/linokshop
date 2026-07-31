import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { searchCities } from "@/lib/nova-poshta"

/**
 * City autocomplete for checkout, proxied so the Nova Poshta token stays server
 * side. Short queries return nothing rather than flooding the directory.
 */
const schema = z.object({ query: z.string().trim().min(2).max(60) })

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ items: [] })
  }

  try {
    return NextResponse.json({ items: await searchCities(parsed.data.query) })
  } catch {
    // A directory hiccup must not break checkout — the field still takes free text.
    return NextResponse.json({ items: [] })
  }
}
