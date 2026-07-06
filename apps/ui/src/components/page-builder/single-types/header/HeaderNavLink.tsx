"use client"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { usePathname } from "@/lib/navigation"

function resolveHref(link?: Data.Component<"utilities.link"> | null) {
  if (link?.type === "external") return link.href
  if (link?.type === "page") return link.page?.fullPath
}

/**
 * Desktop nav link with the active-page underline from the ЛінОк header design.
 */
export function HeaderNavLink({
  component,
  className,
}: {
  readonly component?: Data.Component<"utilities.link"> | null
  readonly className?: string
}) {
  const pathname = usePathname()
  const href = resolveHref(component)

  const isActive =
    href === "/"
      ? pathname === "/"
      : !!href && (pathname === href || pathname.startsWith(`${href}/`))

  return (
    <span className="relative">
      <StrapiLink
        component={component}
        unstyled
        className={
          className ??
          "font-oswald text-brand-nav hover:text-brand-cream inline-flex items-center py-1 text-sm tracking-wider uppercase transition-colors"
        }
      />
      {isActive ? (
        <span className="bg-brand-orange absolute inset-x-0 -bottom-1.5 h-0.5" />
      ) : null}
    </span>
  )
}

export default HeaderNavLink
