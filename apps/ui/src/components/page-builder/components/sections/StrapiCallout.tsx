import "server-only"

import type { Data } from "@repo/strapi-types"

import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

const COLORS = {
  orange: "bg-brand-orange text-brand-navy",
  bronze: "bg-brand-bronze text-white",
  steel: "bg-brand-steel text-white",
} as const

/** A loud full-width band — e.g. the thank-you at the end of the veteran page. */
export function StrapiCallout({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.callout">
}) {
  const { title, subtitle, note, color } = component

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-oswald py-15 text-center uppercase",
        COLORS[color ?? "orange"]
      )}
    >
      <div className="mx-auto max-w-[1100px]">
        {title ? (
          <p className="text-[30px] leading-[1.05] font-bold tracking-[0.02em] min-[600px]:text-[40px]">
            {title}
          </p>
        ) : null}
        {subtitle ? (
          <p className="mt-2.5 text-[19px] font-medium tracking-[0.04em] min-[600px]:text-2xl">
            {subtitle}
          </p>
        ) : null}
        {note ? (
          <p className="mt-4.5 text-[18px] tracking-[0.06em]">{note}</p>
        ) : null}
      </div>
    </section>
  )
}

StrapiCallout.displayName = "StrapiCallout"

export default StrapiCallout
