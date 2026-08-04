import type { Locale } from "next-intl"

import { redirect } from "@/lib/navigation"

/**
 * `/category` on its own names no category.
 *
 * Trimming the last segment off a URL is a normal way to look for "one level up",
 * and answering a 404 punishes it. The full catalogue is what that reader wanted,
 * so send them there instead.
 */
export default async function CategoryIndexPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  redirect({ href: "/catalog", locale: locale as Locale })
}
