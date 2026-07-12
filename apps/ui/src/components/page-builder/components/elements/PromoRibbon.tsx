import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"

type LinkComponent = Data.Component<"utilities.link">
type ImageComponent = Data.Component<"utilities.basic-image">

/**
 * Full-width veteran-program CTA strip shared by the header and footer.
 *
 * Rendered via `StrapiLink unstyled`, so it's a plain anchor without shadcn
 * button styles (`whitespace-nowrap`, `rounded-md`, `h-8`, `hover:underline`) —
 * long copy wraps by word instead of overflowing on narrow screens.
 */
const VARIANTS = {
  header: {
    container:
      "bg-brand-steel py-2.25 transition-all hover:brightness-110 min-[900px]:py-2.5",
    lead: "text-brand-cream text-[11px] group-hover:text-white min-[900px]:text-[13.5px]",
    label: "text-brand-orange text-[11px] min-[900px]:text-[13.5px]",
    withDot: true,
    withArrow: true,
  },
  footer: {
    container:
      "bg-brand-steel border-brand-orange border-b-[3px] py-3.5 min-[900px]:py-4",
    lead: "text-white text-[13px] min-[900px]:text-[15px]",
    label: "text-brand-orange text-sm",
    withDot: false,
    withArrow: false,
  },
} as const

interface PromoRibbonProps {
  readonly component?: LinkComponent | null
  readonly leadText?: string | null
  readonly variant?: keyof typeof VARIANTS
  /** Optional leading image (footer variant shows a veteran photo). */
  readonly image?: ImageComponent | null
}

export function PromoRibbon({
  component,
  leadText,
  variant = "header",
  image,
}: PromoRibbonProps) {
  if (component == null) {
    return null
  }

  const v = VARIANTS[variant]

  return (
    <StrapiLink
      component={component}
      unstyled
      className={cn(
        // Plain anchor (no button styles) → text wraps by word naturally.
        "block text-center leading-relaxed",
        SECTION_X_PADDING,
        v.container
      )}
    >
      {image?.media ? (
        <StrapiBasicImage
          component={image}
          width={42}
          height={42}
          className="mr-3.5 inline-block size-10.5 shrink-0 rounded-lg object-cover object-[center_22%] align-middle"
        />
      ) : v.withDot ? (
        <span className="bg-brand-orange mr-2.5 inline-block size-2 rounded-full align-middle" />
      ) : null}
      {leadText ? (
        <span
          className={cn(
            "font-oswald align-middle tracking-[0.04em] uppercase transition-colors",
            v.lead
          )}
        >
          {leadText}
        </span>
      ) : null}
      <span
        className={cn(
          "font-oswald ml-2.5 inline-flex items-center gap-1.5 align-middle font-semibold tracking-[0.04em] uppercase",
          v.label
        )}
      >
        {component.label}
        {v.withArrow ? (
          <svg
            viewBox="0 0 36 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-3 w-4.5 shrink-0 transition-transform group-hover:translate-x-0.5 min-[900px]:h-3.5 min-[900px]:w-5.5"
          >
            <path d="M2 12h30M26 6l6 6-6 6" />
          </svg>
        ) : null}
      </span>
    </StrapiLink>
  )
}

PromoRibbon.displayName = "PromoRibbon"

export default PromoRibbon
