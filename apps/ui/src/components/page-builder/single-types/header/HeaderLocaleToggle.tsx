"use client"

import type { Locale } from "next-intl"

import { routing, usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"

const shortLabel: Record<Locale, string> = {
  uk: "UA",
  en: "EN",
}

/**
 * Minimal inline locale toggle ("UA / EN") matching the ЛінОк header design.
 */
export function HeaderLocaleToggle({ locale }: { readonly locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (code: Locale) =>
    // Not String#replace — this is the next-intl router's navigation method.
    // eslint-disable-next-line unicorn/no-unsafe-string-replacement
    router.replace(pathname, { locale: code })

  // Default locale first (UA), then the rest.
  const ordered: Locale[] = [
    routing.defaultLocale,
    ...routing.locales.filter((l) => l !== routing.defaultLocale),
  ]

  return (
    <div className="font-oswald text-brand-subtle flex items-center gap-1.5 text-[13px] tracking-[0.04em]">
      {ordered.map((code, index) => (
        <span key={code} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => switchTo(code)}
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
