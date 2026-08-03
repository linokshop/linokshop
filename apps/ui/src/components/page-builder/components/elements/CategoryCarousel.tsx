"use client"

import type { ReactNode } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ARROW_CLASS =
  "static size-10 translate-y-0 rounded-md border-brand-border bg-brand-green text-brand-cream hover:bg-brand-green hover:border-brand-orange hover:text-brand-orange disabled:opacity-30"

/**
 * Category rail: reachable by swipe (embla is touch-native) or the arrows by the
 * heading. Same shape as {@link ProductCarousel} but the slides are narrower —
 * there are many more categories than a product rail shows.
 *
 * The widths are deliberately a shade under 1/2, 1/3 and 1/6 so the next tile is
 * cut off at the edge rather than ending flush. That sliver is what tells a
 * reader the row continues — on mobile it is the only such cue, because the
 * arrows are hidden below 900px.
 */
export function CategoryCarousel({
  title,
  link,
  items,
  showArrows = true,
}: {
  readonly title?: ReactNode
  readonly link?: ReactNode
  readonly items: readonly ReactNode[]
  /** Off when everything already fits — arrows that can never move are noise. */
  readonly showArrows?: boolean
}) {
  return (
    <Carousel opts={{ align: "start", containScroll: "trimSnaps" }}>
      <div className="mb-6.5 flex items-end justify-between gap-4">
        {title}
        <div className="flex shrink-0 items-center gap-5">
          {link}
          {showArrows ? (
            <div className="hidden gap-2 min-[900px]:flex">
              <CarouselPrevious className={ARROW_CLASS} />
              <CarouselNext className={ARROW_CLASS} />
            </div>
          ) : null}
        </div>
      </div>

      <CarouselContent className="-ml-4.5">
        {items.map((item, i) => (
          <CarouselItem
            // Slides are a fixed, ordered list from the CMS — index is stable.
            key={i}
            className="basis-[42%] pl-4.5 min-[600px]:basis-[29%] min-[1024px]:basis-[15.5%]"
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default CategoryCarousel
