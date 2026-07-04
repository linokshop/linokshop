import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock for the ЛінОк "Каталог" page (dark theme). Rendered by
 * StrapiPageView via the mock-pages registry. Filters are visual only for now.
 * Delete `apps/ui/src/mock` once pages live in Strapi.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

const product = (
  id: number,
  name: string,
  category: string,
  price: string,
  extra?: { badge?: string; oldPrice?: string }
) => ({
  id,
  name,
  category,
  price,
  badge: extra?.badge,
  oldPrice: extra?.oldPrice,
  link: link(id + 500, name, "/product"),
})

export const mockCatalogPage = {
  content: [
    {
      __component: "sections.catalog",
      id: 1,
      title: "Каталог товарів",
      resultsLabel: "Знайдено 128 товарів",
      categories: [
        { id: 11, text: "Вудилища" },
        { id: 12, text: "Котушки" },
        { id: 13, text: "Приманки" },
        { id: 14, text: "Екіпіровка" },
        { id: 15, text: "Човни" },
        { id: 16, text: "Прикормка" },
      ],
      brands: [
        { id: 21, text: "Shimano" },
        { id: 22, text: "Daiwa" },
        { id: 23, text: "Feeder Pro" },
        { id: 24, text: "Predator" },
      ],
      products: [
        product(
          1,
          "Карбонове вудилище Feeder Pro 3.6 м",
          "Вудилища",
          "2 190 ₴",
          {
            badge: "−19%",
            oldPrice: "2 690 ₴",
          }
        ),
        product(2, "Котушка Shimano Baitrunner 6000", "Котушки", "3 450 ₴"),
        product(3, "Набір воблерів Predator, 10 шт", "Приманки", "890 ₴", {
          badge: "Хіт",
        }),
        product(4, "Термокостюм Winter Fish −20°", "Екіпіровка", "4 100 ₴", {
          oldPrice: "4 800 ₴",
        }),
        product(5, "Спінінг Daiwa Ninja 2.4 м", "Вудилища", "1 750 ₴"),
        product(6, "Котушка Daiwa Legalis LT", "Котушки", "2 980 ₴", {
          badge: "−10%",
          oldPrice: "3 300 ₴",
        }),
        product(7, "Прикормка Feeder Pro, 1 кг", "Прикормка", "180 ₴"),
        product(8, "Крісло рибальське складне", "Екіпіровка", "1 240 ₴"),
        product(9, "Надувний човен Fisher 220", "Човни", "8 900 ₴", {
          badge: "Новинка",
        }),
      ],
    },
  ],
} as unknown as Data.ContentType<"api::page.page">
