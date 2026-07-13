import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The promo block, in two shapes:
 * - `band` — a flat full-bleed bronze strip, the whole thing one link (home);
 * - `featured` — a rounded hero card: photo under a bronze gradient, eyebrow,
 *   headline and a dark CTA button (top of the promos page).
 */
export function StrapiHomePromo({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-promo">
}) {
  const { variant, eyebrow, title, text, link, image } = component

  if (variant === "featured") {
    return (
      <section
        className={cn(SECTION_X_PADDING, "bg-brand-surface font-golos py-6")}
      >
        <div className="relative mx-auto flex min-h-80 max-w-[1320px] items-center overflow-hidden rounded-2xl">
          {image?.media ? (
            <StrapiBasicImage
              component={image}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          {/* Bronze wash: opaque where the text sits, clearing towards the photo. */}
          <span className="from-brand-bronze/95 via-brand-bronze/70 to-brand-bronze/20 absolute inset-0 bg-gradient-to-r" />

          <div className="relative px-6.5 py-8 text-white min-[600px]:px-14 min-[600px]:py-12">
            {eyebrow ? (
              <span className="font-oswald text-brand-peach mb-3.5 block text-[13px] tracking-[0.14em] uppercase">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <p className="font-oswald mb-3.5 text-[32px] leading-none font-bold tracking-[0.01em] uppercase min-[600px]:text-[46px]">
                {title}
              </p>
            ) : null}
            {text ? (
              <p className="mb-6 max-w-110 text-base text-white/90">{text}</p>
            ) : null}
            {link ? (
              <StrapiLink
                component={link}
                unstyled
                className="bg-brand-surface text-brand-cream font-oswald hover:bg-brand-green inline-flex rounded-[5px] px-8 py-4 text-[15px] font-medium tracking-[0.05em] uppercase transition-colors"
              />
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  // The whole band is one click target, so the CTA is a plain span inside it.
  const body = (
    <>
      <span className="block">
        {title ? (
          <span className="font-oswald block text-2xl font-bold tracking-[0.02em] text-white uppercase min-[600px]:text-[32px]">
            {title}
          </span>
        ) : null}
        {text ? (
          <span className="text-brand-peach mt-1.5 block text-base">
            {text}
          </span>
        ) : null}
      </span>

      {link?.label ? (
        <span className="font-oswald bg-brand-surface text-brand-cream group-hover:bg-brand-green shrink-0 rounded px-8 py-4 text-base font-medium tracking-[0.06em] uppercase transition-colors">
          {link.label}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    SECTION_X_PADDING,
    "bg-brand-bronze font-golos flex flex-col items-center gap-5 py-10 text-center min-[900px]:flex-row min-[900px]:justify-between min-[900px]:py-11 min-[900px]:text-left"
  )

  return link ? (
    <StrapiLink component={link} unstyled className={className}>
      {body}
    </StrapiLink>
  ) : (
    <section className={className}>{body}</section>
  )
}

StrapiHomePromo.displayName = "StrapiHomePromo"

export default StrapiHomePromo
