import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * The veteran-programme block, in two shapes:
 * - `band` — full-bleed, photo hard against the left edge (home page);
 * - `card` — a rounded tile inset in the page, clickable as a whole, with the
 *   CTA as a text arrow instead of a button (about page).
 */
export function StrapiHomeProgram({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-program">
}) {
  const {
    variant,
    theme,
    badge,
    title,
    titleAccent,
    text,
    checklist,
    link,
    image,
  } = component
  const isCard = variant === "card"

  const inner = (
    <>
      <div
        className={cn(
          "bg-brand-navy relative",
          isCard
            ? "min-h-55 min-[900px]:min-h-60"
            : "min-h-75 min-[900px]:min-h-115"
        )}
      >
        {image?.media ? (
          <StrapiBasicImage
            component={image}
            fill
            sizes={
              isCard
                ? "(min-width: 900px) 35vw, 100vw"
                : "(min-width: 900px) 42vw, 100vw"
            }
            // Faces sit high in these shots — centring would crop them off.
            className="object-cover object-[center_28%]"
          />
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-col justify-center",
          isCard
            ? "p-9 min-[900px]:px-12 min-[900px]:py-11"
            : cn(SECTION_X_PADDING, "py-11 min-[900px]:py-15 min-[900px]:pl-14")
        )}
      >
        {badge ? (
          <span className="font-oswald bg-brand-orange text-brand-navy mb-5 w-fit rounded px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.06em] uppercase">
            {badge}
          </span>
        ) : null}

        {title ? (
          <h2
            className={cn(
              "font-oswald mb-3.5 leading-[0.98] font-bold tracking-[0.01em] uppercase",
              isCard
                ? "text-[28px] min-[600px]:text-[36px]"
                : "mb-4.5 text-[34px] min-[600px]:text-[50px]"
            )}
          >
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
          <p
            className={cn(
              "text-brand-mist leading-[1.65]",
              isCard ? "mb-5 max-w-135 text-base" : "mb-7 max-w-130 text-[17px]"
            )}
          >
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

        {link?.label ? (
          isCard ? (
            // The card itself is the link — this is only its visual affordance.
            <span className="font-oswald text-brand-orange text-[15px] font-semibold tracking-[0.04em] uppercase">
              {link.label}
            </span>
          ) : (
            <StrapiLink
              component={link}
              unstyled
              className="bg-brand-orange text-brand-navy font-oswald w-fit rounded-[5px] px-8.5 py-4 text-base font-semibold tracking-[0.05em] uppercase transition-colors hover:bg-white"
            />
          )
        ) : null}
      </div>
    </>
  )

  if (!isCard) {
    return (
      <section className="bg-brand-steel font-golos grid text-white min-[900px]:grid-cols-[0.82fr_1.18fr]">
        {inner}
      </section>
    )
  }

  const cardClassName =
    "bg-brand-steel hover:ring-brand-orange grid overflow-hidden rounded-2xl text-white transition-[box-shadow] hover:ring-2 min-[900px]:grid-cols-[0.7fr_1.3fr]"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-16",
        theme === "light" ? "bg-brand-sand" : "bg-brand-green"
      )}
    >
      <div className="mx-auto max-w-[1320px]">
        {link ? (
          <StrapiLink component={link} unstyled className={cardClassName}>
            {inner}
          </StrapiLink>
        ) : (
          <div className={cardClassName}>{inner}</div>
        )}
      </div>
    </section>
  )
}

StrapiHomeProgram.displayName = "StrapiHomeProgram"

export default StrapiHomeProgram
