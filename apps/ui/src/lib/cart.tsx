"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

const STORAGE_KEY = "linok.cart.v1"

export interface CartItem {
  readonly slug: string
  readonly name: string
  /** Hryvnias, as stored in Strapi. */
  readonly price: number
  readonly imageUrl?: string
  readonly option?: string
  readonly quantity: number
}

/**
 * The cart is an external store (localStorage), not React state — that is what
 * `useSyncExternalStore` is for. It also solves hydration for free: the server
 * and the hydrating client both read the empty snapshot, and React re-renders
 * with the stored cart right after mount.
 */
const EMPTY: readonly CartItem[] = []

let items: readonly CartItem[] = EMPTY
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded) return
  loaded = true
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) items = JSON.parse(stored) as CartItem[]
  } catch {
    // Corrupt or unavailable storage must not take the page down.
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function write(next: readonly CartItem[]) {
  items = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private mode / quota — the cart just will not survive a reload.
  }
  emit()
}

function subscribe(listener: () => void) {
  load()
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => items
const getServerSnapshot = () => EMPTY

/**
 * A cart line is identified by product + chosen option, not by product alone —
 * two sizes of the same rod are two lines. Keying by slug alone silently folded
 * the second variant into the first.
 */
export const lineId = (item: { slug: string; option?: string }) =>
  `${item.slug}::${item.option ?? ""}`

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity = 1
): void {
  const id = lineId(item)
  const existing = items.some((i) => lineId(i) === id)

  write(
    existing
      ? items.map((i) =>
          lineId(i) === id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...items, { ...item, quantity }]
  )
}

export function setCartQuantity(id: string, quantity: number): void {
  write(
    quantity < 1
      ? items.filter((i) => lineId(i) !== id)
      : items.map((i) => (lineId(i) === id ? { ...i, quantity } : i))
  )
}

export function removeFromCart(id: string): void {
  write(items.filter((i) => lineId(i) !== id))
}

export function clearCart(): void {
  write(EMPTY)
}

export function useCart() {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const count = useMemo(
    () => current.reduce((sum, i) => sum + i.quantity, 0),
    [current]
  )
  const total = useMemo(
    () => current.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [current]
  )

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) =>
      addToCart(item, quantity),
    []
  )

  return {
    items: current,
    count,
    total,
    add,
    setQuantity: setCartQuantity,
    remove: removeFromCart,
    clear: clearCart,
  }
}
