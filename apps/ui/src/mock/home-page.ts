import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк homepage dynamic-zone content. Rendered by
 * StrapiPageView as a fallback while the Strapi home page is not yet populated.
 * Delete `apps/ui/src/mock` once the homepage lives in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockHomePage = {
  content: [
    {
      __component: "sections.home-hero",
      id: 1,
      title: "Там, де клює —",
      titleAccent: "там я!",
      subtitle:
        "Снасті, приманки та екіпіровка для риболовлі й активного відпочинку. Усе для вдалої риболовлі — в одному місці.",
      primaryLink: link(1, "Каталог", "/catalog"),
      secondaryLink: link(2, "Акції", "/promos"),
      veteranBadge: "Ексклюзивно · Дія",
      veteranTitle: "Ветеранський спорт",
      veteranText:
        "Державна програма підтримки ветеранів — оплата спорядження через застосунок «Дія».",
      veteranLink: link(3, "Як скористатися →", "/veteran"),
    },
    {
      __component: "sections.home-categories",
      id: 2,
      title: "Категорії",
      categories: [
        {
          id: 21,
          label: "Вудилища",
          count: "48 товарів",
          link: link(21, "Вудилища", "/catalog"),
        },
        {
          id: 22,
          label: "Котушки",
          count: "36 товарів",
          link: link(22, "Котушки", "/catalog"),
        },
        {
          id: 23,
          label: "Приманки",
          count: "120 товарів",
          link: link(23, "Приманки", "/catalog"),
        },
        {
          id: 24,
          label: "Екіпіровка",
          count: "54 товари",
          link: link(24, "Екіпіровка", "/catalog"),
        },
        {
          id: 25,
          label: "Човни",
          count: "18 товарів",
          link: link(25, "Човни", "/catalog"),
        },
        {
          id: 26,
          label: "Прикормка",
          count: "72 товари",
          link: link(26, "Прикормка", "/catalog"),
        },
      ],
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
