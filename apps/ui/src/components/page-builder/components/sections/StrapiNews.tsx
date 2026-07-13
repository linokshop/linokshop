import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/** Horizontal news items: photo on the left, date + headline + lead on the right. */
export function StrapiNews({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.news">
}) {
  const { title, theme, items } = component
  const isLight = theme === "light"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos pt-12 pb-17.5",
        isLight ? "bg-brand-sand" : "bg-brand-surface"
      )}
    >
      <div className="mx-auto max-w-[1320px]">
        {title ? (
          <h2
            className={cn(
              "mb-6.5 text-[30px] leading-tight font-semibold min-[600px]:text-[32px]",
              isLight
                ? "font-bitter text-brand-forest"
                : "font-oswald text-brand-cream tracking-[0.02em] uppercase"
            )}
          >
            {title}
          </h2>
        ) : null}

        <div className="flex flex-col gap-4.5">
          {items?.map((item) => {
            const body = (
              <>
                <span
                  className={cn(
                    "relative block h-45 w-full shrink-0 overflow-hidden min-[700px]:h-auto min-[700px]:w-60",
                    isLight ? "bg-brand-line" : "bg-brand-green"
                  )}
                >
                  {item.image?.media ? (
                    <StrapiBasicImage
                      component={item.image}
                      fill
                      sizes="(min-width: 700px) 240px, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </span>

                <span className="flex flex-col justify-center p-5.5 min-[700px]:py-6 min-[700px]:pr-6 min-[700px]:pl-0">
                  {item.date ? (
                    <span
                      className={cn(
                        "font-oswald mb-2 block text-[13px] tracking-[0.05em] uppercase",
                        isLight ? "text-brand-sage" : "text-brand-muted"
                      )}
                    >
                      {item.date}
                    </span>
                  ) : null}
                  {item.title ? (
                    <span
                      className={cn(
                        "mb-2 block text-xl font-semibold transition-colors",
                        isLight
                          ? "text-brand-forest group-hover:text-brand-bronze"
                          : "text-brand-cream group-hover:text-brand-orange"
                      )}
                    >
                      {item.title}
                    </span>
                  ) : null}
                  {item.text ? (
                    <span
                      className={cn(
                        "block text-[15px] leading-[1.65]",
                        isLight ? "text-brand-sage" : "text-brand-nav"
                      )}
                    >
                      {item.text}
                    </span>
                  ) : null}
                </span>
              </>
            )

            const className = cn(
              "flex flex-col overflow-hidden rounded-xl border transition-colors min-[700px]:flex-row min-[700px]:gap-6",
              isLight
                ? "bg-brand-paper border-brand-line"
                : "bg-brand-green border-brand-border",
              item.link && "hover:border-brand-orange"
            )

            return item.link ? (
              <StrapiLink
                key={item.id}
                component={item.link}
                unstyled
                className={className}
              >
                {body}
              </StrapiLink>
            ) : (
              <article key={item.id} className={className}>
                {body}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

StrapiNews.displayName = "StrapiNews"

export default StrapiNews
