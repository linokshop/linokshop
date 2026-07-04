import type { Data } from "@repo/strapi-types"

/**
 * TEMPORARY mock data for the ЛінОк footer. Fallback while the Strapi footer
 * is not yet populated (see StrapiFooter). Delete `apps/ui/src/mock` once every
 * section is Strapi-driven.
 */

type Link = Data.Component<"utilities.link">

const link = (id: number, label: string, href: string): Link =>
  ({ id, type: "external", label, href, newTab: false }) as unknown as Link

export const mockFooter = {
  brandName: "ЛінОк",
  description:
    "Рибальський магазин у Житомирі. Снасті, приманки та екіпіровка для риболовлі й активного відпочинку.",
  slogan: "Там, де клює — там я!",
  ribbonText: "Ми підтримуємо програму «Ветеранський спорт»",
  ribbonLink: link(1, "Детальніше →", "/veteran"),
  sections: [
    {
      id: 10,
      title: "Каталог",
      links: [
        link(101, "Вудилища", "/catalog"),
        link(102, "Котушки", "/catalog"),
        link(103, "Приманки", "/catalog"),
        link(104, "Екіпіровка", "/catalog"),
        link(105, "Прикормка", "/catalog"),
      ],
    },
    {
      id: 20,
      title: "Магазин",
      links: [
        link(201, "Про магазин", "/about"),
        link(202, "Ветеранський спорт", "/veteran"),
        link(203, "Акції та новини", "/promos"),
        link(204, "Доставка і оплата", "/delivery"),
        link(205, "Контакти", "/contacts"),
      ],
    },
  ],
  contactTitle: "Контакти",
  contactAddress: "м. Житомир, вул. Народицька, 15",
  contactPhone: "+38 (097) 000-00-00",
  contactHours: "Пн–Нд: 9:00 – 19:00",
  copyRight: "© {YEAR} ЛінОк · Рибальський магазин",
  bottomNote: "Нова Пошта по Україні · Оплата карткою та при отриманні",
} as unknown as Data.ContentType<"api::footer.footer">
