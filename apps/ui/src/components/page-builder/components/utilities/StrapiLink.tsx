import type { Data } from "@repo/strapi-types"
import type React from "react"

import AppLink from "@/components/elementary/AppLink"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export interface StrapiLinkProps {
  readonly component: Data.Component<"utilities.link"> | undefined | null
  readonly children?: React.ReactNode
  readonly className?: string
  readonly onClick?: () => void
  /** Render as a plain text link, without shadcn button styles. */
  readonly unstyled?: boolean
}
const getStrapiLinkHref = (
  component?: Data.Component<"utilities.link"> | null
) => {
  // Add more when needed
  switch (component?.type) {
    case "external":
      return component.href
    case "page":
      return component.page?.fullPath ?? "#"

    default:
      return
  }
}

export function StrapiLink({
  component,
  children,
  className,
  onClick,
  unstyled = false,
}: StrapiLinkProps) {
  if (component == null) {
    return null
  }

  const { newTab = false, label, decorations } = component ?? {}

  const {
    variant = "link",
    size = "default",
    leftIcon,
    rightIcon,
    hasIcons = false,
    disableAnimations = false,
  } = decorations ?? {}

  const linkHref = getStrapiLinkHref(component)

  if (!linkHref) {
    return children ?? label ?? null
  }

  return (
    <AppLink
      href={linkHref}
      openInNewTab={newTab ?? false}
      disableAnimations={disableAnimations ?? false}
      unstyled={unstyled}
      className={className}
      onClick={onClick}
      startAdornment={
        hasIcons && leftIcon ? (
          <StrapiBasicImage
            component={leftIcon}
            fill
            className="size-full object-contain"
          />
        ) : undefined
      }
      endAdornment={
        hasIcons && rightIcon ? (
          <StrapiBasicImage
            component={rightIcon}
            fill
            className="size-full object-contain"
          />
        ) : undefined
      }
      variant={variant}
      size={size}
    >
      {children ?? label}
    </AppLink>
  )
}

StrapiLink.displayName = "StrapiLink"

export default StrapiLink
