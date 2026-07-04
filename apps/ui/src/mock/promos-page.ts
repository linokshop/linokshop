import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Акції та новини" page (dark theme). Rendered by
 * StrapiPageView via the mock-pages registry. Delete `apps/ui/src/mock` once
 * pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockPromosPage = {
  content: [
    {
      __component: "sections.text-block",
      id: 1,
      theme: "dark",
      eyebrow: "Акції та новини",
      title: "Гарячі пропозиції",
      text: "Найкращі знижки на снасті й екіпіровку та свіжі новини магазину ЛінОк.",
    },
    {
      __component: "sections.home-promo",
      id: 2,
      title: "Сезон відкрито — знижки до 40%",
      text: "Оновіть спорядження до нового сезону за вигідними цінами.",
      link: link(2, "До каталогу", "/catalog"),
    },
    {
      __component: "sections.card-grid",
      id: 3,
      theme: "dark",
      title: "Акції",
      cards: [
        {
          id: 31,
          badge: "−25%",
          title: "Знижки на вудилища",
          text: "Карбонові вудилища провідних брендів за спеціальною ціною.",
          link: link(31, "Детальніше", "/catalog"),
        },
        {
          id: 32,
          badge: "1+1",
          title: "Прикормка у подарунок",
          text: "Купуйте дві упаковки прикормки — третя безкоштовно.",
          link: link(32, "Детальніше", "/catalog"),
        },
        {
          id: 33,
          badge: "Дія",
          title: "Ветеранський спорт",
          text: "Оплата спорядження ветеранами через застосунок «Дія».",
          link: link(33, "Детальніше", "/veteran"),
        },
      ],
    },
    {
      __component: "sections.news",
      id: 4,
      theme: "dark",
      title: "Новини",
      items: [
        {
          id: 41,
          date: "12 червня 2026",
          title: "Новий завіз котушок Shimano",
          text: "Поповнили асортимент популярними моделями Baitrunner і Sedona.",
          link: link(41, "Читати", "/promos"),
        },
        {
          id: 42,
          date: "3 червня 2026",
          title: "Відкрито сезон літньої риболовлі",
          text: "Готуємось до сезону: нові приманки, снасті та поради від експертів.",
          link: link(42, "Читати", "/promos"),
        },
        {
          id: 43,
          date: "28 травня 2026",
          title: "Розширили програму «Ветеранський спорт»",
          text: "Тепер за програмою доступно ще більше товарів для риболовлі.",
          link: link(43, "Читати", "/veteran"),
        },
      ],
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
