import "server-only"

import type { Data } from "@repo/strapi-types"

import Typography from "@/components/typography"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiSteps({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.steps">
}) {
  const { title, steps, theme } = component
  const isLight = theme === "light"

  return (
    <section
      className={cn("font-golos", isLight ? "bg-brand-sand" : "bg-brand-green")}
    >
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h2"
            className={cn(
              "font-oswald mb-8 text-center text-3xl font-bold uppercase",
              isLight ? "text-brand-green" : "text-brand-cream"
            )}
          >
            {title}
          </Typography>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {steps?.map((step) => (
            <div
              key={step.id}
              className={cn(
                "rounded-sm border p-8",
                isLight
                  ? "border-brand-green/10 bg-white"
                  : "border-brand-border bg-brand-surface"
              )}
            >
              {step.number ? (
                <span className="font-oswald text-brand-orange text-5xl font-bold">
                  {step.number}
                </span>
              ) : null}
              {step.title ? (
                <Typography
                  tag="h3"
                  className={cn(
                    "font-oswald mt-4 text-xl font-semibold uppercase",
                    isLight ? "text-brand-green" : "text-brand-cream"
                  )}
                >
                  {step.title}
                </Typography>
              ) : null}
              {step.text ? (
                <Typography
                  className={cn(
                    "mt-2 text-sm/6",
                    isLight ? "text-brand-green/70" : "text-brand-nav"
                  )}
                >
                  {step.text}
                </Typography>
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
