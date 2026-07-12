import "server-only"

import type { Data } from "@repo/strapi-types"

import {
  type FaqItem,
  FaqAccordion,
} from "@/components/page-builder/components/elements/FaqAccordion"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiFaq({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.faq">
}) {
  const { title, theme, items } = component
  const isLight = theme === "light"

  const faqItems = (items ?? []).filter(
    (item): item is FaqItem => item.question != null && item.answer != null
  )

  if (!faqItems.length) {
    return null
  }

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos py-10 pb-17.5",
        isLight ? "bg-brand-sand" : "bg-brand-green"
      )}
    >
      <div className="mx-auto max-w-[1320px]">
        {title ? (
          <h2
            className={cn(
              "mb-6 text-[32px] leading-tight font-bold",
              isLight
                ? "font-bitter text-brand-forest"
                : "font-oswald text-brand-cream uppercase"
            )}
          >
            {title}
          </h2>
        ) : null}

        <FaqAccordion items={faqItems} isLight={isLight} />
      </div>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq
