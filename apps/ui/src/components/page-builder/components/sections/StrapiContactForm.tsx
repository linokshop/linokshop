import "server-only"

import type { Data } from "@repo/strapi-types"

import { ContactFormFields } from "@/components/page-builder/components/elements/ContactFormFields"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiContactForm({
  component,
}: PageBuilderComponentProps & {
  readonly component: Data.Component<"sections.contact-form">
}) {
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
            nameLabel: nameLabel ?? "Ваше ім'я",
            phoneLabel: phoneLabel ?? "Телефон",
            messageLabel: messageLabel ?? "Повідомлення",
            submitLabel: submitLabel ?? "Надіслати",
          }}
          enabled={isEnabled}
          isLight={isLight}
        />

        {/* Sending is not wired up yet — say so rather than let people type into
            a form that silently goes nowhere. */}
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
