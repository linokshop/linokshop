"use client"

import { useRouter, useSearchParams } from "next/navigation"

export const SORT_OPTIONS = [
  { value: "popular", label: "За популярністю" },
  { value: "price-asc", label: "Спочатку дешевші" },
  { value: "price-desc", label: "Спочатку дорожчі" },
  { value: "new", label: "Новинки" },
] as const

export function CatalogSort({ current }: { readonly current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <label className="flex items-center gap-2.5">
      <span className="text-brand-muted text-sm">Сортувати:</span>
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
        className="bg-brand-surface text-brand-cream font-oswald focus:border-brand-bronze cursor-pointer rounded-md border border-[#2f4f3a] px-3.5 py-2.5 text-sm tracking-[0.03em] uppercase outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CatalogSort
