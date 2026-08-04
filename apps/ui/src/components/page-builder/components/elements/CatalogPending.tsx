"use client"

import { createContext, useContext, useMemo, useTransition } from "react"

interface CatalogPending {
  readonly isPending: boolean
  readonly startTransition: (callback: () => void) => void
}

const CatalogPendingContext = createContext<CatalogPending | null>(null)

/**
 * One `useTransition` shared between the filter controls and the results
 * grid beside them. `CatalogFilters` wraps its `router.push` calls in the
 * `startTransition` this exposes; `CatalogResultsFade` dims while that same
 * transition is pending. A checkbox already flips the moment it's clicked —
 * this is what tells the reader the *grid* hasn't caught up yet.
 */
export function CatalogPendingProvider({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [isPending, startTransition] = useTransition()
  const value = useMemo(
    () => ({ isPending, startTransition }),
    [isPending, startTransition]
  )

  return (
    <CatalogPendingContext.Provider value={value}>
      {children}
    </CatalogPendingContext.Provider>
  )
}

export function useCatalogPending(): CatalogPending {
  const ctx = useContext(CatalogPendingContext)

  // No provider above (e.g. this filter bar were ever reused standalone) —
  // degrade to a plain, unwrapped call rather than throwing.
  return ctx ?? { isPending: false, startTransition: (cb) => cb() }
}

/** Fades the results while a filter change is still in flight. */
export function CatalogResultsFade({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const { isPending } = useCatalogPending()

  return (
    <div
      aria-busy={isPending}
      className={
        isPending
          ? "pointer-events-none opacity-50 transition-opacity delay-150"
          : "transition-opacity"
      }
    >
      {children}
    </div>
  )
}
