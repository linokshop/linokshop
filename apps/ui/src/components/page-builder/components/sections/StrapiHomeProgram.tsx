import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeProgram({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-program">
}) {
  const { badge, title, titleAccent, text, checklist, link, image } = component

  return (
    <section className="bg-brand-steel font-golos grid text-white min-[900px]:grid-cols-[0.82fr_1.18fr]">
      {/* Veteran photo — bleeds to the left edge, no card, no gap */}
      <div className="bg-brand-navy relative min-h-75 min-[900px]:min-h-115">
        {image?.media ? (
          <StrapiBasicImage
            component={image}
            fill
            sizes="(min-width: 900px) 42vw, 100vw"
            // Faces sit high in these shots — centring would crop them off.
            className="object-cover object-[center_28%]"
          />
        ) : null}
      </div>

      <div
        className={cn(
          SECTION_X_PADDING,
          // The left padding is interior once the photo is beside us, so it can
          // be wider than the page gutter; the right one stays on the shared
          // vertical line with the header and the footer.
          "flex flex-col justify-center py-11 min-[900px]:py-15 min-[900px]:pl-14"
        )}
      >
        {badge ? (
          <span className="font-oswald bg-brand-orange text-brand-navy mb-5.5 w-fit rounded px-4 py-2 text-[13px] font-semibold tracking-[0.06em] uppercase">
            {badge}
          </span>
        ) : null}

        {title ? (
          <h2 className="font-oswald mb-4.5 text-[34px] leading-[0.98] font-bold tracking-[0.01em] uppercase min-[600px]:text-[50px]">
            {title}
            {titleAccent ? (
              <>
                {" "}
                <span className="text-brand-orange">{titleAccent}</span>
              </>
            ) : null}
          </h2>
        ) : null}

        {text ? (
          <p className="text-brand-mist mb-7 max-w-130 text-[17px] leading-[1.65]">
            {text}
          </p>
        ) : null}

        {checklist?.length ? (
          <ul className="font-oswald mb-7.5 grid max-w-120 list-none grid-cols-1 gap-x-6.5 gap-y-3.5 text-sm tracking-[0.03em] uppercase min-[600px]:grid-cols-2">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="bg-brand-orange text-brand-navy flex size-5.5 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                >
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
            unstyled
            className="bg-brand-orange text-brand-navy font-oswald w-fit rounded-[5px] px-8.5 py-4 text-base font-semibold tracking-[0.05em] uppercase transition-colors hover:bg-white"
          />
        ) : null}
      </div>
    </section>
  )
}

StrapiHomeProgram.displayName = "StrapiHomeProgram"

export default StrapiHomeProgram
