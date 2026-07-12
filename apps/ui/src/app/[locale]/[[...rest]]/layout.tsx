import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

export default function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/[[...rest]]">) {
  const { locale } = use(params) as { locale: Locale }

  setRequestLocale(locale)

  // Full-bleed sections own their spacing, so no padding here. `flex-1` +
  // `flex-col` let the page fill the viewport — otherwise a short page leaves
  // a gap above the footer.
  return <div className="flex flex-1 flex-col">{children}</div>
}
