import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import { PromoRibbon } from "@/components/page-builder/components/elements/PromoRibbon"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { fetchFooter } from "@/lib/strapi-api/content/server"
import { mockFooter } from "@/mock/footer"

type MaybeString = string | null | undefined

function FooterContacts({
  title,
  address,
  phone,
  hours,
}: {
  readonly title: MaybeString
  readonly address: MaybeString
  readonly phone: MaybeString
  readonly hours: MaybeString
}) {
  if (!title && !address && !phone && !hours) {
    return null
  }

  return (
    <div>
      {title ? (
        <div className="font-oswald text-brand-sand mb-4 text-[13px] tracking-widest uppercase">
          {title}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 text-sm">
        {address ? <span className="text-brand-nav">{address}</span> : null}
        {phone ? (
          <a
            href={`tel:${phone.replaceAll(/[^\d+]/g, "")}`}
            className="font-oswald text-brand-cream text-lg no-underline"
          >
            {phone}
          </a>
        ) : null}
        {hours ? <span className="text-brand-muted">{hours}</span> : null}
      </div>
    </div>
  )
}

export function StrapiFooter({ locale }: { readonly locale: Locale }) {
  const response = use(fetchFooter(locale))
  // Fall back to mock content while the Strapi footer is not yet populated.
  // Remove the mock import once the CMS content exists.
  const footer = response?.data ?? mockFooter

  const now = new Date()
  const currentYear = now.getFullYear()
  const {
    logoImage,
    brandName,
    description,
    slogan,
    ribbonText,
    ribbonLink,
    sections,
    contactTitle,
    contactAddress,
    contactPhone,
    contactHours,
    copyRight,
    bottomNote,
  } = footer

  return (
    <footer className="font-golos bg-brand-green text-brand-subtle">
      {/* Veteran program ribbon */}
      <PromoRibbon
        component={ribbonLink}
        leadText={ribbonText}
        variant="footer"
      />

      {/* Columns */}
      <div className="grid grid-cols-1 gap-10 px-4 pt-13 pb-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            {logoImage?.image ? (
              <StrapiBasicImage
                component={logoImage.image}
                width={46}
                height={46}
                className="size-11.5 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="bg-brand-orange size-11.5 shrink-0 rounded-full" />
            )}
            {brandName ? (
              <span className="font-oswald text-brand-cream text-[23px] font-semibold">
                {brandName}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="text-brand-muted mb-4 max-w-75 text-sm/7">
              {description}
            </p>
          ) : null}
          {slogan ? (
            <div className="font-oswald text-brand-subtle text-sm tracking-wider uppercase">
              {slogan}
            </div>
          ) : null}
        </div>

        {/* Link sections */}
        {sections?.map((section) => (
          <div key={section.id}>
            <div className="font-oswald text-brand-sand mb-4 text-[13px] tracking-widest uppercase">
              {section.title}
            </div>
            <div className="flex flex-col gap-2.5 text-sm">
              {section.links?.map((linkItem) => (
                <StrapiLink
                  key={linkItem.id}
                  component={linkItem}
                  unstyled
                  className="text-brand-subtle hover:text-brand-cream block transition-colors"
                />
              ))}
            </div>
          </div>
        ))}

        {/* Contacts */}
        <FooterContacts
          title={contactTitle}
          address={contactAddress}
          phone={contactPhone}
          hours={contactHours}
        />
      </div>

      {/* Bottom bar */}
      <div className="border-brand-border text-brand-muted flex flex-col items-center justify-between gap-2 border-t px-4 py-5 text-center text-[13px] sm:flex-row sm:px-10 sm:text-left">
        {copyRight ? (
          <span>{copyRight.split("{YEAR}").join(String(currentYear))}</span>
        ) : null}
        {bottomNote ? <span>{bottomNote}</span> : null}
      </div>
    </footer>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter
