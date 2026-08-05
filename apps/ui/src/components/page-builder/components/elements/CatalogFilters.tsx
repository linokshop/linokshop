"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useCatalogPending } from "@/components/page-builder/components/elements/CatalogPending"
import { PriceSlider } from "@/components/page-builder/components/elements/PriceSlider"
import { SECTION_X_PADDING } from "@/lib/layout"
import { Link, usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"

export interface FilterOption {
  readonly slug: string
  readonly name: string
  readonly count?: number
}

/** A subcategory and its optional sub-subcategories — the third, leaf level. */
export interface SubcategoryOption extends FilterOption {
  readonly subSubcategories?: readonly FilterOption[]
}

/** A category and its subcategories — the nested category filter. */
export interface CategoryGroup {
  readonly slug: string
  readonly name: string
  readonly subcategories: readonly SubcategoryOption[]
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
 * Local state only mirrors it for instant checkbox feedback; every toggle pushes
 * straight to the URL. Price is the one exception — it debounces, or every
 * keystroke would refetch the grid.
 *
 * The category/subcategory/sub-subcategory tree is pure navigation, always —
 * plain links, never checkboxes, on every page including the unfiltered
 * catalogue. Category is "where am I", decided by the URL path; price, brand,
 * stock and attributes are "what do I want", decided by checkboxes that refine
 * the current page without navigating. Keeping those two questions on two
 * different controls is what makes the sidebar predictable from page to page.
 */
export function CatalogFilters({
  categoryTree,
  brands,
  labels,
  currentCategory,
  currentSubcategory,
  currentSubSubcategory,
  attributeGroups = [],
  priceBounds,
}: {
  readonly categoryTree: readonly CategoryGroup[]
  readonly brands: readonly FilterOption[]
  /** Ends of the price slider — the cheapest and dearest product in this view. */
  readonly priceBounds: { readonly min: number; readonly max: number }
  /** Per-property facets; only present inside a subcategory. */
  readonly attributeGroups?: readonly AttributeGroup[]
  /** Top-level category the current page belongs to, if any — highlights it
   *  and expands its subcategories in the tree. */
  readonly currentCategory?: string
  /** Set on a subcategory (or deeper) page: highlights that level in the tree. */
  readonly currentSubcategory?: string
  /** Set on a sub-subcategory page: highlights that leaf in the tree. */
  readonly currentSubSubcategory?: string
  readonly labels: {
    readonly categories: string
    readonly price: string
    readonly brand: string
    readonly inStock: string
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
  const { startTransition } = useCatalogPending()

  const readList = (key: string) =>
    (searchParams.get(key) ?? "").split(",").filter(Boolean)

  const [selectedBrands, setSelectedBrands] = useState(() => readList("brand"))
  const [selectedValues, setSelectedValues] = useState(() => readList("attr"))
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "")
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "")
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true")

  /**
   * Pushes the URL from whatever is passed plus whatever isn't — an override
   * wins over current state, so a toggle can push the *next* value without
   * waiting a render for `setState` to land.
   */
  const applyParams = (override: {
    brands?: string[]
    values?: string[]
    priceMin?: string
    priceMax?: string
    inStock?: boolean
  }) => {
    const params = new URLSearchParams()
    // The sort order survives a filter change; the page number cannot — page 5
    // of the old result set may not exist in the new one.
    const sort = searchParams.get("sort")
    if (sort) params.set("sort", sort)

    const brandSlugs = override.brands ?? selectedBrands
    const values = override.values ?? selectedValues
    const min = override.priceMin ?? priceMin
    const max = override.priceMax ?? priceMax
    const stock = override.inStock ?? inStock

    if (brandSlugs.length) params.set("brand", brandSlugs.join(","))
    if (values.length) params.set("attr", values.join(","))
    if (min.trim()) params.set("priceMin", min.trim())
    if (max.trim()) params.set("priceMax", max.trim())
    if (stock) params.set("inStock", "true")

    // Object form: a `"/catalog?brand=…"` string loses its query on the way
    // through the localised router, and a bare `?…` lands on the home page.
    startTransition(() => {
      router.push(
        { pathname, query: Object.fromEntries(params) },
        { scroll: false }
      )
    })
  }

  const toggle = (
    list: string[],
    setList: (next: string[]) => void,
    slug: string,
    key: "brands" | "values"
  ) => {
    const next = list.includes(slug)
      ? list.filter((s) => s !== slug)
      : [...list, slug]
    setList(next)
    applyParams({ [key]: next })
  }

  const toggleInStock = () => {
    const next = !inStock
    setInStock(next)
    applyParams({ inStock: next })
  }

  // Price debounces rather than pushing per keystroke/drag-frame — skipped on
  // the render that mounts with the URL's own value, so loading a filtered
  // link never fires a redundant push straight back at itself.
  const isFirstPriceRender = useRef(true)
  useEffect(() => {
    if (isFirstPriceRender.current) {
      isFirstPriceRender.current = false

      return
    }
    const id = setTimeout(() => applyParams({}), 500)

    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax])

  const reset = () => {
    setSelectedBrands([])
    setSelectedValues([])
    setPriceMin("")
    setPriceMax("")
    setInStock(false)
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
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
              <div key={group.slug} className="mb-1 last:mb-0">
                <TreeLink
                  href={`/catalog/${group.slug}`}
                  label={group.name}
                  active={group.slug === currentCategory}
                  bold
                />
                {/* Only the current category's own branch is expanded — a
                    collapsed sibling is just this one link, and clicking it
                    is how you get its children to expand instead. */}
                {group.subcategories.length ? (
                  <div className="border-brand-border ml-0.5 border-l pl-2.5">
                    {group.subcategories.map((sub) => (
                      <div key={sub.slug}>
                        <TreeLink
                          href={`/catalog/${group.slug}/${sub.slug}`}
                          label={sub.name}
                          count={sub.count}
                          active={sub.slug === currentSubcategory}
                        />
                        {/* The optional third level — most subcategories have
                            none, so this is usually skipped. */}
                        {sub.subSubcategories?.length ? (
                          <div className="border-brand-border ml-0.5 border-l pl-2.5">
                            {sub.subSubcategories.map((subSub) => (
                              <TreeLink
                                key={subSub.slug}
                                href={`/catalog/${group.slug}/${sub.slug}/${subSub.slug}`}
                                label={subSub.name}
                                count={subSub.count}
                                active={subSub.slug === currentSubSubcategory}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
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
                  toggle(
                    selectedValues,
                    setSelectedValues,
                    value.slug,
                    "values"
                  )
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
                  toggle(
                    selectedBrands,
                    setSelectedBrands,
                    brand.slug,
                    "brands"
                  )
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
          onToggle={toggleInStock}
          label={labels.inStock}
        />
      </div>

      <button
        type="button"
        onClick={reset}
        className="border-brand-border text-brand-muted hover:border-brand-orange hover:text-brand-cream w-full cursor-pointer rounded-md border px-3.5 py-3 text-sm transition-colors"
      >
        {labels.reset}
      </button>
    </aside>
  )
}

/**
 * One row of the category tree, at any of the three levels. Always a link,
 * never a checkbox: category/subcategory/sub-subcategory is navigation, the
 * URL owns the choice, so clicking moves the reader rather than staging a
 * filter on the page they're already on.
 */
function TreeLink({
  href,
  label,
  count,
  active,
  bold = false,
}: {
  readonly href: string
  readonly label: string
  readonly count?: number
  readonly active: boolean
  /** The top-level category row — set apart from its (indented) children. */
  readonly bold?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        // Negative margin + padding: the hover/active fill runs past the
        // text to the row's full width, so the target reads as a row you
        // click, not a label that happens to sit next to a link.
        "-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[14.5px] transition-colors",
        bold && "font-oswald text-[13.5px] tracking-[0.04em] uppercase",
        active
          ? "bg-brand-surface text-brand-gold font-semibold"
          : cn(
              "hover:bg-brand-surface hover:text-brand-cream",
              bold ? "text-brand-cream" : "text-brand-nav"
            )
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          active ? "bg-brand-bronze" : "bg-brand-check"
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
