import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for a ЛінОк product detail page (dark theme). Rendered by
 * StrapiPageView via the mock-pages registry. Gallery/cart are visual only.
 * Delete `apps/ui/src/mock` once pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

const related = (
  id: number,
  name: string,
  category: string,
  price: string
) => ({
  id,
  name,
  category,
  price,
  link: link(id + 600, name, "/product"),
})

export const mockProductPage = {
  content: [
    {
      __component: "sections.product",
      id: 1,
      category: "Вудилища · Feeder Pro",
      name: "Карбонове вудилище Feeder Pro 3.6 м",
      price: "2 190 ₴",
      oldPrice: "2 690 ₴",
      badge: "−19%",
      rating: "4.8",
      availability: "В наявності",
      optionLabel: "Тест, г",
      options: [
        { id: 11, text: "60 г" },
        { id: 12, text: "90 г" },
        { id: 13, text: "120 г" },
      ],
      veteranNote:
        "Цей товар можна оплатити за програмою «Ветеранський спорт» через застосунок «Дія».",
      deliveryNotes: [
        { id: 21, text: "Доставка Новою Поштою 1–2 дні" },
        { id: 22, text: "Гарантія 12 місяців" },
        { id: 23, text: "Повернення протягом 14 днів" },
      ],
      description:
        "Легке й міцне фідерне вудилище з карбону IM8. Чутлива вершинка та надійний бланк дозволяють впевнено вивуджувати трофейну рибу на далеких дистанціях. Ідеальне для ловлі на річках і водосховищах.",
      specs: [
        { id: 31, label: "Довжина", value: "3.6 м" },
        { id: 32, label: "Тест", value: "до 120 г" },
        { id: 33, label: "Матеріал", value: "Карбон IM8" },
        { id: 34, label: "Секцій", value: "3 + 3 квівертипи" },
        { id: 35, label: "Вага", value: "320 г" },
        { id: 36, label: "Транспортна довжина", value: "1.25 м" },
      ],
      relatedTitle: "Схожі товари",
      related: [
        related(1, "Спінінг Daiwa Ninja 2.4 м", "Вудилища", "1 750 ₴"),
        related(2, "Котушка Shimano Baitrunner 6000", "Котушки", "3 450 ₴"),
        related(3, "Набір воблерів Predator, 10 шт", "Приманки", "890 ₴"),
        related(4, "Прикормка Feeder Pro, 1 кг", "Прикормка", "180 ₴"),
      ],
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
