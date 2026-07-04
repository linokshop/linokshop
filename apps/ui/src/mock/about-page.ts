import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Про магазин" page (light theme). Rendered by
 * StrapiPageView via the mock-pages registry. Delete `apps/ui/src/mock` once
 * pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockAboutPage = {
  content: [
    {
      __component: "sections.text-block",
      id: 1,
      theme: "light",
      eyebrow: "Про нас",
      title: "Магазин ЛінОк",
      text: "Ми — рибальський магазин із Житомира. Понад вісім років допомагаємо рибалкам обирати надійні снасті, приманки та екіпіровку для вдалої риболовлі й активного відпочинку.",
    },
    {
      __component: "sections.steps",
      id: 2,
      theme: "light",
      title: "Наші цінності",
      steps: [
        {
          id: 21,
          title: "Якість",
          text: "Працюємо лише з перевіреними брендами та надаємо гарантію на товар.",
        },
        {
          id: 22,
          title: "Досвід",
          text: "Радимо спорядження, спираючись на власний риболовний досвід.",
        },
        {
          id: 23,
          title: "Підтримка",
          text: "Допоможемо з вибором до й після покупки — просто напишіть нам.",
        },
      ],
    },
    {
      __component: "sections.steps",
      id: 3,
      theme: "light",
      title: "ЛінОк у цифрах",
      steps: [
        {
          id: 31,
          number: "8",
          title: "років на ринку",
          text: "Досвід, якому довіряють рибалки Житомирщини.",
        },
        {
          id: 32,
          number: "1200+",
          title: "задоволених клієнтів",
          text: "Повертаються до нас за новим спорядженням.",
        },
        {
          id: 33,
          number: "24 год",
          title: "доставка по Україні",
          text: "Відправляємо Новою Поштою наступного дня.",
        },
      ],
    },
    {
      __component: "sections.home-promo",
      id: 4,
      title: "Готові до риболовлі?",
      text: "Обирайте спорядження в нашому каталозі.",
      link: link(4, "До каталогу", "/catalog"),
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
