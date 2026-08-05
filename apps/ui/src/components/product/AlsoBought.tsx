import "server-only"

import Image from "next/image"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import AppLink from "@/components/elementary/AppLink"
import { ALSO_BOUGHT_ID } from "@/lib/layout"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

export interface AlsoBoughtTile {
  readonly slug: string
  readonly name: string
  readonly categorySlug: string
  readonly imageUrl: string | null
}

/**
 * "Often bought with this" — whole subcategories rather than single products.
 *
 * A rod needs worms, not one particular jar of them, so pointing at the
 * subcategory lets the buyer pick their own. The pairing is configured once per
 * subcategory in the CMS instead of per product, which is the difference between
 * a few dozen entries and a few thousand.
 */
export async function AlsoBought({
  tiles,
  locale,
}: {
  readonly tiles: readonly AlsoBoughtTile[]
  readonly locale: Locale
}) {
  if (!tiles.length) {
    return null
  }

  const t = await getTranslations({ locale, namespace: "shop.product" })

  return (
    <section id={ALSO_BOUGHT_ID} className="scroll-mt-24">
      <h2 className="font-oswald text-brand-cream mb-6.5 text-[30px] font-semibold tracking-[0.02em] uppercase min-[600px]:text-[32px]">
        {t("alsoBought")}
      </h2>
      <div className="grid grid-cols-2 gap-3.5 min-[600px]:gap-5.5 min-[1024px]:grid-cols-4">
        {tiles.map((tile) => (
          <AppLink
            key={tile.slug}
            href={`/catalog/${tile.categorySlug}/${tile.slug}`}
            unstyled
            className="border-brand-border bg-brand-green hover:border-brand-field-hover group/tile block overflow-hidden rounded-xl border transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
          >
            <span className="bg-brand-surface relative block h-32 w-full overflow-hidden">
              {tile.imageUrl ? (
                <Image
                  src={tile.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover/tile:scale-105"
                  unoptimized
                />
              ) : null}
            </span>
            <span className="block p-4 text-center">
              <span className="font-oswald text-brand-cream block text-[15px] tracking-[0.03em] uppercase">
                {tile.name}
              </span>
            </span>
          </AppLink>
        ))}
      </div>
    </section>
  )
}

/** Turns the populated relation into what the tiles need, dropping broken links. */
export function toAlsoBoughtTiles(
  subcategories: readonly {
    slug?: string | null
    name?: string | null
    category?: null | { slug?: string | null }
    image?: null | { url?: string | null }
  }[]
): AlsoBoughtTile[] {
  return subcategories
    .filter((sub) => sub.slug && sub.name && sub.category?.slug)
    .map((sub) => ({
      slug: sub.slug ?? "",
      name: sub.name ?? "",
      categorySlug: sub.category?.slug ?? "",
      imageUrl: formatStrapiMediaUrl(sub.image?.url) ?? null,
    }))
}

export default AlsoBought
