import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import HeaderMobileMenu from "@/components/page-builder/single-types/header/HeaderMobileMenu"
import { Link } from "@/lib/navigation"

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
    <header className="font-golos sticky top-0 z-50">
      {/* Tier 1 — «Ветеранський спорт» program strip */}
      {topStripLink ? (
        <StrapiLink
          component={topStripLink}
          className="bg-brand-steel flex items-center justify-center gap-2.5 px-4 py-2.5 text-center no-underline sm:px-10"
        >
          <span className="bg-brand-orange size-2 shrink-0 rounded-full" />
          {topStripText ? (
            <span className="font-oswald text-brand-cream hidden text-[13.5px] tracking-wide uppercase sm:inline">
              {topStripText}
            </span>
          ) : null}
          <span className="font-oswald text-brand-orange text-xs font-semibold tracking-wide uppercase sm:text-[13.5px]">
            {topStripLink.label}
          </span>
        </StrapiLink>
      ) : null}

      {/* Tier 2 — main bar */}
      <div className="bg-brand-green border-brand-border relative border-b">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
              <span className="font-oswald text-brand-cream text-[21px] font-semibold tracking-wide sm:text-[25px]">
                {logoTitle}
              </span>
              {logoSubtitle ? (
                <span className="font-oswald text-brand-muted mt-1 hidden text-[10.5px] tracking-[0.16em] uppercase sm:block">
                  {logoSubtitle}
                </span>
              ) : null}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navbarItems?.map((item) =>
              item.link ? (
                <StrapiLink
                  key={item.id}
                  component={item.link}
                  className="font-oswald text-brand-nav hover:text-brand-cream text-sm tracking-wide uppercase no-underline transition-colors"
                />
              ) : null
            )}
            {veteranLink ? (
              <StrapiLink
                component={veteranLink}
                className="font-oswald text-brand-orange text-sm font-medium tracking-wide uppercase no-underline"
              />
            ) : null}
          </nav>

          {/* Right side — language, cart, burger */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LocaleSwitcher locale={locale} />
            </div>
            {primaryButtons?.map((button) => (
              <StrapiLink
                key={button.id}
                component={button}
                className="bg-brand-bronze font-oswald shrink-0 rounded-sm px-4 py-2.5 text-sm font-medium tracking-wide text-white uppercase no-underline"
              />
            ))}
            <HeaderMobileMenu
              navbarItems={navbarItems}
              veteranLink={veteranLink}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
HeaderInner.displayName = "HeaderInner"

export default HeaderInner
