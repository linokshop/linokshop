"use client"

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/styles"

export interface GalleryImage {
  readonly url: string
  readonly alt: string
}

export function ProductGallery({
  images,
  badge,
  badgeClassName,
}: {
  readonly images: readonly GalleryImage[]
  readonly badge?: string | null
  readonly badgeClassName?: string
}) {
  const [active, setActive] = useState(0)
  const current = images[active]

  return (
    <div>
      <div className="bg-brand-green border-brand-border relative h-95 overflow-hidden rounded-xl border min-[900px]:h-120">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            className="object-cover"
            priority
            unoptimized
          />
        ) : null}
        {badge ? (
          <span
            className={cn(
              "font-oswald absolute top-4 left-4 rounded px-3 py-1.5 text-xs font-bold uppercase",
              badgeClassName
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3.5 grid grid-cols-4 gap-3.5">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "bg-brand-green relative h-24 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors",
                index === active
                  ? "border-brand-bronze"
                  : "border-brand-border hover:border-brand-orange"
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ProductGallery
