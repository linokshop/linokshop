import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

/**
 * OpenStreetMap needs no API key: the embed takes a bounding box around the
 * point plus a marker. A tighter box = a closer zoom, so we derive it from the
 * `zoom` field rather than passing zoom directly (the embed has no such param).
 */
function buildMapSrc(lat: number, lng: number, zoom: number) {
  const span = 0.01 / Math.max(1, 2 ** (zoom - 14))
  const bbox = [lng - span, lat - span / 2, lng + span, lat + span / 2]

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(",")}&layer=mapnik&marker=${lat},${lng}`
}

export async function StrapiContacts({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.contacts">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const t = await getTranslations({ locale, namespace: "shop.common" })
  const {
    items,
    socialsLabel,
    socials,
    latitude,
    longitude,
    zoom,
    mapTitle,
    theme,
  } = component
  const isLight = theme === "light"
  const hasMap = latitude != null && longitude != null

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos pt-14 pb-8",
        isLight ? "bg-brand-sand" : "bg-brand-green"
      )}
    >
      <div className="mx-auto grid max-w-[1320px] items-start gap-8 min-[900px]:grid-cols-[1fr_1.25fr] min-[900px]:gap-12">
        <div className="flex flex-col gap-6.5">
          {items?.map((item) => (
            <div key={item.id}>
              {item.label ? (
                <div className="font-oswald text-brand-bronze mb-2 text-[13px] tracking-[0.08em] uppercase">
                  {item.label}
                </div>
              ) : null}

              {item.value ? (
                <ContactValue item={item} isLight={isLight} />
              ) : null}

              {item.note ? (
                <div
                  className={cn(
                    "mt-1.5 text-[14.5px]",
                    isLight ? "text-brand-sage" : "text-brand-muted"
                  )}
                >
                  {item.note}
                </div>
              ) : null}
            </div>
          ))}

          {socials?.length ? (
            <div>
              {socialsLabel ? (
                <div className="font-oswald text-brand-bronze mb-2.5 text-[13px] tracking-[0.08em] uppercase">
                  {socialsLabel}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2.5">
                {socials.map((social) => (
                  <StrapiLink
                    key={social.id}
                    component={social}
                    unstyled
                    className={cn(
                      "rounded-lg border px-4.5 py-2.5 text-sm transition-colors",
                      isLight
                        ? "bg-brand-paper border-brand-line text-brand-forest hover:border-brand-bronze"
                        : "bg-brand-surface border-brand-border text-brand-cream hover:border-brand-orange"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {hasMap ? (
          <iframe
            // A plain iframe keeps this a server component — no map library, no
            // client JS, no API key.
            src={buildMapSrc(latitude, longitude, zoom ?? 16)}
            title={mapTitle ?? t("mapTitle")}
            loading="lazy"
            className={cn(
              "h-80 w-full rounded-2xl border min-[900px]:h-110",
              isLight ? "border-brand-line" : "border-brand-border"
            )}
          />
        ) : null}
      </div>
    </section>
  )
}

function ContactValue({
  item,
  isLight,
}: {
  readonly item: NonNullable<
    Data.Component<"sections.contacts">["items"]
  >[number]
  readonly isLight: boolean
}) {
  const isLarge = item.emphasis === "large"

  const className = cn(
    isLarge
      ? "font-bitter text-[26px] font-bold"
      : "text-xl leading-[1.4] font-semibold",
    isLight ? "text-brand-forest" : "text-brand-cream",
    item.href && "hover:text-brand-bronze transition-colors"
  )

  // Line breaks in the CMS value are meaningful here (street on its own line).
  const value = (item.value ?? "").split("\n").map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ))

  return item.href ? (
    <a href={item.href} className={cn("block", className)}>
      {value}
    </a>
  ) : (
    <div className={className}>{value}</div>
  )
}

StrapiContacts.displayName = "StrapiContacts"

export default StrapiContacts
