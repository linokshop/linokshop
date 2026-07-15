import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ContactFormFields } from "@/components/page-builder/components/elements/ContactFormFields"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiContactForm({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.contact-form">
}) {
  const locale = (pageParams?.locale ?? "uk") as Locale
  const t = await getTranslations({ locale, namespace: "shop.contact" })
  const {
    title,
    text,
    nameLabel,
    phoneLabel,
    messageLabel,
    submitLabel,
    enabled,
    disabledNote,
    theme,
  } = component
  const isLight = theme === "light"
  const isEnabled = enabled === true

  return (
    <section
      className={cn(
        SECTION_X_PADDING,
        "font-golos border-t py-15 text-center",
        isLight
          ? "bg-brand-cream border-brand-line"
          : "bg-brand-surface border-brand-border"
      )}
    >
      <div className="mx-auto max-w-190">
        {title ? (
          <h2
            className={cn(
              "mb-2.5 text-[32px] leading-tight font-bold",
              isLight
                ? "font-bitter text-brand-forest"
                : "font-oswald text-brand-cream uppercase"
            )}
          >
            {title}
          </h2>
        ) : null}
        {text ? (
          <p
            className={cn(
              "mb-7 text-base",
              isLight ? "text-brand-sage" : "text-brand-nav"
            )}
          >
            {text}
          </p>
        ) : null}

        <ContactFormFields
          labels={{
            nameLabel: nameLabel ?? t("nameFallback"),
            phoneLabel: phoneLabel ?? t("phoneFallback"),
            messageLabel: messageLabel ?? t("messageFallback"),
            submitLabel: submitLabel ?? t("submitFallback"),
          }}
          enabled={isEnabled}
          isLight={isLight}
        />

        {/* The `enabled` flag is the CMS kill-switch; when it is off we say why. */}
        {!isEnabled && disabledNote ? (
          <p
            className={cn(
              "mt-4 text-sm",
              isLight ? "text-brand-sage" : "text-brand-muted"
            )}
          >
            {disabledNote}
          </p>
        ) : null}
      </div>
    </section>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
