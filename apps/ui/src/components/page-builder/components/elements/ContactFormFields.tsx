"use client"

import { useState } from "react"

import { readError } from "@/lib/http"
import { cn } from "@/lib/styles"

export interface ContactFormLabels {
  readonly nameLabel: string
  readonly phoneLabel: string
  readonly messageLabel: string
  readonly submitLabel: string
}

type Status = "idle" | "sending" | "sent" | "error"

/**
 * Posts to /API/lead, which forwards the message to Telegram. `enabled` is a
 * CMS kill-switch: turn the form off without a deploy.
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
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string>()

  const canSubmit =
    enabled &&
    status !== "sending" &&
    name.trim().length > 1 &&
    phone.trim().length > 5

  const fieldClassName = cn(
    "w-full rounded-lg border px-4 py-3.5 text-[15px] outline-none transition-colors",
    isLight
      ? "bg-brand-paper border-brand-line text-brand-forest placeholder:text-brand-sage/70 focus:border-brand-bronze"
      : "bg-brand-surface border-brand-border text-brand-cream placeholder:text-brand-muted focus:border-brand-orange"
  )

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return

    setStatus("sending")
    setError(undefined)

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name,
          phone,
          message: message || undefined,
          company,
        }),
      })

      if (!response.ok) {
        const body = await readError(response)
        throw new Error(body.error ?? "Не вдалося надіслати повідомлення.")
      }

      setStatus("sent")
      setName("")
      setPhone("")
      setMessage("")
    } catch (caught) {
      setStatus("error")
      setError(
        caught instanceof Error
          ? caught.message
          : "Не вдалося надіслати повідомлення."
      )
    }
  }

  if (status === "sent") {
    return (
      <p
        className={cn(
          "rounded-lg border px-6 py-5 text-[15px]",
          isLight
            ? "bg-brand-paper border-brand-line text-brand-forest"
            : "bg-brand-surface border-brand-border text-brand-cream"
        )}
      >
        Дякуємо! Ми отримали ваше повідомлення й зателефонуємо найближчим часом.
      </p>
    )
  }

  return (
    <form className="text-left" onSubmit={submit}>
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

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="absolute left-[-9999px] size-0 opacity-0"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-brand-bronze font-oswald hover:bg-brand-orange cursor-pointer rounded-lg px-9 py-4 text-base font-medium tracking-[0.05em] text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status === "sending" ? "Надсилаємо…" : labels.submitLabel}
      </button>

      {status === "error" && error ? (
        <p className="text-brand-orange mt-3 text-sm">{error}</p>
      ) : null}
    </form>
  )
}

export default ContactFormFields
