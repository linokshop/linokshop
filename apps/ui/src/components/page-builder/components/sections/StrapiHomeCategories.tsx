import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeCategories({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-categories">
}) {
  const { title, categories } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h2"
            className="font-oswald text-brand-cream mb-8 text-3xl font-bold uppercase"
          >
            {title}
          </Typography>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories?.map((cat) => (
            <StrapiLink
              key={cat.id}
              component={cat.link}
              className="border-brand-border bg-brand-surface hover:border-brand-orange flex flex-col items-center gap-3 rounded-sm border p-5 no-underline transition-colors"
            >
              <span className="bg-brand-navy flex size-26 items-center justify-center overflow-hidden rounded-sm">
                {cat.image ? (
                  <StrapiBasicImage
                    component={cat.image}
                    width={104}
                    height={104}
                    className="size-full object-cover"
                  />
                ) : null}
              </span>
              <span className="font-oswald text-brand-cream text-center text-sm tracking-wide uppercase">
                {cat.label}
              </span>
              {cat.count ? (
                <span className="text-brand-muted text-xs">{cat.count}</span>
              ) : null}
            </StrapiLink>
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiHomeCategories.displayName = "StrapiHomeCategories"

export default StrapiHomeCategories
