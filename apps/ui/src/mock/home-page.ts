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
    {
      __component: "sections.home-products",
      id: 3,
      title: "Топ спорядження",
      products: [
        {
          id: 31,
          badge: "-19%",
          category: "Вудилища",
          name: "Карбонове вудилище Feeder Pro 3.6 м",
          price: "2 190 ₴",
          oldPrice: "2 690 ₴",
          link: link(31, "Feeder Pro", "/product"),
        },
        {
          id: 32,
          category: "Котушки",
          name: "Котушка Shimano Baitrunner 6000",
          price: "3 450 ₴",
          link: link(32, "Shimano Baitrunner", "/product"),
        },
        {
          id: 33,
          badge: "Хіт",
          category: "Приманки",
          name: "Набір воблерів Predator, 10 шт",
          price: "890 ₴",
          link: link(33, "Набір воблерів", "/product"),
        },
        {
          id: 34,
          category: "Екіпіровка",
          name: "Термокостюм Winter Fish −20°",
          price: "4 100 ₴",
          oldPrice: "4 800 ₴",
          link: link(34, "Термокостюм", "/product"),
        },
      ],
    },
    {
      __component: "sections.home-program",
      id: 4,
      badge: "Державна програма",
      title: "Ветеранський спорт",
      text: "Ветерани та ветеранки можуть оплатити рибальське спорядження за державною програмою через застосунок «Дія». Швидко, без черг і зайвих документів.",
      checklist: [
        { id: 41, text: "Оплата спорядження через «Дія»" },
        { id: 42, text: "Без черг і паперової тяганини" },
        { id: 43, text: "Широкий вибір товарів для риболовлі" },
        { id: 44, text: "Підтримка на кожному етапі" },
      ],
      link: link(4, "Як скористатися →", "/veteran"),
    },
    {
      __component: "sections.home-promo",
      id: 5,
      title: "Сезон відкрито — знижки до 40%",
      text: "Оновіть спорядження до нового сезону за вигідними цінами.",
      link: link(5, "До акцій", "/promos"),
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
