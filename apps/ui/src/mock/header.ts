import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock data for the ЛінОк header.
 *
 * Used as a fallback in the Strapi single-type fetchers while the CMS content
 * is not yet populated (see StrapiHeader). Build/preview the UI against this,
 * then create the real content in Strapi.
 *
 * DELETE the whole `apps/ui/src/mock` folder once every section is Strapi-driven.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockHeader = {
  logoTitle: "ЛінОк",
  logoSubtitle: "Рибальський магазин",
  topStripText:
    "Державна програма «Ветеранський спорт» — підтримка ветеранів через «Дія»",
  topStripLink: link(1, "Дізнатися →", "/veteran"),
  navbarItems: [
    { id: 11, label: "Головна", href: "/" },
    { id: 12, label: "Каталог", href: "/catalog" },
    { id: 13, label: "Акції", href: "/promos" },
    { id: 14, label: "Про магазин", href: "/about" },
    { id: 15, label: "Доставка", href: "/delivery" },
    { id: 16, label: "Контакти", href: "/contacts" },
  ].map(({ id, label, href }) => ({
    id,
    isCategoryLink: true,
    link: link(id + 100, label, href),
  })),
  veteranLink: link(2, "Ветеранам", "/veteran"),
  primaryButtons: [link(3, "Кошик · 2", "/cart")],
} as unknown as Data.ContentType<"api::header.header">
