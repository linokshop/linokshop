import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { PromoRibbon } from "@/components/page-builder/components/elements/PromoRibbon"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
// Language switcher temporarily disabled — restore once we decide on English.
// import HeaderLocaleToggle from "@/components/page-builder/single-types/header/HeaderLocaleToggle"
import HeaderCartButton from "@/components/page-builder/single-types/header/HeaderCartButton"
import HeaderMobileMenu from "@/components/page-builder/single-types/header/HeaderMobileMenu"
import HeaderNavLink from "@/components/page-builder/single-types/header/HeaderNavLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

export function HeaderInner({
  locale,
  headerData,
}: {
  readonly locale: Locale
  readonly headerData?: Data.ContentType<"api::header.header">
}) {
  const {
    logoTitle,
    logoSubtitle,
    logoImage,
    topStripText,
    topStripLink,
    navbarItems,
    veteranLink,
    primaryButtons,
  } = headerData ?? {}

  return (
    <>
      {/* Tier 1 — «Ветеранський спорт» program strip (scrolls away) */}
      <PromoRibbon
        component={topStripLink}
        leadText={topStripText}
        variant="header"
      />

      {/* Tier 2 — main bar (sticky) */}
      <header className="font-golos bg-brand-green border-brand-border sticky top-0 z-50 border-b shadow-[0_16px_40px_-4px_rgba(0,0,0,0.8)]">
        <div
          className={cn(
            SECTION_X_PADDING,
            "flex items-center justify-between py-3 min-[900px]:py-4"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.25">
            {logoImage?.image ? (
              <StrapiBasicImage
                component={logoImage.image}
                width={50}
                height={50}
                className="size-12.5 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="bg-brand-orange size-12.5 shrink-0 rounded-full" />
            )}
            <span className="flex flex-col leading-none">
              <span className="font-oswald text-brand-cream text-[21px] font-semibold tracking-[0.02em] min-[600px]:text-[25px]">
                {logoTitle}
              </span>
              {logoSubtitle ? (
                <span className="font-oswald text-brand-muted mt-1 hidden text-[10.5px] tracking-[0.16em] uppercase min-[600px]:block">
                  {logoSubtitle}
                </span>
              ) : null}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 min-[1200px]:flex">
            {navbarItems?.map((item) =>
              item.link ? (
                <HeaderNavLink key={item.id} component={item.link} />
              ) : null
            )}
            {veteranLink ? (
              <StrapiLink
                component={veteranLink}
                unstyled
                className="font-oswald text-brand-orange hover:text-brand-bronze inline-flex items-center py-1 text-sm font-medium tracking-wider uppercase transition-colors"
              />
            ) : null}
          </nav>

          {/* Right side — language, cart, burger */}
          <div className="flex items-center gap-2.5 min-[600px]:gap-4">
            {/* Language switcher — temporarily hidden until English is decided.
            <div className="hidden min-[600px]:block">
              <HeaderLocaleToggle locale={locale} />
            </div>
            */}
            {primaryButtons?.map((button) => (
              <HeaderCartButton key={button.id} component={button} />
            ))}
            <HeaderMobileMenu
              navbarItems={navbarItems}
              veteranLink={veteranLink}
              locale={locale}
            />
          </div>
        </div>
      </header>
    </>
  )
}
HeaderInner.displayName = "HeaderInner"

export default HeaderInner
