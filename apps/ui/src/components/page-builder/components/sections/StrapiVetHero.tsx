import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/** Hero of the veteran-programme page: text on navy, photo panel on the right. */
export function StrapiVetHero({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.vet-hero">
}) {
  const { badge, title, titleAccent, text, link, image, badgeImage } = component

  return (
    <section className="bg-brand-navy font-golos flex flex-col text-white min-[900px]:min-h-155 min-[900px]:flex-row">
      <div
        className={cn(
          SECTION_X_PADDING,
          "flex flex-[1.15] flex-col justify-center py-14 min-[900px]:py-18"
        )}
      >
        {badge ? (
          <span className="font-oswald bg-brand-orange text-brand-navy mb-6.5 w-fit rounded-[5px] px-4.5 py-2.5 text-[13px] font-semibold tracking-[0.07em] uppercase">
            {badge}
          </span>
        ) : null}

        {title ? (
          <h1 className="font-oswald mb-5.5 text-[56px] leading-[0.93] font-bold tracking-[0.01em] uppercase min-[600px]:text-[78px]">
            {title}
            {titleAccent ? (
              <>
                <br />
                <span className="text-brand-orange">{titleAccent}</span>
              </>
            ) : null}
          </h1>
        ) : null}

        {text ? (
          <p className="text-brand-mist mb-8 max-w-140 text-[19px] leading-[1.65]">
            {text}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3.5">
          {link ? (
            <StrapiLink
              component={link}
              unstyled
              className="bg-brand-orange text-brand-navy font-oswald rounded-[5px] px-9 py-4.5 text-base font-semibold tracking-[0.05em] uppercase transition-colors hover:bg-white"
            />
          ) : null}
          {badgeImage?.media ? (
            <span className="relative block size-18 shrink-0 overflow-hidden rounded-xl bg-white">
              <StrapiBasicImage
                component={badgeImage}
                fill
                sizes="72px"
                className="object-contain"
              />
            </span>
          ) : null}
        </div>
      </div>

      {image?.media ? (
        <div className="border-brand-orange relative min-h-85 border-t-4 min-[900px]:min-h-0 min-[900px]:w-[46%] min-[900px]:shrink-0 min-[900px]:border-t-0 min-[900px]:border-l-4">
          <StrapiBasicImage
            component={image}
            fill
            sizes="(min-width: 900px) 46vw, 100vw"
            className="object-cover object-[center_40%]"
          />
          {/* Fades the photo into the text panel instead of a hard seam. */}
          <span className="from-brand-navy/60 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        </div>
      ) : null}
    </section>
  )
}

StrapiVetHero.displayName = "StrapiVetHero"

export default StrapiVetHero
