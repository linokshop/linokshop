import "server-only"

import type { Data } from "@repo/strapi-types"

import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The lead block of a simple page (delivery, about, contacts): eyebrow, page
 * title and a short intro, centred. It carries the page's <h1>.
 */
export function StrapiTextBlock({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.text-block">
}) {
  const { eyebrow, title, text, theme, align } = component
  const isLight = theme === "light"
  const isLeft = align === "left"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-16",
        isLeft ? "text-left" : "text-center",
        isLight
          ? "bg-brand-cream border-brand-line border-b"
          : "bg-brand-green border-brand-border border-b"
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
          <h1
            className={cn(
              "font-bitter mt-4 mb-4 text-[38px] leading-[1.08] font-extrabold min-[640px]:text-[50px]",
              isLight ? "text-brand-forest" : "text-brand-cream"
            )}
          >
            {title}
          </h1>
        ) : null}
        {text ? (
          <p
            className={cn(
              "max-w-150 text-[17px] leading-[1.7]",
              !isLeft && "mx-auto",
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
