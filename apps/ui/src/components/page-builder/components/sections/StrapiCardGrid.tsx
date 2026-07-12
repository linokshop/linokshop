import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
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
  const { title, theme, cards, footnote } = component
  const isLight = theme === "light"

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-10",
        isLight ? "bg-brand-sand" : "bg-brand-green"
      )}
    >
      <div className="mx-auto max-w-[1320px]">
        {title ? (
          <h2
            className={cn(
              "mb-7 text-[32px] leading-tight font-bold",
              isLight
                ? "font-bitter text-brand-forest"
                : "font-oswald text-brand-cream uppercase"
            )}
          >
            {title}
          </h2>
        ) : null}

        <div className="grid gap-5.5 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
          {cards?.map((card) => (
            <InfoCard key={card.id} card={card} isLight={isLight} />
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
}: {
  readonly card: Card
  readonly isLight: boolean
}) {
  const highlight = card.highlight === true

  const body = (
    <>
      {card.image?.media ? (
        <span className="relative mb-4.5 block size-13 overflow-hidden rounded-[10px]">
          <StrapiBasicImage
            component={card.image}
            fill
            sizes="52px"
            className="object-cover"
          />
        </span>
      ) : null}

      {card.badge ? (
        <span className="font-oswald bg-brand-orange text-brand-navy mb-3 block w-fit rounded px-3 py-1.5 text-[11.5px] font-semibold tracking-[0.06em] uppercase">
          {card.badge}
        </span>
      ) : null}

      {card.title ? (
        <span
          className={cn(
            "mb-2 block text-[19px] font-semibold",
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
            card.noteColor === "free" ? "text-brand-moss" : "text-brand-bronze"
          )}
        >
          {card.note}
        </span>
      ) : null}

      {!highlight && card.link ? (
        <StrapiLink
          component={card.link}
          unstyled
          className="font-oswald text-brand-orange hover:text-brand-bronze mt-3 block w-fit text-sm font-semibold tracking-wide uppercase transition-colors"
        />
      ) : null}
    </>
  )

  const className = cn(
    "flex flex-col rounded-xl border p-7.5 transition-colors",
    highlight
      ? "bg-brand-steel border-brand-steel hover:border-brand-orange"
      : isLight
        ? "bg-brand-paper border-brand-line"
        : "bg-brand-surface border-brand-border"
  )

  return highlight && card.link ? (
    <StrapiLink component={card.link} unstyled className={className}>
      {body}
    </StrapiLink>
  ) : (
    <article className={className}>{body}</article>
  )
}

StrapiCardGrid.displayName = "StrapiCardGrid"

export default StrapiCardGrid
