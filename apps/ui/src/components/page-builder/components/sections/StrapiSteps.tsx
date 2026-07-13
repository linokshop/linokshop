import "server-only"

import type { Data } from "@repo/strapi-types"

import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

const THEMES = {
  dark: {
    section: "bg-brand-green",
    heading: "font-oswald text-brand-cream uppercase",
    card: "bg-brand-surface border-brand-border",
    title: "text-brand-cream",
    text: "text-brand-nav",
  },
  navy: {
    section: "bg-brand-navy",
    heading: "font-oswald text-white uppercase",
    card: "bg-brand-steel border-brand-steel-line",
    title: "text-white",
    text: "text-brand-mist",
  },
  light: {
    section: "bg-brand-sand",
    heading: "font-bitter text-brand-forest",
    card: "bg-brand-paper border-brand-line",
    title: "text-brand-forest",
    text: "text-brand-sage",
  },
} as const

export function StrapiSteps({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.steps">
}) {
  const { title, steps, theme } = component
  const t = THEMES[theme ?? "dark"]

  return (
    <section className={cn(SECTION_X_PADDING, "font-golos py-18", t.section)}>
      <div className="mx-auto max-w-[1320px]">
        {title ? (
          <h2
            className={cn(
              "mb-10 text-center text-[30px] leading-tight font-semibold tracking-[0.02em] min-[600px]:text-[38px]",
              t.heading
            )}
          >
            {title}
          </h2>
        ) : null}

        <div className="grid gap-6 min-[1024px]:grid-cols-3">
          {steps?.map((step) => (
            <div
              key={step.id}
              className={cn("rounded-xl border p-8.5", t.card)}
            >
              {step.number ? (
                <div className="font-oswald text-brand-orange mb-4 text-[54px] leading-none font-bold">
                  {step.number}
                </div>
              ) : null}
              {step.title ? (
                <h3
                  className={cn(
                    "font-oswald mb-2.5 text-[21px] tracking-[0.02em] uppercase",
                    t.title
                  )}
                >
                  {step.title}
                </h3>
              ) : null}
              {step.text ? (
                <p className={cn("text-[15px] leading-[1.65]", t.text)}>
                  {step.text}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

StrapiSteps.displayName = "StrapiSteps"

export default StrapiSteps
