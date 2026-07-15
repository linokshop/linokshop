"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { type CartItem, useCart } from "@/lib/cart"

/**
 * The "+" on a product tile. It used to be decorative — a button that looks
 * clickable and does nothing is worse than no button, so it now really adds the
 * product to the cart.
 */
export function AddToCartIconButton({
  item,
}: {
  readonly item: Omit<CartItem, "quantity" | "option">
}) {
  const { add } = useCart()
  const tc = useTranslations("shop.common")
  const [added, setAdded] = useState(false)

  return (
    <button
      type="button"
      aria-label={tc("addToCartFor", { name: item.name })}
      onClick={(event) => {
        // The whole tile is a link to the product — adding must not navigate.
        event.preventDefault()
        event.stopPropagation()
        add(item)
        setAdded(true)
      }}
      className="bg-brand-bronze hover:bg-brand-orange flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-white transition-colors min-[600px]:size-10"
    >
      {added ? "✓" : "+"}
    </button>
  )
}

export default AddToCartIconButton
