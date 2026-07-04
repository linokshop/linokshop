import "server-only"

import type { Data } from "@repo/strapi-types"

import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiTextBlock({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.text-block">
}) {
  const { eyebrow, title, text } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-10">
        {eyebrow ? (
          <span className="font-oswald text-brand-orange text-sm font-semibold tracking-widest uppercase">
            {eyebrow}
          </span>
        ) : null}
        {title ? (
          <Typography
            tag="h2"
            className="font-oswald text-brand-cream mt-3 text-3xl font-bold uppercase"
          >
            {title}
          </Typography>
        ) : null}
        {text ? (
          <Typography className="text-brand-nav mt-4 text-base/7">
            {text}
          </Typography>
        ) : null}
      </div>
    </section>
  )
}

StrapiTextBlock.displayName = "StrapiTextBlock"

export default StrapiTextBlock
