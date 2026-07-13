"use client"

import Link from "next/link"
import { useState } from "react"

import { type CartItem, useCart } from "@/lib/cart"
import { cn } from "@/lib/styles"

/**
 * Quantity stepper + "add to cart". The item really lands in the cart (the store
 * persists to localStorage) and the header count updates — no fake success.
 */
export function AddToCart({
  item,
  options,
  disabled,
}: {
  readonly item: Omit<CartItem, "quantity" | "option">
  /** Variants like "60–120 g" — the chosen one travels with the cart line. */
  readonly options?: readonly string[]
  readonly disabled?: boolean
}) {
  const { add } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [option, setOption] = useState(options?.[0])
  const [added, setAdded] = useState(false)

  return (
    <div>
      {options?.length ? (
        <div className="mb-6">
          <div className="font-oswald text-brand-muted mb-3 text-[13px] tracking-[0.06em] uppercase">
            Варіант
          </div>
          <div className="flex flex-wrap gap-2.5">
            {options.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setOption(value)}
                className={cn(
                  "font-oswald cursor-pointer rounded-md border-[1.5px] px-5 py-2.5 text-[15px] transition-colors",
                  value === option
                    ? "border-brand-bronze bg-brand-bronze/12 text-brand-cream"
                    : "text-brand-nav border-[#2f4f3a] hover:border-[#3f6a4d]"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-5.5 flex flex-wrap items-stretch gap-3.5">
        <div className="flex items-center overflow-hidden rounded-lg border-[1.5px] border-[#2f4f3a]">
          <StepperButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            label="Зменшити кількість"
          >
            −
          </StepperButton>
          <span
            aria-live="polite"
            className="font-oswald text-brand-cream w-11.5 text-center text-[17px]"
          >
            {quantity}
          </span>
          <StepperButton
            onClick={() => setQuantity((q) => q + 1)}
            label="Збільшити кількість"
          >
            +
          </StepperButton>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            add({ ...item, option }, quantity)
            setAdded(true)
          }}
          className="bg-brand-bronze font-oswald hover:bg-brand-orange h-13.5 flex-1 cursor-pointer rounded-lg px-6 text-[17px] font-medium tracking-[0.05em] text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
        >
          {disabled ? "Немає в наявності" : "Додати в кошик"}
        </button>
      </div>

      {added ? (
        <p className="text-brand-nav mb-5.5 flex flex-wrap items-center gap-2 text-sm">
          Додано в кошик.
          <Link
            href="/cart"
            className="text-brand-gold hover:text-brand-orange underline underline-offset-4 transition-colors"
          >
            Перейти до кошика →
          </Link>
        </p>
      ) : null}
    </div>
  )
}

function StepperButton({
  onClick,
  label,
  children,
}: {
  readonly onClick: () => void
  readonly label: string
  readonly children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-brand-nav hover:text-brand-cream flex h-13.5 w-11.5 cursor-pointer items-center justify-center text-xl transition-colors"
    >
      {children}
    </button>
  )
}

export default AddToCart
