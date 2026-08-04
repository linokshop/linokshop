"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { PriceSlider } from "@/components/page-builder/components/elements/PriceSlider"
import { SECTION_X_PADDING } from "@/lib/layout"
import { Link, usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"

export interface FilterOption {
  readonly slug: string
  readonly name: string
  readonly count?: number
}

/** A category and its subcategories — the nested category filter. */
export interface CategoryGroup {
  readonly slug: string
  readonly name: string
  readonly subcategories: readonly FilterOption[]
}

/** A filterable product property and the options products actually carry. */
export interface AttributeGroup {
  readonly slug: string
  readonly name: string
  readonly values: readonly FilterOption[]
}

/**
 * The filter state lives in the URL, not in React state — so a filtered view can
 * be shared, bookmarked and rendered on the server, and the back button works.
 * Local state here only holds what the user is editing before pressing "apply".
 *
 * The category list has two modes. On the whole catalogue it is a multi-select
 * filter (checkboxes, applied on demand). Inside a subcategory the choice is
 * already made by the URL, so it becomes plain navigation — links, with the
 * current one marked — letting the reader step sideways to a sibling instead of
 * having to go back. Mixing the two would put the path and a checkbox in charge
 * of the same thing.
 */
export function CatalogFilters({
  categoryTree,
  brands,
  labels,
  currentSubcategory,
  attributeGroups = [],
  priceBounds,
}: {
  readonly categoryTree: readonly CategoryGroup[]
  readonly brands: readonly FilterOption[]
  /** Ends of the price slider — the cheapest and dearest product in this view. */
  readonly priceBounds: { readonly min: number; readonly max: number }
  /** Per-property facets; only present inside a subcategory. */
  readonly attributeGroups?: readonly AttributeGroup[]
  /** Set on a subcategory page: switches the category list to navigation. */
  readonly currentSubcategory?: string
  readonly labels: {
    readonly categories: string
    readonly price: string
    readonly brand: string
    readonly inStock: string
    readonly apply: string
    readonly reset: string
    readonly priceFromPlaceholder: string
    readonly priceToPlaceholder: string
    readonly priceFromAria: string
    readonly priceToAria: string
  }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const readList = (key: string) =>
    (searchParams.get(key) ?? "").split(",").filter(Boolean)

  const [selectedCategories, setSelectedCategories] = useState(() =>
    readList("subcategory")
  )
  const [selectedBrands, setSelectedBrands] = useState(() => readList("brand"))
  const [selectedValues, setSelectedValues] = useState(() => readList("attr"))
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
      params.set("subcategory", selectedCategories.join(","))
    }
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","))
    if (selectedValues.length) params.set("attr", selectedValues.join(","))
    if (priceMin.trim()) params.set("priceMin", priceMin.trim())
    if (priceMax.trim()) params.set("priceMax", priceMax.trim())
    if (inStock) params.set("inStock", "true")

    // Object form: a `"/catalog?brand=…"` string loses its query on the way
    // through the localised router, and a bare `?…` lands on the home page.
    router.push(
      { pathname, query: Object.fromEntries(params) },
      { scroll: false }
    )
  }

  const reset = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedValues([])
    setPriceMin("")
    setPriceMax("")
    setInStock(false)
    router.push(pathname, { scroll: false })
  }

  return (
    <aside
      className={cn(
        SECTION_X_PADDING,
        // Vertical padding stays its own value; only the horizontal side
        // borrows the page gutter, so this card's text lines up with the
        // heading above it instead of drifting in by its own border-inset.
        "border-brand-border bg-brand-green rounded-[10px] border py-6.5"
      )}
    >
      {categoryTree.length ? (
        <>
          <FilterHeading>{labels.categories}</FilterHeading>
          <div className="border-brand-border mb-5 border-b pb-5">
            {categoryTree.map((group) => (
              <div key={group.slug} className="mb-4 last:mb-0">
                <div className="font-oswald text-brand-cream mb-1 text-[13.5px] tracking-[0.04em] uppercase">
                  {group.name}
                </div>
                <div className="border-brand-border ml-0.5 border-l pl-2.5">
                  {group.subcategories.map((sub) =>
                    currentSubcategory ? (
                      <SubcategoryLink
                        key={sub.slug}
                        href={`/category/${group.slug}/${sub.slug}`}
                        label={sub.name}
                        count={sub.count}
                        active={sub.slug === currentSubcategory}
                      />
                    ) : (
                      <Checkbox
                        key={sub.slug}
                        checked={selectedCategories.includes(sub.slug)}
                        onToggle={() =>
                          toggle(
                            selectedCategories,
                            setSelectedCategories,
                            sub.slug
                          )
                        }
                        label={sub.name}
                        count={sub.count}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <FilterHeading>{labels.price}</FilterHeading>
      <div className="border-brand-border mb-5 border-b pb-5.5">
        <div className="mb-4 flex gap-2.5">
          <PriceInput
            value={priceMin}
            onChange={setPriceMin}
            placeholder={labels.priceFromPlaceholder}
            aria-label={`${labels.price} — ${labels.priceFromAria}`}
          />
          <PriceInput
            value={priceMax}
            onChange={setPriceMax}
            placeholder={labels.priceToPlaceholder}
            aria-label={`${labels.price} — ${labels.priceToAria}`}
          />
        </div>
        {/* The boxes and the slider are two views of one range — typing moves the
            handles, dragging fills the boxes. */}
        <PriceSlider
          min={priceBounds.min}
          max={priceBounds.max}
          from={priceMin.trim() ? Number(priceMin) : priceBounds.min}
          to={priceMax.trim() ? Number(priceMax) : priceBounds.max}
          onChange={({ from, to }) => {
            setPriceMin(String(from))
            setPriceMax(String(to))
          }}
          labelFrom={`${labels.price} — ${labels.priceFromAria}`}
          labelTo={`${labels.price} — ${labels.priceToAria}`}
        />
      </div>

      {/* One block per property, e.g. Довжина with its lengths. Only shown
          inside a subcategory, where a shared set of properties exists. */}
      {attributeGroups.map((group) => (
        <div key={group.slug}>
          <FilterHeading>{group.name}</FilterHeading>
          <div className="border-brand-border mb-5 border-b pb-5">
            {group.values.map((value) => (
              <Checkbox
                key={value.slug}
                checked={selectedValues.includes(value.slug)}
                onToggle={() =>
                  toggle(selectedValues, setSelectedValues, value.slug)
                }
                label={value.name}
                count={value.count}
              />
            ))}
          </div>
        </div>
      ))}

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
                count={brand.count}
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

/**
 * A sibling subcategory on a subcategory page. A link, not a checkbox: the URL
 * owns the choice here, so clicking navigates rather than staging a filter.
 */
function SubcategoryLink({
  href,
  label,
  count,
  active,
}: {
  readonly href: string
  readonly label: string
  readonly count?: number
  readonly active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 py-1.5 text-[14.5px] transition-colors",
        active
          ? "text-brand-gold font-semibold"
          : "text-brand-nav hover:text-brand-cream"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          active ? "bg-brand-bronze" : "bg-transparent"
        )}
      />
      {label}
      {count == null ? null : (
        <span className="text-brand-faded ml-auto">{count}</span>
      )}
    </Link>
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
      // Text rather than `type="number"`: the number spinners are noise in a
      // price box, and a number field also changes value when the wheel is
      // scrolled over it. `inputMode` still brings up the numeric keypad.
      type="text"
      inputMode="numeric"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value.replaceAll(/\D/g, ""))}
      className="bg-brand-surface text-brand-nav placeholder:text-brand-muted focus:border-brand-bronze border-brand-field w-full rounded-md border px-3 py-2.5 text-sm outline-none"
      {...rest}
    />
  )
}

export default CatalogFilters
