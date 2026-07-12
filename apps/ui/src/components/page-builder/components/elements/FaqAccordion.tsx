"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/styles"

export interface FaqItem {
  readonly id: number
  readonly question: string
  readonly answer: string
}

/** Accordion rows styled as standalone cards, with a "+" that turns into "×". */
export function FaqAccordion({
  items,
  isLight,
}: {
  readonly items: readonly FaqItem[]
  readonly isLight: boolean
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="flex flex-col gap-3"
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={String(item.id)}
          className={cn(
            "rounded-[10px] border",
            isLight
              ? "bg-brand-paper border-brand-line"
              : "bg-brand-surface border-brand-border"
          )}
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex w-full cursor-pointer items-center justify-between gap-4 px-6.5 py-5.5 text-left text-[16.5px] font-semibold outline-none",
                isLight
                  ? "text-brand-forest focus-visible:text-brand-bronze"
                  : "text-brand-cream focus-visible:text-brand-orange"
              )}
            >
              {item.question}
              <span
                aria-hidden
                className="text-brand-bronze shrink-0 text-[22px] leading-none transition-transform duration-200 group-data-[state=open]:rotate-45"
              >
                +
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <p
              className={cn(
                "px-6.5 pb-5.5 text-[15px] leading-[1.7]",
                isLight ? "text-brand-sage" : "text-brand-nav"
              )}
            >
              {item.answer}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

export default FaqAccordion
