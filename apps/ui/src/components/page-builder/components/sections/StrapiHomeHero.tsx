import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeHero({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-hero">
}) {
  const {
    title,
    titleAccent,
    subtitle,
    primaryLink,
    secondaryLink,
    image,
    veteranBadge,
    veteranTitle,
    veteranText,
    veteranLink,
  } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-0">
        {/* Left — headline + CTAs */}
        <div className="flex flex-col justify-center gap-6 lg:min-h-140">
          <Typography
            tag="h1"
            className="font-oswald text-brand-cream text-4xl leading-none font-bold uppercase sm:text-5xl lg:text-[62px]"
          >
            {title}{" "}
            {titleAccent ? (
              <span className="text-brand-bronze">{titleAccent}</span>
            ) : null}
          </Typography>

          {subtitle ? (
            <Typography className="text-brand-nav max-w-lg text-base/7">
              {subtitle}
            </Typography>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            {primaryLink ? (
              <StrapiLink
                component={primaryLink}
                className="bg-brand-bronze font-oswald rounded-sm px-7 py-3.5 text-center text-sm font-semibold tracking-wide text-white uppercase no-underline"
              />
            ) : null}
            {secondaryLink ? (
              <StrapiLink
                component={secondaryLink}
                className="border-brand-border text-brand-cream font-oswald rounded-sm border px-7 py-3.5 text-center text-sm font-semibold tracking-wide uppercase no-underline"
              />
            ) : null}
          </div>
        </div>

        {/* Right — veteran program card */}
        <div className="border-brand-orange relative overflow-hidden rounded-sm border-l-4 lg:min-h-140">
          {image ? (
            <StrapiBasicImage component={image} fill className="object-cover" />
          ) : (
            <div className="bg-brand-navy absolute inset-0" />
          )}
          <div className="from-brand-navy/95 to-brand-navy/30 absolute inset-0 bg-gradient-to-t" />

          <div className="relative flex h-full flex-col justify-end gap-3 p-8">
            {veteranBadge ? (
              <span className="font-oswald bg-brand-orange text-brand-navy w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                {veteranBadge}
              </span>
            ) : null}
            {veteranTitle ? (
              <Typography
                tag="h2"
                className="font-oswald text-brand-cream text-3xl font-bold uppercase"
              >
                {veteranTitle}
              </Typography>
            ) : null}
            {veteranText ? (
              <Typography className="text-brand-nav max-w-md text-sm/6">
                {veteranText}
              </Typography>
            ) : null}
            {veteranLink ? (
              <StrapiLink
                component={veteranLink}
                className="font-oswald text-brand-orange w-fit text-sm font-semibold tracking-wide uppercase no-underline"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

StrapiHomeHero.displayName = "StrapiHomeHero"

export default StrapiHomeHero
