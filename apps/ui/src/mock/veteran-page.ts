import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Ветеранський спорт" page. Rendered by
 * StrapiPageView (via the mock-pages registry) while the Strapi page is not
 * yet populated. Delete `apps/ui/src/mock` once pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockVeteranPage = {
  content: [
    {
      __component: "sections.home-program",
      id: 1,
      badge: "Дія · Державна програма",
      title: "Ветеранський спорт",
      text: "Програма підтримки ветеранів та ветеранок: оплата рибальського спорядження через застосунок «Дія» — швидко, зручно й без черг.",
      checklist: [
        { id: 11, text: "Для ветеранів та ветеранок" },
        { id: 12, text: "Оплата через «Дія»" },
        { id: 13, text: "Широкий вибір спорядження" },
        { id: 14, text: "Підтримка на кожному кроці" },
      ],
      link: link(1, "Переглянути каталог", "/catalog"),
    },
    {
      __component: "sections.text-block",
      id: 2,
      eyebrow: "Що це таке",
      title: "Підтримка тих, хто захищав",
      text: "«Ветеранський спорт» — державна ініціатива, що допомагає ветеранам повертатися до активного життя через спорт і відпочинок. Рибальське спорядження можна оплатити коштами програми прямо в застосунку «Дія».",
    },
    {
      __component: "sections.steps",
      id: 3,
      title: "Як скористатися — 3 кроки",
      steps: [
        {
          id: 31,
          number: "01",
          title: "Авторизуйтесь у «Дія»",
          text: "Увійдіть до застосунку та перевірте доступний баланс за програмою.",
        },
        {
          id: 32,
          number: "02",
          title: "Оберіть спорядження",
          text: "Додайте потрібні товари в кошик у нашому каталозі.",
        },
        {
          id: 33,
          number: "03",
          title: "Оплатіть за програмою",
          text: "Оберіть оплату «Дія» під час оформлення — і все готово.",
        },
      ],
    },
    {
      __component: "sections.home-categories",
      id: 4,
      title: "Що можна придбати",
      categories: [
        {
          id: 41,
          label: "Вудилища",
          count: "48 товарів",
          link: link(41, "Вудилища", "/catalog"),
        },
        {
          id: 42,
          label: "Котушки",
          count: "36 товарів",
          link: link(42, "Котушки", "/catalog"),
        },
        {
          id: 43,
          label: "Екіпіровка",
          count: "54 товари",
          link: link(43, "Екіпіровка", "/catalog"),
        },
        {
          id: 44,
          label: "Човни",
          count: "18 товарів",
          link: link(44, "Човни", "/catalog"),
        },
      ],
    },
    {
      __component: "sections.home-promo",
      id: 5,
      title: "Дякуємо кожному ветерану та ветеранці",
      text: "За мужність, силу і любов до життя.",
      link: link(5, "До каталогу", "/catalog"),
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
