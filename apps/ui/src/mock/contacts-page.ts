import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Контакти" page (light theme). Rendered by
 * StrapiPageView via the mock-pages registry. Delete `apps/ui/src/mock` once
 * pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockContactsPage = {
  content: [
    {
      __component: "sections.text-block",
      id: 1,
      theme: "light",
      eyebrow: "Контакти",
      title: "Зв'яжіться з нами",
      text: "Маєте питання щодо товару, доставки чи програми «Ветеранський спорт»? Ми на зв'язку щодня.",
    },
    {
      __component: "sections.steps",
      id: 2,
      theme: "light",
      title: "Наші контакти",
      steps: [
        {
          id: 21,
          title: "Телефон",
          text: "+38 (097) 000-00-00 — дзвоніть щодня з 9:00 до 19:00.",
        },
        {
          id: 22,
          title: "Адреса",
          text: "м. Житомир, вул. Народицька, 15. Ласкаво просимо в магазин.",
        },
        {
          id: 23,
          title: "Графік роботи",
          text: "Пн–Нд: 9:00 – 19:00, без вихідних.",
        },
      ],
    },
    {
      __component: "sections.home-promo",
      id: 3,
      title: "Завітайте до нас",
      text: "Або переглядайте каталог онлайн — доставимо по всій Україні.",
      link: link(3, "До каталогу", "/catalog"),
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
