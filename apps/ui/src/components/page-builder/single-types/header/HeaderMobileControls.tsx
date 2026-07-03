"use client"

import type { Data } from "@repo/strapi-types"
import { Menu, X } from "lucide-react"
import type { Locale } from "next-intl"

import { MobileNavigation } from "@/components/page-builder/single-types/header/MobileNavigation"
import { Button } from "@/components/ui/button"
import { useHeaderMobile } from "@/hooks/useHeaderMobile"
import { cn } from "@/lib/styles"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"

export { HeaderMobileProvider } from "@/hooks/useHeaderMobile"

export function HeaderMobileToggle() {
  const [mobileOpen, setMobileOpen] = useHeaderMobile()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden", mobileOpen && "hamburger-menu")}
      aria-label="Toggle menu"
      onClick={() => setMobileOpen((open) => !open)}
    >
      {mobileOpen ? <X /> : <Menu />}
    </Button>
  )
}

export function HeaderMobileNavigation({
  navbarItems,
  primaryButtons,
  session,
  locale,
}: {
  readonly primaryButtons?: Data.ContentType<"api::header.header">["primaryButtons"]
  readonly navbarItems?: Data.ContentType<"api::header.header">["navbarItems"]
  readonly session?: BetterAuthSessionWithStrapi | null
  readonly locale: Locale
}) {
  const [mobileOpen, setMobileOpen] = useHeaderMobile()

  return (
    <MobileNavigation
      navbarItems={navbarItems}
      primaryButtons={primaryButtons}
      isOpen={mobileOpen}
      setOpen={setMobileOpen}
      session={session}
      locale={locale}
    />
  )
}
