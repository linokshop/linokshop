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
 * Product rail: 4 tiles per view on desktop, 2 on mobile, the rest reachable by
 * swipe or by the arrows next to the heading.
 *
 * `title`, `link` and `items` are rendered on the server and passed through as
 * elements — the client boundary is only here, around embla. The arrows have to
 * live inside <Carousel> (they read its context), which is why the heading row
 * belongs to this component rather than to the section.
 */
export function ProductCarousel({
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
      <div className="mb-7.5 flex items-end justify-between gap-4">
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

      <CarouselContent className="-ml-3.5 min-[600px]:-ml-5.5">
        {items.map((item, i) => (
          <CarouselItem
            // Slides are a fixed, ordered list from the CMS — index is stable.
            key={i}
            className="basis-1/2 pl-3.5 min-[600px]:pl-5.5 min-[1024px]:basis-1/4"
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default ProductCarousel
