import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiCardGrid({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.card-grid">
}) {
  const { title, theme, cards } = component
  const isLight = theme === "light"

  return (
    <section
      className={cn("font-golos", isLight ? "bg-brand-sand" : "bg-brand-green")}
    >
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h2"
            className={cn(
              "font-oswald mb-8 text-3xl font-bold uppercase",
              isLight ? "text-brand-green" : "text-brand-cream"
            )}
          >
            {title}
          </Typography>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards?.map((card) => (
            <article
              key={card.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-sm border",
                isLight
                  ? "border-brand-green/10 bg-white"
                  : "border-brand-border bg-brand-surface"
              )}
            >
              {card.image ? (
                <div className="bg-brand-navy relative aspect-video">
                  <StrapiBasicImage
                    component={card.image}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2 p-6">
                {card.badge ? (
                  <span className="font-oswald bg-brand-orange text-brand-navy w-fit rounded-full px-2.5 py-1 text-xs font-semibold uppercase">
                    {card.badge}
                  </span>
                ) : null}
                {card.title ? (
                  <Typography
                    tag="h3"
                    className={cn(
                      "font-oswald text-lg font-semibold uppercase",
                      isLight ? "text-brand-green" : "text-brand-cream"
                    )}
                  >
                    {card.title}
                  </Typography>
                ) : null}
                {card.text ? (
                  <Typography
                    className={cn(
                      "text-sm/6",
                      isLight ? "text-brand-green/70" : "text-brand-nav"
                    )}
                  >
                    {card.text}
                  </Typography>
                ) : null}
                {card.link ? (
                  <StrapiLink
                    component={card.link}
                    className="font-oswald text-brand-orange mt-auto w-fit pt-2 text-sm font-semibold tracking-wide uppercase no-underline"
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiCardGrid.displayName = "StrapiCardGrid"

export default StrapiCardGrid
