import "server-only"

import type { Data } from "@repo/strapi-types"

import type { CartItem } from "@/lib/cart"
import { formatPrice } from "@/lib/format"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"

/**
 * One place that turns a Product entity into what the shared tile renders.
 *
 * The catalog, the home rail and the "related" strip all showed the same tile
 * and each built its own adapter — three chances for the price format or the
 * product href to drift apart.
 */
type ProductEntity = Data.ContentType<"api::product.product">

const price = (value: number | null | undefined) =>
  value == null ? undefined : formatPrice(value)

export function toProductCard(
  product: ProductEntity
): Data.Component<"elements.product-card"> {
  return {
    id: product.id,
    category: product.category?.name,
    name: product.name,
    price: price(product.price),
    oldPrice: price(product.oldPrice),
    badge: product.badge,
    badgeColor: product.badgeColor,
    image: product.images?.[0]
      ? { media: product.images[0], alt: product.name }
      : undefined,
    link: {
      type: "external",
      label: product.name,
      href: `/product/${product.slug}`,
      newTab: false,
    },
    // The tile's props are a subset of the CMS component's shape; the cast is
    // the seam between "a product" and "a card that can also come from the CMS".
  } as unknown as Data.Component<"elements.product-card">
}

/** What the tile's "+" button needs to put the product in the cart. */
export function toCartItem(
  product: ProductEntity
): Omit<CartItem, "quantity" | "option"> {
  return {
    slug: product.slug ?? "",
    name: product.name ?? "",
    price: product.price ?? 0,
    imageUrl: formatStrapiMediaUrl(product.images?.[0]?.url) ?? undefined,
  }
}
