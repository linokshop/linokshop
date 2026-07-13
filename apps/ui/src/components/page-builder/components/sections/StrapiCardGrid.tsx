import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { badgeClass } from "@/lib/badges"
import { CONTENT_MAX_W, SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

type Card = NonNullable<Data.Component<"sections.card-grid">["cards"]>[number]

/**
 * A row of info cards — delivery methods, payment methods, promo tiles.
 * A card with `highlight` turns into the blue veteran-program tile.
 */
export function StrapiCardGrid({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.card-grid">
}) {
  const {
    title,
    subtitle,
    theme,
    align,
    banded,
    columns,
    cardAlign,
    imageStyle,
    cards,
    footnote,
  } = component
  const isLight = theme === "light"
  const isCentered = align === "center"
  const centeredCards = cardAlign === "center"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-10",
        // A banded grid sits on a raised surface, fenced off by hairlines —
        // used to lift a block ("Чому обирають") out of the page flow.
        banded && "border-y",
        isLight
          ? banded
            ? "bg-brand-cream border-brand-line"
            : "bg-brand-sand"
          : banded
            ? "bg-brand-green border-brand-border"
            : "bg-brand-surface",
        banded && "py-16"
      )}
    >
      <div className={CONTENT_MAX_W}>
        {title ? (
          <h2
            className={cn(
              "mb-7 text-[30px] leading-tight font-bold min-[600px]:text-[34px]",
              isCentered && (subtitle ? "mb-3" : "mb-10") + " text-center",
              isLight
                ? "font-bitter text-brand-forest"
                : "font-oswald text-brand-cream tracking-[0.02em] uppercase min-[600px]:text-[38px]"
            )}
          >
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p
            className={cn(
              "mb-10 text-base",
              isCentered && "text-center",
              isLight ? "text-brand-sage" : "text-brand-muted"
            )}
          >
            {subtitle}
          </p>
        ) : null}

        <div
          className={cn(
            "grid gap-5.5 min-[640px]:grid-cols-2",
            columns === "four"
              ? "min-[1024px]:grid-cols-4"
              : "min-[1024px]:grid-cols-3"
          )}
        >
          {cards?.map((card) => (
            <InfoCard
              key={card.id}
              card={card}
              isLight={isLight}
              centered={centeredCards}
              cover={imageStyle === "cover"}
            />
          ))}
        </div>

        {footnote ? (
          <p
            className={cn(
              "mt-5.5 rounded-xl px-6.5 py-5 text-[15.5px]",
              isLight
                ? "bg-brand-forest text-brand-sand"
                : "bg-brand-surface border-brand-border text-brand-nav border"
            )}
          >
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  )
}

function InfoCard({
  card,
  isLight,
  centered,
  cover,
}: {
  readonly card: Card
  readonly isLight: boolean
  readonly centered: boolean
  /** Image as a full-bleed strip across the card top, with the badge on it. */
  readonly cover: boolean
}) {
  const highlight = card.highlight === true

  const badge = card.badge ? (
    <span
      className={cn(
        "font-oswald rounded px-3 py-1.5 text-[11.5px] font-semibold tracking-[0.06em] uppercase",
        badgeClass(card.badgeColor ?? "orange"),
        cover ? "absolute top-3 left-3" : "mb-3 block w-fit"
      )}
    >
      {card.badge}
    </span>
  ) : null

  const body = (
    <>
      {cover ? (
        <span className="bg-brand-surface relative block h-42.5 w-full overflow-hidden">
          {card.image?.media ? (
            <StrapiBasicImage
              component={card.image}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          ) : null}
          {badge}
        </span>
      ) : null}

      <span className={cn("flex flex-1 flex-col", cover && "p-5.5")}>
        {!cover && card.image?.media ? (
          <span
            className={cn(
              "relative mb-4 block overflow-hidden rounded-xl",
              centered ? "mx-auto size-15" : "mb-4.5 size-13"
            )}
          >
            <StrapiBasicImage
              component={card.image}
              fill
              sizes="60px"
              className="object-cover"
            />
          </span>
        ) : null}

        {!cover ? badge : null}

        {card.title ? (
          <span
            className={cn(
              "mb-2 block font-semibold",
              centered
                ? "font-oswald mb-0 text-[18px] tracking-[0.03em] uppercase"
                : "text-[19px]",
              highlight
                ? "text-white"
                : isLight
                  ? "text-brand-forest"
                  : "text-brand-cream"
            )}
          >
            {card.title}
          </span>
        ) : null}

        {card.text ? (
          <span
            className={cn(
              "block text-[15px] leading-[1.65]",
              highlight
                ? "text-brand-mist"
                : isLight
                  ? "text-brand-sage"
                  : "text-brand-nav"
            )}
          >
            {card.text}
            {/* On a highlighted card the whole tile is the link, so the CTA is
              just the tail of the sentence — no separate anchor. */}
            {highlight && card.link?.label ? (
              <span className="text-brand-orange"> {card.link.label}</span>
            ) : null}
          </span>
        ) : null}

        {card.note ? (
          <span
            className={cn(
              "font-oswald mt-2.5 block text-[15px]",
              card.noteColor === "free"
                ? "text-brand-moss"
                : "text-brand-bronze"
            )}
          >
            {card.note}
          </span>
        ) : null}

        {/* A centred tile is the link itself, so it needs no CTA line. */}
        {!highlight && !centered && card.link ? (
          <StrapiLink
            component={card.link}
            unstyled
            className="font-oswald text-brand-gold hover:text-brand-orange mt-auto block w-fit pt-3.5 text-sm font-semibold tracking-[0.04em] uppercase transition-colors"
          />
        ) : null}
      </span>
    </>
  )

  const className = cn(
    "flex flex-col overflow-hidden rounded-xl border transition-colors",
    cover ? "" : "p-7.5",
    centered && "text-center",
    highlight
      ? "bg-brand-steel border-brand-steel-line hover:border-brand-orange"
      : isLight
        ? "bg-brand-paper border-brand-line"
        : "bg-brand-green border-brand-border",
    // Whole-tile links get a hover affordance.
    (highlight || centered) && card.link && "hover:border-brand-orange"
  )

  const isWholeTileLink = (highlight || centered) && card.link != null

  return isWholeTileLink ? (
    <StrapiLink component={card.link} unstyled className={className}>
      {body}
    </StrapiLink>
  ) : (
    <article className={className}>{body}</article>
  )
}

StrapiCardGrid.displayName = "StrapiCardGrid"

export default StrapiCardGrid
