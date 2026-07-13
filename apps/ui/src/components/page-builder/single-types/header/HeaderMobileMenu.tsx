"use client"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { useEffect, useRef, useState } from "react"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { cn } from "@/lib/styles"

interface HeaderMobileMenuProps {
  readonly navbarItems?: Data.ContentType<"api::header.header">["navbarItems"]
  readonly veteranLink?: Data.Component<"utilities.link"> | null
  readonly locale: Locale
}

export function HeaderMobileMenu({
  navbarItems,
  veteranLink,
}: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState<number>()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape while the menu is open.
  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  // Cap the dropdown to the space below the (sticky) header so it scrolls
  // instead of running off-screen. Measured from the menu's own top offset.
  useEffect(() => {
    if (!open) {
      return
    }

    const update = () => {
      const top = menuRef.current?.getBoundingClientRect().top ?? 0
      setMaxHeight(Math.max(0, window.innerHeight - top))
    }
    update()
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("resize", update)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Меню"
        aria-expanded={open}
        aria-controls="header-mobile-menu"
        className="border-brand-border bg-brand-surface flex size-11 items-center justify-center rounded-lg border min-[1200px]:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="text-brand-sand size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            className={cn(
              "origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-fill",
              open && "translate-y-1.5 rotate-45"
            )}
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            className={cn(
              "transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open && "opacity-0"
            )}
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            className={cn(
              "origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-fill",
              open && "-translate-y-1.5 -rotate-45"
            )}
          />
        </svg>
      </button>

      {open ? (
        <div
          ref={menuRef}
          id="header-mobile-menu"
          style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
          className="border-brand-border bg-brand-green animate-in fade-in-0 slide-in-from-top-2 absolute inset-x-0 top-full max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain border-b px-4.5 pt-2 pb-4.5 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] min-[1200px]:hidden"
        >
          {navbarItems?.map((item) =>
            item.link ? (
              <StrapiLink
                key={item.id}
                component={item.link}
                onClick={() => setOpen(false)}
                unstyled
                className="border-brand-border text-brand-nav hover:text-brand-cream font-oswald block border-b px-1 py-3.25 text-base tracking-[0.04em] uppercase transition-colors"
              />
            ) : null
          )}
          {veteranLink ? (
            <StrapiLink
              component={veteranLink}
              onClick={() => setOpen(false)}
              unstyled
              className="text-brand-orange font-oswald block px-1 py-3.25 text-base font-semibold tracking-[0.04em] uppercase"
            />
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export default HeaderMobileMenu
