import "server-only"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomePromo({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-promo">
}) {
  const { title, text, link } = component

  // The whole band is one click target, so the CTA is a plain span inside it.
  const body = (
    <>
      <span className="block">
        {title ? (
          <span className="font-oswald block text-2xl font-bold tracking-[0.02em] text-white uppercase min-[600px]:text-[32px]">
            {title}
          </span>
        ) : null}
        {text ? (
          <span className="text-brand-peach mt-1.5 block text-base">
            {text}
          </span>
        ) : null}
      </span>

      {link?.label ? (
        <span className="font-oswald bg-brand-surface text-brand-cream group-hover:bg-brand-green shrink-0 rounded px-8 py-4 text-base font-medium tracking-[0.06em] uppercase transition-colors">
          {link.label}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    SECTION_X_PADDING,
    "bg-brand-bronze font-golos flex flex-col items-center gap-5 py-10 text-center min-[900px]:flex-row min-[900px]:justify-between min-[900px]:py-11 min-[900px]:text-left"
  )

  return link ? (
    <StrapiLink component={link} unstyled className={className}>
      {body}
    </StrapiLink>
  ) : (
    <section className={className}>{body}</section>
  )
}

StrapiHomePromo.displayName = "StrapiHomePromo"

export default StrapiHomePromo
