import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiNews({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.news">
}) {
  const { title, theme, items } = component
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

        <div className="flex flex-col gap-4">
          {items?.map((item) => (
            <article
              key={item.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-sm border sm:flex-row",
                isLight
                  ? "border-brand-green/10 bg-white"
                  : "border-brand-border bg-brand-surface"
              )}
            >
              <div className="bg-brand-navy relative min-h-48 sm:min-h-full sm:w-60 sm:shrink-0">
                {item.image ? (
                  <StrapiBasicImage
                    component={item.image}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                {item.date ? (
                  <span className="font-oswald text-brand-orange text-xs tracking-wide uppercase">
                    {item.date}
                  </span>
                ) : null}
                {item.title ? (
                  <StrapiLink
                    component={item.link}
                    className={cn(
                      "font-oswald hover:text-brand-orange text-lg font-semibold uppercase no-underline transition-colors",
                      isLight ? "text-brand-green" : "text-brand-cream"
                    )}
                  >
                    {item.title}
                  </StrapiLink>
                ) : null}
                {item.text ? (
                  <Typography
                    className={cn(
                      "text-sm/6",
                      isLight ? "text-brand-green/70" : "text-brand-nav"
                    )}
                  >
                    {item.text}
                  </Typography>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiNews.displayName = "StrapiNews"

export default StrapiNews
