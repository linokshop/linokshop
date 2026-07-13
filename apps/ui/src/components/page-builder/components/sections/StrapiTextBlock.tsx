import "server-only"

import type { Data } from "@repo/strapi-types"

import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * Eyebrow + heading + intro. Used as the lead block of a simple page (delivery,
 * about, contacts) — hence `h1` by default — and as a plain intro band further
 * down a page, where `headingLevel: h2` keeps the outline honest.
 */
export function StrapiTextBlock({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.text-block">
}) {
  const { eyebrow, title, text, theme, align, headingLevel } = component
  const isLight = theme === "light"
  const isLeft = align === "left"
  const Heading = headingLevel === "h2" ? "h2" : "h1"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-16",
        isLeft ? "text-left" : "text-center",
        isLight
          ? "bg-brand-cream border-brand-line border-b"
          : "bg-brand-surface"
      )}
    >
      <div
        className={cn("mx-auto", isLeft ? "max-w-[1320px]" : "max-w-[1100px]")}
      >
        {eyebrow ? (
          <span className="font-oswald text-brand-bronze block text-[13px] tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        {title ? (
          <Heading
            className={cn(
              "mt-4 mb-4 leading-[1.08]",
              isLight
                ? "font-bitter text-brand-forest text-[38px] font-extrabold min-[640px]:text-[50px]"
                : "font-oswald text-brand-cream text-[30px] font-semibold tracking-[0.02em] uppercase min-[640px]:text-[38px]"
            )}
          >
            {title}
          </Heading>
        ) : null}
        {text ? (
          <p
            className={cn(
              "text-[17px] leading-[1.7]",
              isLeft ? "max-w-150" : "mx-auto max-w-195 text-[18px]",
              isLight ? "text-brand-sage" : "text-brand-nav"
            )}
          >
            {text}
          </p>
        ) : null}
      </div>
    </section>
  )
}

StrapiTextBlock.displayName = "StrapiTextBlock"

export default StrapiTextBlock
