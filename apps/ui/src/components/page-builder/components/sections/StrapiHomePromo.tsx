import "server-only"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomePromo({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-promo">
}) {
  const { title, text, link } = component

  return (
    <section className="font-golos px-4 py-6 sm:px-6 lg:px-10">
      <div className="bg-brand-bronze flex flex-col items-center justify-between gap-4 rounded-sm px-6 py-8 text-center sm:flex-row sm:text-left lg:px-12">
        <div>
          {title ? (
            <Typography
              tag="h2"
              className="font-oswald text-2xl font-bold text-white uppercase lg:text-3xl"
            >
              {title}
            </Typography>
          ) : null}
          {text ? (
            <Typography className="mt-1 text-white/85">{text}</Typography>
          ) : null}
        </div>
        {link ? (
          <StrapiLink
            component={link}
            className="font-oswald bg-brand-navy shrink-0 rounded-sm px-7 py-3.5 text-sm font-semibold tracking-wide text-white uppercase no-underline"
          />
        ) : null}
      </div>
    </section>
  )
}

StrapiHomePromo.displayName = "StrapiHomePromo"

export default StrapiHomePromo
