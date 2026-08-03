"use client"

import { Fragment } from "react"

import { Link, usePathname } from "@/lib/navigation"
import { cn } from "@/lib/styles"

/** The anchor a page change lands on — the results, not the top of the page. */
export const CATALOG_RESULTS_ID = "catalog-results"

/** Pages either side of the current one that are always offered. */
const WINDOW = 2

const BOX =
  "flex size-10.5 items-center justify-center rounded-md border transition-colors"
const IDLE =
  "bg-brand-green border-brand-border text-brand-nav hover:border-brand-orange"

/**
 * Catalog paging.
 *
 * Hrefs are `{ pathname, query }` objects rather than strings on purpose. A bare
 * `?page=2` is rewritten to `/?page=2` (the home page) by the link formatter, and
 * a `"/catalog?page=2"` string loses its query on the way through the localised
 * router — only the object form keeps both the locale prefix and the params.
 *
 * Each link carries a hash so the reader lands on the products they just paged
 * to; without it the browser jumps to the top of the document and the grid has
 * to be scrolled back down to.
 */
export function CatalogPagination({
  page,
  pageCount,
  searchParams,
  navLabel,
  prevLabel,
  nextLabel,
}: {
  readonly page: number
  readonly pageCount: number
  readonly searchParams: Record<string, string | string[] | undefined>
  readonly navLabel: string
  readonly prevLabel: string
  readonly nextLabel: string
}) {
  const pathname = usePathname()

  const hrefFor = (target: number) => {
    const query: Record<string, string> = {}
    for (const [key, value] of Object.entries(searchParams)) {
      const single = Array.isArray(value) ? value[0] : value
      if (key === "page" || single == null) continue
      query[key] = single
    }
    if (target > 1) query.page = String(target)

    return { pathname, query, hash: CATALOG_RESULTS_ID }
  }

  // A 2500-product catalog runs to dozens of pages — rendering every one of them
  // is a wall of numbers. Show the first, the last, and a window around current.
  const shown = new Set([1, pageCount])
  for (let offset = -WINDOW; offset <= WINDOW; offset++) {
    const target = page + offset
    if (target >= 1 && target <= pageCount) {
      shown.add(target)
    }
  }
  const pages = [...shown].sort((a, b) => a - b)

  return (
    <nav
      aria-label={navLabel}
      className="font-oswald mt-10 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label={prevLabel}
          className={cn(BOX, IDLE)}
        >
          ←
        </Link>
      ) : null}

      {pages.map((target, index) => (
        <Fragment key={target}>
          {/* A gap in the sequence means pages were skipped — say so. */}
          {index > 0 && target - (pages[index - 1] ?? 0) > 1 ? (
            <span aria-hidden className="text-brand-muted px-1">
              …
            </span>
          ) : null}
          <Link
            href={hrefFor(target)}
            aria-current={target === page ? "page" : undefined}
            className={cn(
              BOX,
              target === page
                ? "bg-brand-bronze border-brand-bronze text-white"
                : IDLE
            )}
          >
            {target}
          </Link>
        </Fragment>
      ))}

      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label={nextLabel}
          className={cn(BOX, IDLE)}
        >
          →
        </Link>
      ) : null}
    </nav>
  )
}

export default CatalogPagination
