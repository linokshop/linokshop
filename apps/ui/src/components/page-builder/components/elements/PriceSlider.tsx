"use client"

import { cn } from "@/lib/styles"

/**
 * Two-handle price range.
 *
 * Built from a pair of overlaid native range inputs rather than pointer maths:
 * the browser then handles touch, keyboard and screen readers for free, which a
 * hand-rolled slider almost never gets right. Only the thumbs take pointer
 * events, so the lower input does not swallow clicks meant for the upper one.
 */
const THUMB =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-cream [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.5)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-cream [&::-moz-range-thumb]:cursor-grab"

export function PriceSlider({
  min,
  max,
  from,
  to,
  onChange,
  labelFrom,
  labelTo,
}: {
  readonly min: number
  readonly max: number
  readonly from: number
  readonly to: number
  readonly onChange: (next: { from: number; to: number }) => void
  readonly labelFrom: string
  readonly labelTo: string
}) {
  // A catalogue where everything costs the same has nothing to slide between.
  if (max <= min) {
    return null
  }

  const span = max - min
  const percent = (value: number) => ((value - min) / span) * 100

  return (
    <div className="relative h-4">
      <div className="bg-brand-field absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-sm" />
      <div
        className="bg-brand-bronze absolute top-1/2 h-1 -translate-y-1/2 rounded-sm"
        style={{
          left: `${percent(from)}%`,
          right: `${100 - percent(to)}%`,
        }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={from}
        aria-label={labelFrom}
        // A handle may be dragged past its partner; clamping here keeps the
        // pair ordered instead of letting the range invert.
        onChange={(event) =>
          onChange({ from: Math.min(Number(event.target.value), to), to })
        }
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 appearance-none bg-transparent",
          THUMB
        )}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={to}
        aria-label={labelTo}
        onChange={(event) =>
          onChange({ from, to: Math.max(Number(event.target.value), from) })
        }
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 appearance-none bg-transparent",
          THUMB
        )}
      />
    </div>
  )
}

export default PriceSlider
