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
      eyebrow: "Спорядження для серйозної ловлі",
      title: "Там, де клює —",
      titleAccent: "там я!",
      subtitle:
        "Перевірені снасті, спортивні приманки й надійна екіпіровка. Усе, що тримає рибу на гачку.",
      primaryLink: link(1, "Перейти в каталог", "/catalog"),
      secondaryLink: link(2, "Акції тижня", "/promos"),
      veteranBadge: "Ексклюзивно · застосунок «Дія»",
      veteranTitle: "Ветеранський",
      veteranTitleAccent: "спорт",
      veteranText:
        "Державна програма для ветеранів та ветеранок — оплачуйте спорядження для риболовлі через «Дія».",
      veteranLink: link(3, "Як скористатися →", "/veteran"),
    },
    {
      __component: "sections.home-categories",
      id: 2,
      title: "Категорії товарів",
      link: link(20, "Увесь каталог →", "/catalog"),
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
      link: link(30, "Усі товари →", "/catalog"),
      products: [
        {
          id: 31,
          badge: "−19%",
          badgeColor: "sale",
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
          badgeColor: "bronze",
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
        {
          id: 35,
          badge: "В наявності",
          badgeColor: "stock",
          category: "Прикормка",
          name: "Прикормка фідерна, 1 кг",
          price: "95 ₴",
          link: link(35, "Прикормка фідерна", "/product"),
        },
        {
          id: 36,
          category: "Аксесуари",
          name: "Підсака телескопічна 2.4 м",
          price: "760 ₴",
          link: link(36, "Підсака", "/product"),
        },
      ],
    },
    {
      __component: "sections.home-program",
      id: 4,
      badge: "Державна програма · «Дія»",
      title: "Ветеранський",
      titleAccent: "спорт",
      text: "У нашому магазині працює державна програма для ветеранів та ветеранок. Використовуйте підтримку на спортивні товари й активний відпочинок через застосунок «Дія».",
      checklist: [
        { id: 41, text: "Рибальські снасті" },
        { id: 42, text: "Туристичне спорядження" },
        { id: 43, text: "Активний відпочинок" },
        { id: 44, text: "Кемпінг та природа" },
      ],
      link: link(4, "Дізнатися більше →", "/veteran"),
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
