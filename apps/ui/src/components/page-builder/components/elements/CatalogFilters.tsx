"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { cn } from "@/lib/styles"

export interface FilterOption {
  readonly slug: string
  readonly name: string
  readonly count?: number
}

/**
 * The filter state lives in the URL, not in React state — so a filtered view can
 * be shared, bookmarked and rendered on the server, and the back button works.
 * Local state here only holds what the user is editing before pressing "apply".
 */
export function CatalogFilters({
  categories,
  brands,
  labels,
}: {
  readonly categories: readonly FilterOption[]
  readonly brands: readonly FilterOption[]
  readonly labels: {
    readonly categories: string
    readonly price: string
    readonly brand: string
    readonly inStock: string
    readonly apply: string
    readonly reset: string
  }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const readList = (key: string) =>
    (searchParams.get(key) ?? "").split(",").filter(Boolean)

  const [selectedCategories, setSelectedCategories] = useState(() =>
    readList("category")
  )
  const [selectedBrands, setSelectedBrands] = useState(() => readList("brand"))
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "")
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "")
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true")

  const toggle = (
    list: string[],
    setList: (next: string[]) => void,
    slug: string
  ) =>
    setList(
      list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
    )

  const apply = () => {
    const params = new URLSearchParams()
    // The sort order survives a filter change; the page number cannot — page 5
    // of the old result set may not exist in the new one.
    const sort = searchParams.get("sort")
    if (sort) params.set("sort", sort)

    if (selectedCategories.length) {
      params.set("category", selectedCategories.join(","))
    }
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","))
    if (priceMin.trim()) params.set("priceMin", priceMin.trim())
    if (priceMax.trim()) params.set("priceMax", priceMax.trim())
    if (inStock) params.set("inStock", "true")

    router.push(params.size ? `?${params.toString()}` : "?", { scroll: false })
  }

  const reset = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceMin("")
    setPriceMax("")
    setInStock(false)
    router.push("?", { scroll: false })
  }

  return (
    <aside className="border-brand-border bg-brand-green rounded-[10px] border p-6.5">
      <FilterHeading>{labels.categories}</FilterHeading>
      <div className="border-brand-border mb-5 border-b pb-5">
        {categories.map((category) => (
          <Checkbox
            key={category.slug}
            checked={selectedCategories.includes(category.slug)}
            onToggle={() =>
              toggle(selectedCategories, setSelectedCategories, category.slug)
            }
            label={category.name}
            count={category.count}
          />
        ))}
      </div>

      <FilterHeading>{labels.price}</FilterHeading>
      <div className="border-brand-border mb-5 flex gap-2.5 border-b pb-5.5">
        <PriceInput
          value={priceMin}
          onChange={setPriceMin}
          placeholder="від 0"
          aria-label={`${labels.price} — від`}
        />
        <PriceInput
          value={priceMax}
          onChange={setPriceMax}
          placeholder="до 10000"
          aria-label={`${labels.price} — до`}
        />
      </div>

      {brands.length ? (
        <>
          <FilterHeading>{labels.brand}</FilterHeading>
          <div className="border-brand-border mb-5 border-b pb-5">
            {brands.map((brand) => (
              <Checkbox
                key={brand.slug}
                checked={selectedBrands.includes(brand.slug)}
                onToggle={() =>
                  toggle(selectedBrands, setSelectedBrands, brand.slug)
                }
                label={brand.name}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="mb-5.5">
        <Checkbox
          checked={inStock}
          onToggle={() => setInStock(!inStock)}
          label={labels.inStock}
        />
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={apply}
          className="bg-brand-bronze font-oswald hover:bg-brand-orange flex-1 cursor-pointer rounded-md px-3 py-3 text-sm tracking-[0.04em] text-white uppercase transition-colors"
        >
          {labels.apply}
        </button>
        <button
          type="button"
          onClick={reset}
          className="border-brand-border text-brand-muted hover:border-brand-orange hover:text-brand-cream cursor-pointer rounded-md border px-3.5 py-3 text-sm transition-colors"
        >
          {labels.reset}
        </button>
      </div>
    </aside>
  )
}

function FilterHeading({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="font-oswald text-brand-sand mb-4 text-[15px] tracking-[0.08em] uppercase">
      {children}
    </div>
  )
}

function Checkbox({
  checked,
  onToggle,
  label,
  count,
}: {
  readonly checked: boolean
  readonly onToggle: () => void
  readonly label: string
  readonly count?: number
}) {
  return (
    <label className="text-brand-nav flex cursor-pointer items-center gap-2.5 py-1.5 text-[14.5px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          // 8px (the theme's `rounded`) on an 18px box reads as a circle, i.e.
          // a radio button — a checkbox must look like a checkbox.
          "flex size-4.5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] text-xs text-white transition-colors",
          checked
            ? "bg-brand-bronze border-brand-bronze"
            : "border-brand-check bg-transparent"
        )}
      >
        {checked ? "✓" : null}
      </span>
      {label}
      {count != null ? (
        <span className="text-brand-faded ml-auto">{count}</span>
      ) : null}
    </label>
  )
}

function PriceInput({
  value,
  onChange,
  placeholder,
  ...rest
}: {
  readonly value: string
  readonly onChange: (next: string) => void
  readonly placeholder: string
  readonly "aria-label": string
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="bg-brand-surface text-brand-nav placeholder:text-brand-muted focus:border-brand-bronze border-brand-field w-full rounded-md border px-3 py-2.5 text-sm outline-none"
      {...rest}
    />
  )
}

export default CatalogFilters
