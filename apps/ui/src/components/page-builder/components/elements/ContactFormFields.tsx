"use client"

import { useState } from "react"

import { cn } from "@/lib/styles"

export interface ContactFormLabels {
  readonly nameLabel: string
  readonly phoneLabel: string
  readonly messageLabel: string
  readonly submitLabel: string
}

/**
 * The form is fully built but does NOT send anywhere yet — the Telegram bot is
 * not wired up. Until then `enabled` is false: fields stay usable, the submit
 * button is disabled and the section shows an honest note instead of pretending
 * the message went through.
 */
export function ContactFormFields({
  labels,
  enabled,
  isLight,
}: {
  readonly labels: ContactFormLabels
  readonly enabled: boolean
  readonly isLight: boolean
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const canSubmit = enabled && name.trim().length > 1 && phone.trim().length > 5

  const fieldClassName = cn(
    "w-full rounded-lg border px-4 py-3.5 text-[15px] outline-none transition-colors",
    isLight
      ? "bg-brand-paper border-brand-line text-brand-forest placeholder:text-brand-sage/70 focus:border-brand-bronze"
      : "bg-brand-surface border-brand-border text-brand-cream placeholder:text-brand-muted focus:border-brand-orange"
  )

  return (
    <form
      className="text-left"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <div className="mb-3.5 grid gap-3.5 min-[600px]:grid-cols-2">
        <label>
          <span className="sr-only">{labels.nameLabel}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={labels.nameLabel}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label>
          <span className="sr-only">{labels.phoneLabel}</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder={labels.phoneLabel}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </div>

      <label>
        <span className="sr-only">{labels.messageLabel}</span>
        <textarea
          name="message"
          rows={4}
          placeholder={labels.messageLabel}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(fieldClassName, "mb-3.5 resize-y")}
        />
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-brand-bronze font-oswald hover:bg-brand-orange rounded-lg px-9 py-4 text-base font-medium tracking-[0.05em] text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
      >
        {labels.submitLabel}
      </button>
    </form>
  )
}

export default ContactFormFields
