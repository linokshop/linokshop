import type { Locale } from "next-intl"

import AppLink from "@/components/elementary/AppLink"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { generateBreadcrumbListSchema } from "@/lib/metadata/schemas"
import { cn } from "@/lib/styles"
import type { BreadCrumb } from "@/types/api"

export type BreadcrumbsTheme = "dark" | "light"

/** Colours for the surface the breadcrumbs float over. */
const THEMES: Record<
  BreadcrumbsTheme,
  { separator: string; link: string; current: string }
> = {
  dark: {
    separator: "text-brand-muted",
    link: "text-brand-nav hover:text-brand-cream",
    current: "text-brand-cream",
  },
  light: {
    separator: "text-brand-muted",
    link: "text-brand-muted hover:text-brand-green",
    current: "text-brand-green",
  },
}

interface Props {
  readonly breadcrumbs?: BreadCrumb[]
  readonly className?: string
  readonly locale: Locale
  readonly theme?: BreadcrumbsTheme
}

export function Breadcrumbs({
  breadcrumbs,
  className,
  locale,
  theme = "dark",
}: Props) {
  // A lone crumb is the page itself — a trail with nowhere to go.
  if (!breadcrumbs || breadcrumbs.length < 2) {
    return null
  }

  const colors = THEMES[theme]
  const breadcrumbListSchema = generateBreadcrumbListSchema(breadcrumbs, locale)

  return (
    <div className={cn("w-full", className)}>
      <StrapiStructuredData structuredData={breadcrumbListSchema} />
      <nav aria-label="Breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.fullPath}>
            {index !== 0 && (
              <span className={cn("mx-2 inline-block", colors.separator)}>
                /
              </span>
            )}

            {index === breadcrumbs.length - 1 ? (
              <span
                className={cn(
                  "tracking-sm inline text-xs leading-4.5 wrap-break-word md:text-sm md:leading-5.25",
                  colors.current
                )}
                aria-current="page"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {breadcrumb.title}
              </span>
            ) : (
              <AppLink
                unstyled
                href={breadcrumb.fullPath}
                className={cn("transition-colors", colors.link)}
              >
                <span className="tracking-sm inline-block text-xs leading-4.5 md:text-sm md:leading-5.25">
                  {breadcrumb.title}
                </span>
              </AppLink>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
