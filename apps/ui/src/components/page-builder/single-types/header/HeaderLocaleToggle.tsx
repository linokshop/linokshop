"use client"

import type { Locale } from "next-intl"
import { useTransition } from "react"

import { routing, usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"

const shortLabel: Record<Locale, string> = {
  uk: "UA",
  ru: "RU",
}

/**
 * Minimal inline locale toggle ("UA / RU") matching the ЛінОк header design.
 * Search params (catalog filters, pagination) are carried across the switch so
 * changing language never drops the user's current filters. The query string is
 * read from `window.location` inside the click handler rather than via
 * `useSearchParams()` — the hook would force a Suspense boundary on every
 * statically prerendered page (the header is global), which breaks the build.
 */
export function HeaderLocaleToggle({ locale }: { readonly locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchTo = (code: Locale) => {
    if (code === locale) {
      return
    }
    const query = typeof window === "undefined" ? "" : window.location.search
    const href = query ? `${pathname}${query}` : pathname
    startTransition(() =>
      // Not String#replace — this is the next-intl router's navigation method.
      // eslint-disable-next-line unicorn/no-unsafe-string-replacement
      router.replace(href, { locale: code })
    )
  }

  // Default locale first (UA), then the rest.
  const ordered: Locale[] = [
    routing.defaultLocale,
    ...routing.locales.filter((l) => l !== routing.defaultLocale),
  ]

  return (
    <div
      className={cn(
        "font-oswald text-brand-subtle flex items-center gap-1.5 text-[13px] tracking-[0.04em]",
        isPending && "opacity-60"
      )}
    >
      {ordered.map((code, index) => (
        <span key={code} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => switchTo(code)}
            disabled={isPending}
            aria-current={code === locale ? "true" : undefined}
            className={cn(
              "cursor-pointer uppercase transition-colors",
              code === locale
                ? "font-bold text-white"
                : "hover:text-brand-cream"
            )}
          >
            {shortLabel[code]}
          </button>
          {index < ordered.length - 1 ? <span aria-hidden>/</span> : null}
        </span>
      ))}
    </div>
  )
}

export default HeaderLocaleToggle
