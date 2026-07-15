"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export const SORT_VALUES = [
  "popular",
  "price-asc",
  "price-desc",
  "new",
] as const

export function CatalogSort({ current }: { readonly current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("shop.catalog")

  const options = [
    { value: "popular", label: t("sortPopular") },
    { value: "price-asc", label: t("sortPriceAsc") },
    { value: "price-desc", label: t("sortPriceDesc") },
    { value: "new", label: t("sortNew") },
  ] as const

  return (
    <label className="flex items-center gap-2.5">
      <span className="text-brand-muted text-sm">{t("sortBy")}</span>
      <select
        value={current}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set("sort", event.target.value)
          // Re-sorting reshuffles everything — page 3 of the old order is
          // meaningless in the new one.
          params.delete("page")
          router.push(`?${params.toString()}`, { scroll: false })
        }}
        className="bg-brand-surface text-brand-cream font-oswald focus:border-brand-bronze border-brand-field cursor-pointer rounded-md border px-3.5 py-2.5 text-sm tracking-[0.03em] uppercase outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CatalogSort
