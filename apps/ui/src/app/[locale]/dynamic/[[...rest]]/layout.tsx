import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

export default function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/dynamic/[[...rest]]">) {
  const { locale } = use(params) as { locale: Locale }

  setRequestLocale(locale)

  // Full-bleed sections own their spacing — see the sibling `[[...rest]]` layout.
  return <div className="flex flex-1 flex-col">{children}</div>
}
