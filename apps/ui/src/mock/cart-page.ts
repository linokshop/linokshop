import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Кошик" page (dark theme). Rendered by
 * StrapiPageView via the mock-pages registry. Quantities/form/payment are
 * visual only. Delete `apps/ui/src/mock` once pages live in Strapi.
 */

export const mockCartPage = {
  content: [
    {
      __component: "sections.cart",
      id: 1,
      title: "Кошик",
      items: [
        {
          id: 11,
          name: "Карбонове вудилище Feeder Pro 3.6 м",
          option: "Тест: 120 г",
          price: "2 190 ₴",
        },
        {
          id: 12,
          name: "Котушка Shimano Baitrunner 6000",
          option: "",
          price: "3 450 ₴",
        },
      ],
      itemsTotal: "5 640 ₴",
      discount: "−560 ₴",
      delivery: "за тарифами Нової Пошти",
      total: "5 080 ₴",
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
