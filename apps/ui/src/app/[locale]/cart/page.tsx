import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { CartView } from "@/components/cart/CartView"
import { SECTION_X_PADDING } from "@/lib/layout"
import { cn } from "@/lib/styles"

interface CartPageProps {
  readonly params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })

  return { title: t("cart") }
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "shop.common",
  })

  return (
    <main className="bg-brand-surface font-golos flex w-full flex-1 flex-col">
      <div
        className={cn(
          SECTION_X_PADDING,
          "mx-auto w-full max-w-[1320px] pt-10 pb-17.5"
        )}
      >
        <h1 className="font-oswald text-brand-cream mb-8 text-[38px] leading-tight font-bold tracking-[0.01em] uppercase min-[600px]:text-[50px]">
          {t("cart")}
        </h1>

        {/* The cart lives in the browser, so its contents are rendered on the
            client — the server has nothing to render them from. */}
        <CartView />
      </div>
    </main>
  )
}
