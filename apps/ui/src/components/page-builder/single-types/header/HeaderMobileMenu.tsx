"use client"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { useState } from "react"

import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

interface HeaderMobileMenuProps {
  readonly navbarItems?: Data.ContentType<"api::header.header">["navbarItems"]
  readonly veteranLink?: Data.Component<"utilities.link"> | null
  readonly locale: Locale
}

export function HeaderMobileMenu({
  navbarItems,
  veteranLink,
  locale,
}: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Меню"
        aria-expanded={open}
        className="border-brand-border bg-brand-surface flex size-11 flex-col items-center justify-center gap-[5px] rounded-lg border lg:hidden"
      >
        <span className="bg-brand-cream block h-0.5 w-5" />
        <span className="bg-brand-cream block h-0.5 w-5" />
        <span className="bg-brand-cream block h-0.5 w-5" />
      </button>

      {open ? (
        <div className="border-brand-border bg-brand-green absolute inset-x-0 top-full border-b px-[18px] pt-2 pb-[18px] lg:hidden">
          {navbarItems?.map((item) =>
            item.link ? (
              <StrapiLink
                key={item.id}
                component={item.link}
                onClick={() => setOpen(false)}
                className="border-brand-border text-brand-nav font-oswald block border-b px-1 py-[13px] text-base tracking-wide uppercase no-underline"
              />
            ) : null
          )}
          {veteranLink ? (
            <StrapiLink
              component={veteranLink}
              onClick={() => setOpen(false)}
              className="text-brand-orange font-oswald block px-1 py-[13px] text-base font-semibold tracking-wide uppercase no-underline"
            />
          ) : null}
          <div className="px-1 pt-2.5">
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default HeaderMobileMenu
