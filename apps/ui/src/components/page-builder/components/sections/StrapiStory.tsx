import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/** A photo beside a text column, with figures ("8 років / на ринку") below it. */
export function StrapiStory({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.story">
}) {
  const { title, text, image, imageSide, stats, theme } = component
  const isLight = theme === "light"

  // Blank lines in the CMS field are paragraph breaks.
  const paragraphs = (text ?? "").split(/\n{2,}/).filter(Boolean)

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-18",
        isLight ? "bg-brand-sand" : "bg-brand-green"
      )}
    >
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 min-[900px]:grid-cols-2 min-[900px]:gap-14">
        {image?.media ? (
          <div
            className={cn(
              "bg-brand-surface relative h-75 overflow-hidden rounded-2xl min-[900px]:h-105",
              imageSide === "right" && "min-[900px]:order-2"
            )}
          >
            <StrapiBasicImage
              component={image}
              fill
              sizes="(min-width: 900px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div>
          {title ? (
            <h2
              className={cn(
                "mb-4.5 text-[34px] leading-[1.15] font-bold",
                isLight
                  ? "font-bitter text-brand-forest"
                  : "font-oswald text-brand-cream uppercase"
              )}
            >
              {title}
            </h2>
          ) : null}

          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(
                "mb-4 text-[16.5px] leading-[1.8] last:mb-0",
                isLight ? "text-brand-sage" : "text-brand-nav"
              )}
            >
              {paragraph}
            </p>
          ))}

          {stats?.length ? (
            <dl className="mt-8.5 flex flex-wrap gap-x-11 gap-y-6">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <dt
                    className={cn(
                      "text-[38px] leading-none font-extrabold",
                      isLight
                        ? "font-bitter text-brand-forest"
                        : "font-oswald text-brand-cream"
                    )}
                  >
                    {stat.value}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1.5 text-[13px]",
                      isLight ? "text-brand-sage" : "text-brand-muted"
                    )}
                  >
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  )
}

StrapiStory.displayName = "StrapiStory"

export default StrapiStory
