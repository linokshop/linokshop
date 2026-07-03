import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { Container } from "@/components/elementary/Container"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { HeaderAuthSection } from "@/components/page-builder/single-types/header/HeaderAuthSection"
import {
  HeaderMobileNavigation,
  HeaderMobileProvider,
  HeaderMobileToggle,
} from "@/components/page-builder/single-types/header/HeaderMobileControls"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"

import { DesktopNavigation } from "./DesktopNavigation"

export function HeaderInner({
  locale,
  headerData,
  session,
}: {
  readonly locale: Locale
  readonly headerData?: Data.ContentType<"api::header.header">
  readonly session?: BetterAuthSessionWithStrapi | null
}) {
  return (
    <HeaderMobileProvider>
      <header className="bg-background/60 sticky top-0 z-50 h-16 w-full border-b shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center">
          <Container className="flex h-full items-center justify-between px-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-2">
              {/* Logo */}
              {headerData?.logoImage?.image && headerData.logoImage.link ? (
                <StrapiImageWithLink component={headerData.logoImage} />
              ) : null}
              {headerData?.logoImage?.image && !headerData.logoImage.link ? (
                <StrapiBasicImage
                  component={headerData.logoImage.image}
                  width={80}
                  height={30}
                  className="h-7.5 w-20 shrink-0 object-contain"
                />
              ) : null}
              {/* Desktop Navigation */}
              <DesktopNavigation navbarItems={headerData?.navbarItems} />
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden h-full items-center gap-2 pl-4 lg:flex">
              <HeaderAuthSection sessionSSR={session} />
              <LocaleSwitcher locale={locale} />
              <div className="flex h-8 w-px flex-1 bg-black/70" />
              {headerData?.primaryButtons?.map((button) => (
                <StrapiLink key={button.id} component={button} />
              ))}
            </div>
            <HeaderMobileToggle />
          </Container>
        </div>
      </header>
      <HeaderMobileNavigation
        navbarItems={headerData?.navbarItems}
        primaryButtons={headerData?.primaryButtons}
        session={session}
        locale={locale}
      />
    </HeaderMobileProvider>
  )
}
HeaderInner.displayName = "HeaderInner"

export default HeaderInner
