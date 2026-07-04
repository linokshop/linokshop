import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Доставка і оплата" page (light theme).
 * Rendered by StrapiPageView via the mock-pages registry.
 * Delete `apps/ui/src/mock` once pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockDeliveryPage = {
  content: [
    {
      __component: "sections.text-block",
      id: 1,
      theme: "light",
      eyebrow: "Доставка і оплата",
      title: "Швидко і зручно",
      text: "Відправляємо замовлення по всій Україні Новою Поштою наступного робочого дня. Оберіть зручний спосіб доставки та оплати.",
    },
    {
      __component: "sections.steps",
      id: 2,
      theme: "light",
      title: "Способи доставки",
      steps: [
        {
          id: 21,
          title: "Нова Пошта — відділення",
          text: "Доставка у відділення або поштомат по всій Україні за 1–2 дні.",
        },
        {
          id: 22,
          title: "Нова Пошта — адресна",
          text: "Кур'єр привезе замовлення прямо до ваших дверей.",
        },
        {
          id: 23,
          title: "Самовивіз",
          text: "Заберіть замовлення з нашого магазину в Житомирі безкоштовно.",
        },
      ],
    },
    {
      __component: "sections.steps",
      id: 3,
      theme: "light",
      title: "Способи оплати",
      steps: [
        {
          id: 31,
          title: "Картка онлайн",
          text: "Безпечна оплата карткою Visa/Mastercard під час оформлення.",
        },
        {
          id: 32,
          title: "При отриманні",
          text: "Оплата готівкою або карткою у відділенні Нової Пошти.",
        },
        {
          id: 33,
          title: "Програма «Дія»",
          text: "Для ветеранів — оплата спорядження коштами програми «Ветеранський спорт».",
        },
      ],
    },
    {
      __component: "sections.home-promo",
      id: 4,
      title: "Готові замовити?",
      text: "Обирайте спорядження — доставимо швидко.",
      link: link(4, "До каталогу", "/catalog"),
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
