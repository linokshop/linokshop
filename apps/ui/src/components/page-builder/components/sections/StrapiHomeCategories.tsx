import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiHomeCategories({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.home-categories">
}) {
  const { title, link, categories } = component

  return (
    <section
      className={cn(SECTION_X_PADDING, "bg-brand-green font-golos py-8")}
    >
      {/* Heading + "all catalog" link */}
      {title || link ? (
        <div className="mb-6.5 flex items-end justify-between gap-4">
          {title ? (
            <h2 className="font-oswald text-brand-cream mb-0 text-[30px] leading-tight font-semibold tracking-[0.02em] uppercase min-[600px]:text-[40px]">
              {title}
            </h2>
          ) : null}
          {link ? (
            <StrapiLink
              component={link}
              unstyled
              className="font-oswald text-brand-gold hover:text-brand-cream shrink-0 text-[15px] tracking-[0.04em] whitespace-nowrap uppercase transition-colors"
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4.5 min-[600px]:grid-cols-3 min-[1024px]:grid-cols-6">
        {categories?.map((cat) => (
          <StrapiLink
            key={cat.id}
            component={cat.link}
            unstyled
            className="border-brand-border bg-brand-green hover:border-brand-orange group/tile block overflow-hidden rounded-xl border transition-colors"
          >
            <span className="bg-brand-surface relative block h-26 w-full overflow-hidden">
              {cat.image?.media ? (
                <StrapiBasicImage
                  component={cat.image}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 600px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover/tile:scale-105"
                />
              ) : null}
            </span>
            <span className="block p-3.5 text-center">
              <span className="font-oswald text-brand-cream block text-base tracking-[0.04em] uppercase">
                {cat.label}
              </span>
              {cat.count ? (
                <span className="text-brand-muted mt-1 block text-[12.5px]">
                  {cat.count}
                </span>
              ) : null}
            </span>
          </StrapiLink>
        ))}
      </div>
    </section>
  )
}

StrapiHomeCategories.displayName = "StrapiHomeCategories"

export default StrapiHomeCategories
