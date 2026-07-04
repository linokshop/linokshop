import "server-only"

import type { Data } from "@repo/strapi-types"

import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiTextBlock({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.text-block">
}) {
  const { eyebrow, title, text, theme } = component
  const isLight = theme === "light"

  return (
    <section
      className={cn("font-golos", isLight ? "bg-brand-sand" : "bg-brand-green")}
    >
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-10">
        {eyebrow ? (
          <span className="font-oswald text-brand-orange text-sm font-semibold tracking-widest uppercase">
            {eyebrow}
          </span>
        ) : null}
        {title ? (
          <Typography
            tag="h2"
            className={cn(
              "font-oswald mt-3 text-3xl font-bold uppercase",
              isLight ? "text-brand-green" : "text-brand-cream"
            )}
          >
            {title}
          </Typography>
        ) : null}
        {text ? (
          <Typography
            className={cn(
              "mt-4 text-base/7",
              isLight ? "text-brand-green/75" : "text-brand-nav"
            )}
          >
            {text}
          </Typography>
        ) : null}
      </div>
    </section>
  )
}

StrapiTextBlock.displayName = "StrapiTextBlock"

export default StrapiTextBlock
