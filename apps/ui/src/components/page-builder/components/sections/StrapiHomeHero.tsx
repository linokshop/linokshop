import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type HeroComponent = Data.Component<"sections.home-hero">

/** Left panel — headline + CTAs over a photo. */
function HeroHeadline({ component }: { readonly component: HeroComponent }) {
  const {
    eyebrow,
    title,
    titleAccent,
    subtitle,
    backgroundImage,
    primaryLink,
    secondaryLink,
  } = component

  return (
    <div
      className={cn(
        SECTION_X_PADDING,
        "relative flex min-h-100 flex-1 flex-col justify-center overflow-hidden py-14 min-[1200px]:min-h-140 min-[1200px]:py-0"
      )}
    >
      {backgroundImage?.media ? (
        <StrapiBasicImage
          component={backgroundImage}
          fill
          sizes="(min-width: 1200px) 60vw, 100vw"
          className="object-cover"
        />
      ) : null}
      <div className="from-brand-green/75 via-brand-green/70 to-brand-green/90 absolute inset-0 bg-linear-to-b" />

      <div className="relative max-w-140">
        {eyebrow ? (
          <span className="font-oswald text-brand-gold mb-4.5 block text-sm tracking-[0.3em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-oswald text-brand-cream mb-0 text-[34px] leading-[0.96] font-bold tracking-[0.01em] uppercase min-[430px]:text-[44px] min-[600px]:text-[62px]">
          {title}
          {titleAccent ? (
            <>
              <br />
              <span className="text-brand-bronze">{titleAccent}</span>
            </>
          ) : null}
        </h1>
        {subtitle ? (
          <p className="mt-4.5 max-w-110 text-[17px] leading-[1.6] text-[#d6d7c4]">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-7.5 flex flex-col gap-3.5 min-[500px]:flex-row">
          {primaryLink ? (
            <StrapiLink
              component={primaryLink}
              unstyled
              className="bg-brand-bronze font-oswald inline-flex w-full items-center justify-center rounded-sm px-8 py-4 text-base font-medium tracking-[0.06em] text-white uppercase transition-all hover:brightness-110 min-[500px]:w-auto"
            />
          ) : null}
          {secondaryLink ? (
            <StrapiLink
              component={secondaryLink}
              unstyled
              className="border-brand-cream/50 text-brand-cream hover:bg-brand-cream/10 font-oswald inline-flex w-full items-center justify-center rounded-sm border-[1.5px] px-8 py-4 text-base font-medium tracking-[0.06em] uppercase transition-colors min-[500px]:w-auto"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Right panel — the whole veteran-program card links to /veteran. */
function VeteranCard({ component }: { readonly component: HeroComponent }) {
  const {
    veteranImage,
    veteranBadge,
    veteranTitle,
    veteranTitleAccent,
    veteranText,
    veteranLink,
  } = component

  if (!veteranLink) {
    return null
  }

  return (
    <StrapiLink
      component={veteranLink}
      unstyled
      className="bg-brand-navy relative block min-h-115 w-full shrink-0 overflow-hidden min-[1200px]:min-h-140 min-[1200px]:w-133.5"
    >
      {/* Accent divider — sits above the photo (which is `fill`, so a border on
          the panel itself would be painted over). */}
      <span className="bg-brand-orange absolute inset-x-0 top-0 z-10 h-1 min-[1200px]:inset-x-auto min-[1200px]:inset-y-0 min-[1200px]:left-0 min-[1200px]:h-auto min-[1200px]:w-1" />
      {veteranImage?.media ? (
        <StrapiBasicImage
          component={veteranImage}
          fill
          sizes="(min-width: 1200px) 534px, 100vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : null}
      <div className="from-brand-navy/60 via-brand-navy/0 to-brand-navy/95 absolute inset-0 bg-linear-to-b" />

      {veteranBadge ? (
        <span className="font-oswald bg-brand-orange text-brand-navy absolute top-6.5 left-4 z-20 inline-flex items-center rounded-[5px] px-3.75 py-2 text-[12.5px] font-semibold tracking-[0.06em] uppercase min-[400px]:left-6 min-[900px]:left-10">
          {veteranBadge}
        </span>
      ) : null}

      <div className="absolute inset-x-4 bottom-7.5 z-20 min-[400px]:inset-x-6 min-[900px]:inset-x-10">
        {veteranTitle ? (
          <h2 className="font-oswald mb-0 text-[42px] leading-[0.94] font-bold tracking-[0.01em] text-white uppercase [text-shadow:0_2px_16px_rgba(8,26,42,0.8)]">
            {veteranTitle}{" "}
            {veteranTitleAccent ? (
              <span className="text-brand-orange">{veteranTitleAccent}</span>
            ) : null}
          </h2>
        ) : null}
        {veteranText ? (
          <p className="mt-3 max-w-107.5 text-[15px] leading-normal text-[#e9eef3] [text-shadow:0_1px_12px_rgba(8,26,42,0.9)]">
            {veteranText}
          </p>
        ) : null}
        {veteranLink.label ? (
          <span className="bg-brand-orange text-brand-navy font-oswald mt-4.5 inline-flex items-center rounded-[5px] px-7.5 py-3.5 text-[15px] font-semibold tracking-wider uppercase transition-all group-hover:brightness-110">
            {veteranLink.label}
          </span>
        ) : null}
      </div>
    </StrapiLink>
  )
}

export function StrapiHomeHero({
  component,
}: PageBuilderComponentProps & {
  readonly component: HeroComponent
}) {
  return (
    <section className="bg-brand-green font-golos relative flex min-h-140 flex-col overflow-hidden min-[1200px]:flex-row">
      <HeroHeadline component={component} />
      <VeteranCard component={component} />
    </section>
  )
}

StrapiHomeHero.displayName = "StrapiHomeHero"

export default StrapiHomeHero
