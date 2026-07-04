import "server-only"

import type { Data } from "@repo/strapi-types"

import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiSteps({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.steps">
}) {
  const { title, steps } = component

  return (
    <section className="bg-brand-green font-golos">
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        {title ? (
          <Typography
            tag="h2"
            className="font-oswald text-brand-cream mb-8 text-center text-3xl font-bold uppercase"
          >
            {title}
          </Typography>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {steps?.map((step) => (
            <div
              key={step.id}
              className="border-brand-border bg-brand-surface rounded-sm border p-8"
            >
              {step.number ? (
                <span className="font-oswald text-brand-orange text-5xl font-bold">
                  {step.number}
                </span>
              ) : null}
              {step.title ? (
                <Typography
                  tag="h3"
                  className="font-oswald text-brand-cream mt-4 text-xl font-semibold uppercase"
                >
                  {step.title}
                </Typography>
              ) : null}
              {step.text ? (
                <Typography className="text-brand-nav mt-2 text-sm/6">
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
