import Image from "next/image"

import AppLink from "@/components/elementary/AppLink"
import { cn } from "@/lib/styles"

export interface CategoryTile {
  readonly documentId: string
  readonly name: string
  readonly imageUrl?: string
  readonly href: string
  readonly count: number
}

/**
 * A grid of picture tiles linking one step deeper into the catalog tree —
 * categories on `/catalog`, subcategories on a category page, sub-subcategories
 * on a subcategory page. Same widget at every level, so "pick the next branch"
 * always looks and behaves the same regardless of how deep you already are.
 */
export function CategoryTileGrid({
  tiles,
  itemsLabel,
  className,
}: {
  readonly tiles: readonly CategoryTile[]
  /** Formats a tile's product count into its caption, e.g. "12 товарів". */
  readonly itemsLabel: (count: number) => string
  readonly className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3.5 min-[600px]:grid-cols-4 min-[1024px]:grid-cols-6",
        className
      )}
    >
      {tiles.map((tile) => (
        <AppLink
          key={tile.documentId}
          href={tile.href}
          unstyled
          className="border-brand-border bg-brand-green hover:border-brand-field-hover group/tile block overflow-hidden rounded-xl border transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
        >
          <span className="bg-brand-surface relative block h-26 w-full overflow-hidden">
            {tile.imageUrl ? (
              <Image
                src={tile.imageUrl}
                alt={tile.name}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 600px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover/tile:scale-105"
                unoptimized
              />
            ) : null}
          </span>
          <span className="block p-3">
            <span className="font-oswald text-brand-cream block text-[13.5px] tracking-[0.03em] uppercase">
              {tile.name}
            </span>
            <span className="text-brand-muted mt-1 block text-[12px]">
              {itemsLabel(tile.count)}
            </span>
          </span>
        </AppLink>
      ))}
    </div>
  )
}

export default CategoryTileGrid
