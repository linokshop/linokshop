import type { UID } from "@repo/strapi-types"

import StrapiCardGrid from "@/components/page-builder/components/sections/StrapiCardGrid"
import StrapiCart from "@/components/page-builder/components/sections/StrapiCart"
import StrapiCatalog from "@/components/page-builder/components/sections/StrapiCatalog"
import StrapiFaq from "@/components/page-builder/components/sections/StrapiFaq"
import StrapiHomeCategories from "@/components/page-builder/components/sections/StrapiHomeCategories"
import StrapiHomeHero from "@/components/page-builder/components/sections/StrapiHomeHero"
import StrapiHomeProducts from "@/components/page-builder/components/sections/StrapiHomeProducts"
import StrapiHomeProgram from "@/components/page-builder/components/sections/StrapiHomeProgram"
import StrapiHomePromo from "@/components/page-builder/components/sections/StrapiHomePromo"
import StrapiNews from "@/components/page-builder/components/sections/StrapiNews"
import StrapiProduct from "@/components/page-builder/components/sections/StrapiProduct"
import StrapiSteps from "@/components/page-builder/components/sections/StrapiSteps"
import StrapiStory from "@/components/page-builder/components/sections/StrapiStory"
import StrapiTextBlock from "@/components/page-builder/components/sections/StrapiTextBlock"
import StrapiCkEditorContent from "@/components/page-builder/components/utilities/StrapiCkEditorContent"
import StrapiTipTapEditorContent from "@/components/page-builder/components/utilities/StrapiTipTapEditorContent"

/**
 * Mapping of Strapi Component UID to React Component.
 *
 * Only the ЛінОк sections live in the Page dynamic zone (see the `content`
 * attribute of `api::page.page`). The rich-text utilities stay registered so a
 * section can embed them, even though they are no longer offered on their own.
 *
 * Consider improving dynamic/lazy loading of these components to reduce bundle size.
 */
export const PageContentComponents: Partial<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic component map requires any for varying prop types
  Record<UID.Component, React.ComponentType<any>>
> = {
  // Utilities (rendered inside other components, not offered in the dynamic zone)
  "utilities.ck-editor-content": StrapiCkEditorContent,
  "utilities.ck-editor-text": StrapiCkEditorContent,
  "utilities.tip-tap-rich-text": StrapiTipTapEditorContent,

  // Sections — home page
  "sections.home-hero": StrapiHomeHero,
  "sections.home-categories": StrapiHomeCategories,
  "sections.home-products": StrapiHomeProducts,
  "sections.home-program": StrapiHomeProgram,
  "sections.home-promo": StrapiHomePromo,

  // Sections — shop
  "sections.catalog": StrapiCatalog,
  "sections.product": StrapiProduct,
  "sections.cart": StrapiCart,

  // Sections — shared / content
  "sections.card-grid": StrapiCardGrid,
  "sections.faq": StrapiFaq,
  "sections.news": StrapiNews,
  "sections.steps": StrapiSteps,
  "sections.story": StrapiStory,
  "sections.text-block": StrapiTextBlock,
}
