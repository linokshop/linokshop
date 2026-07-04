import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeProgram({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-program">
}) {
  const { badge, title, text, checklist, link, image } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="bg-brand-navy grid overflow-hidden rounded-sm lg:grid-cols-[0.82fr_1.18fr]">
          {/* Veteran photo */}
          <div className="relative min-h-64 lg:min-h-full">
            {image ? (
              <StrapiBasicImage
                component={image}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-brand-steel absolute inset-0" />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 p-8 lg:p-12">
            {badge ? (
              <span className="font-oswald bg-brand-orange text-brand-navy w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase">
                {badge}
              </span>
            ) : null}
            {title ? (
              <Typography
                tag="h2"
                className="font-oswald text-brand-cream text-3xl font-bold uppercase lg:text-4xl"
              >
                {title}
              </Typography>
            ) : null}
            {text ? (
              <Typography className="text-brand-nav max-w-xl text-base/7">
                {text}
              </Typography>
            ) : null}

            {checklist?.length ? (
              <ul className="grid list-none gap-3 sm:grid-cols-2">
                {checklist.map((item) => (
                  <li
                    key={item.id}
                    className="text-brand-nav flex items-start gap-2 text-sm"
                  >
                    <span className="text-brand-orange" aria-hidden>
                      ✓
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : null}

            {link ? (
              <StrapiLink
                component={link}
                className="bg-brand-bronze font-oswald w-fit rounded-sm px-7 py-3.5 text-sm font-semibold tracking-wide text-white uppercase no-underline"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

StrapiHomeProgram.displayName = "StrapiHomeProgram"

export default StrapiHomeProgram
