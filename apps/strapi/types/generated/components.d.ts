import type { Schema, Struct } from "@strapi/strapi"

export interface ElementsSpecRow extends Struct.ComponentSchema {
  collectionName: "components_elements_spec_rows"
  info: {
    description: "A key–value specification row."
    displayName: "SpecRow"
  }
  attributes: {
    label: Schema.Attribute.String
    value: Schema.Attribute.String
  }
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: "components_elements_stats"
  info: {
    description: 'A single figure: value and its label ("8 років" / "на ринку").'
    displayName: "Stat"
  }
  attributes: {
    label: Schema.Attribute.String
    value: Schema.Attribute.String
  }
}

export interface ElementsStepCard extends Struct.ComponentSchema {
  collectionName: "components_elements_step_cards"
  info: {
    description: "A single numbered step: number, title and text."
    displayName: "StepCard"
  }
  attributes: {
    number: Schema.Attribute.String
    text: Schema.Attribute.Text
    title: Schema.Attribute.String
  }
}

export interface ElementsProductCard extends Struct.ComponentSchema {
  collectionName: "components_elements_product_cards"
  info: {
    description: "A product tile: image, badge, category, name and price."
    displayName: "ProductCard"
  }
  attributes: {
    badge: Schema.Attribute.String
    badgeColor: Schema.Attribute.Enumeration<["bronze", "sale", "stock"]> &
      Schema.Attribute.DefaultTo<"bronze">
    category: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    name: Schema.Attribute.String
    oldPrice: Schema.Attribute.String
    price: Schema.Attribute.String
  }
}

export interface ElementsInfoCard extends Struct.ComponentSchema {
  collectionName: "components_elements_info_cards"
  info: {
    description: "A generic card: badge, title, text, link and image."
    displayName: "InfoCard"
  }
  attributes: {
    badge: Schema.Attribute.String
    highlight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    note: Schema.Attribute.String
    noteColor: Schema.Attribute.Enumeration<["bronze", "free"]> &
      Schema.Attribute.DefaultTo<"bronze">
    text: Schema.Attribute.Text
    title: Schema.Attribute.String
  }
}

export interface ElementsNewsCard extends Struct.ComponentSchema {
  collectionName: "components_elements_news_cards"
  info: {
    description: "A horizontal news item: image, date, title, text and link."
    displayName: "NewsCard"
  }
  attributes: {
    date: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    text: Schema.Attribute.Text
    title: Schema.Attribute.String
  }
}

export interface ElementsCartItem extends Struct.ComponentSchema {
  collectionName: "components_elements_cart_items"
  info: {
    description: "A single cart line: image, name, option and price."
    displayName: "CartItem"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    name: Schema.Attribute.String
    option: Schema.Attribute.String
    price: Schema.Attribute.String
  }
}

export interface ElementsCategoryCard extends Struct.ComponentSchema {
  collectionName: "components_elements_category_cards"
  info: {
    description: "A single category tile: image, label and item count."
    displayName: "CategoryCard"
  }
  attributes: {
    count: Schema.Attribute.String
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    label: Schema.Attribute.String
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface ElementsFooterItem extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_items"
  info: {
    description: ""
    displayName: "FooterItem"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface LayoutNavbarItem extends Struct.ComponentSchema {
  collectionName: "components_layout_navbar_items"
  info: {
    displayName: "NavbarItem"
  }
  attributes: {
    categoryItems: Schema.Attribute.Component<"utilities.link", true>
    isCategoryLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    label: Schema.Attribute.String
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface SectionsHomeCategories extends Struct.ComponentSchema {
  collectionName: "components_sections_home_categories"
  info: {
    description: "ЛінОк homepage category grid."
    displayName: "HomeCategories"
  }
  attributes: {
    categories: Schema.Attribute.Component<"elements.category-card", true>
    link: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface SectionsCatalog extends Struct.ComponentSchema {
  collectionName: "components_sections_catalogs"
  info: {
    description: "ЛінОк catalog: filter sidebar + product grid (visual)."
    displayName: "Catalog"
  }
  attributes: {
    brands: Schema.Attribute.Component<"utilities.text", true>
    categories: Schema.Attribute.Component<"utilities.text", true>
    products: Schema.Attribute.Component<"elements.product-card", true>
    resultsLabel: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SectionsCart extends Struct.ComponentSchema {
  collectionName: "components_sections_carts"
  info: {
    description: "ЛінОк cart / checkout: items, recipient form, payment, summary (visual)."
    displayName: "Cart"
  }
  attributes: {
    delivery: Schema.Attribute.String
    discount: Schema.Attribute.String
    items: Schema.Attribute.Component<"elements.cart-item", true>
    itemsTotal: Schema.Attribute.String
    title: Schema.Attribute.String
    total: Schema.Attribute.String
  }
}

export interface SectionsCardGrid extends Struct.ComponentSchema {
  collectionName: "components_sections_card_grids"
  info: {
    description: "A grid of generic info cards (promos, features, etc.)."
    displayName: "CardGrid"
  }
  attributes: {
    align: Schema.Attribute.Enumeration<["left", "center"]> &
      Schema.Attribute.DefaultTo<"left">
    banded: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    cards: Schema.Attribute.Component<"elements.info-card", true>
    footnote: Schema.Attribute.Text
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsStory extends Struct.ComponentSchema {
  collectionName: "components_sections_stories"
  info: {
    description: "Photo beside a text column, with optional figures underneath."
    displayName: "Story"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    imageSide: Schema.Attribute.Enumeration<["left", "right"]> &
      Schema.Attribute.DefaultTo<"left">
    stats: Schema.Attribute.Component<"elements.stat", true>
    text: Schema.Attribute.Text
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: "components_sections_faqs"
  info: {
    description: "Frequently asked questions — an accordion list."
    displayName: "Faq"
  }
  attributes: {
    items: Schema.Attribute.Component<"utilities.accordions", true>
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsNews extends Struct.ComponentSchema {
  collectionName: "components_sections_news"
  info: {
    description: "A list of horizontal news cards."
    displayName: "News"
  }
  attributes: {
    items: Schema.Attribute.Component<"elements.news-card", true>
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsProduct extends Struct.ComponentSchema {
  collectionName: "components_sections_products"
  info: {
    description: "ЛінОк product detail: gallery, info, specs, related (visual)."
    displayName: "Product"
  }
  attributes: {
    availability: Schema.Attribute.String
    badge: Schema.Attribute.String
    category: Schema.Attribute.String
    deliveryNotes: Schema.Attribute.Component<"utilities.text", true>
    description: Schema.Attribute.Text
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    name: Schema.Attribute.String
    oldPrice: Schema.Attribute.String
    optionLabel: Schema.Attribute.String
    options: Schema.Attribute.Component<"utilities.text", true>
    price: Schema.Attribute.String
    rating: Schema.Attribute.String
    related: Schema.Attribute.Component<"elements.product-card", true>
    relatedTitle: Schema.Attribute.String
    specs: Schema.Attribute.Component<"elements.spec-row", true>
    veteranNote: Schema.Attribute.Text
  }
}

export interface SectionsSteps extends Struct.ComponentSchema {
  collectionName: "components_sections_steps"
  info: {
    description: "Numbered steps section (e.g. how it works)."
    displayName: "Steps"
  }
  attributes: {
    steps: Schema.Attribute.Component<"elements.step-card", true>
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsTextBlock extends Struct.ComponentSchema {
  collectionName: "components_sections_text_blocks"
  info: {
    description: "Centered eyebrow + title + text block."
    displayName: "TextBlock"
  }
  attributes: {
    eyebrow: Schema.Attribute.String
    text: Schema.Attribute.Text
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
  }
}

export interface SectionsHomePromo extends Struct.ComponentSchema {
  collectionName: "components_sections_home_promos"
  info: {
    description: "ЛінОк homepage promo banner."
    displayName: "HomePromo"
  }
  attributes: {
    link: Schema.Attribute.Component<"utilities.link", false>
    text: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SectionsHomeProgram extends Struct.ComponentSchema {
  collectionName: "components_sections_home_programs"
  info: {
    description: "ЛінОк homepage veteran-program banner."
    displayName: "HomeProgram"
  }
  attributes: {
    badge: Schema.Attribute.String
    checklist: Schema.Attribute.Component<"utilities.text", true>
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    text: Schema.Attribute.Text
    theme: Schema.Attribute.Enumeration<["dark", "light"]> &
      Schema.Attribute.DefaultTo<"dark">
    title: Schema.Attribute.String
    titleAccent: Schema.Attribute.String
    variant: Schema.Attribute.Enumeration<["band", "card"]> &
      Schema.Attribute.DefaultTo<"band">
  }
}

export interface SectionsHomeProducts extends Struct.ComponentSchema {
  collectionName: "components_sections_home_products"
  info: {
    description: "ЛінОк homepage top products grid."
    displayName: "HomeProducts"
  }
  attributes: {
    link: Schema.Attribute.Component<"utilities.link", false>
    products: Schema.Attribute.Component<"elements.product-card", true>
    title: Schema.Attribute.String
  }
}

export interface SectionsHomeHero extends Struct.ComponentSchema {
  collectionName: "components_sections_home_heroes"
  info: {
    description: "ЛінОк homepage hero: headline + CTAs and the veteran-program card."
    displayName: "HomeHero"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Component<"utilities.basic-image", false>
    eyebrow: Schema.Attribute.String
    primaryLink: Schema.Attribute.Component<"utilities.link", false>
    secondaryLink: Schema.Attribute.Component<"utilities.link", false>
    subtitle: Schema.Attribute.Text
    title: Schema.Attribute.String
    titleAccent: Schema.Attribute.String
    veteranBadge: Schema.Attribute.String
    veteranImage: Schema.Attribute.Component<"utilities.basic-image", false>
    veteranLink: Schema.Attribute.Component<"utilities.link", false>
    veteranText: Schema.Attribute.Text
    veteranTitle: Schema.Attribute.String
    veteranTitleAccent: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSeo extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seos"
  info: {
    description: ""
    displayName: "Seo"
    icon: "search"
  }
  attributes: {
    applicationName: Schema.Attribute.String
    canonicalUrl: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.Enumeration<
      [
        "all",
        "index",
        "index,follow",
        "noindex",
        "noindex,follow",
        "noindex,nofollow",
        "none",
        "noarchive",
        "nosnippet",
        "max-snippet",
      ]
    > &
      Schema.Attribute.DefaultTo<"all">
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    og: Schema.Attribute.Component<"seo-utilities.seo-og", false>
    structuredData: Schema.Attribute.JSON
    twitter: Schema.Attribute.Component<"seo-utilities.seo-twitter", false>
  }
}

export interface SeoUtilitiesSeoOg extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_ogs"
  info: {
    displayName: "SeoOg"
    icon: "oneToMany"
  }
  attributes: {
    description: Schema.Attribute.String
    image: Schema.Attribute.Media<"images">
    siteName: Schema.Attribute.String
    title: Schema.Attribute.String
    type: Schema.Attribute.Enumeration<["website", "article"]> &
      Schema.Attribute.DefaultTo<"website">
    url: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSeoTwitter extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_twitters"
  info: {
    displayName: "SeoTwitter"
    icon: "oneToMany"
  }
  attributes: {
    card: Schema.Attribute.String
    creator: Schema.Attribute.String
    creatorId: Schema.Attribute.String
    description: Schema.Attribute.String
    images: Schema.Attribute.Media<"images", true>
    siteId: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSocialIcons extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_social_icons"
  info: {
    displayName: "SocialIcons"
  }
  attributes: {
    socials: Schema.Attribute.Component<"utilities.image-with-link", true>
    title: Schema.Attribute.String
  }
}

export interface SharedFigure extends Struct.ComponentSchema {
  collectionName: "components_shared_figures"
  info: {
    displayName: "Figure"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    number: Schema.Attribute.BigInteger
    prefix: Schema.Attribute.String
    suffix: Schema.Attribute.String
  }
}

export interface SharedImageWithConfig extends Struct.ComponentSchema {
  collectionName: "components_shared_image_with_configs"
  info: {
    displayName: "ImageWithConfig"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    position: Schema.Attribute.Enumeration<["left", "right"]>
  }
}

export interface SharedImageWithTitleAndDescription
  extends Struct.ComponentSchema {
  collectionName: "components_shared_image_with_title_and_descriptions"
  info: {
    displayName: "ImageWithTitleAndDescription"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesAccordions extends Struct.ComponentSchema {
  collectionName: "components_utilities_accordions"
  info: {
    description: ""
    displayName: "Accordions"
  }
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesBasicImage extends Struct.ComponentSchema {
  collectionName: "components_utilities_basic_images"
  info: {
    displayName: "BasicImage"
  }
  attributes: {
    alt: Schema.Attribute.String
    fallbackSrc: Schema.Attribute.String
    height: Schema.Attribute.Integer
    media: Schema.Attribute.Media<"images" | "videos"> &
      Schema.Attribute.Required
    width: Schema.Attribute.Integer
  }
}

export interface UtilitiesCkEditorContent extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_contents"
  info: {
    displayName: "CkEditorContent"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesCkEditorText extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_texts"
  info: {
    displayName: "CkEditorText"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "simpleCkEditor"
        }
      >
  }
}

export interface UtilitiesImageWithLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_image_with_links"
  info: {
    description: ""
    displayName: "ImageWithLink"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface UtilitiesLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_links"
  info: {
    displayName: "Link"
  }
  attributes: {
    decorations: Schema.Attribute.Component<"utilities.link-decorations", false>
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    page: Schema.Attribute.Relation<"oneToOne", "api::page.page">
    type: Schema.Attribute.Enumeration<["external", "page"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"page">
  }
}

export interface UtilitiesLinkDecorations extends Struct.ComponentSchema {
  collectionName: "components_utilities_link_decorations"
  info: {
    displayName: "LinkDecorations"
  }
  attributes: {
    disableAnimations: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    hasIcons: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    leftIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    rightIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    size: Schema.Attribute.Enumeration<
      ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"default">
    variant: Schema.Attribute.Enumeration<
      ["default", "destructive", "outline", "secondary", "ghost", "link"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"link">
  }
}

export interface UtilitiesLinksWithTitle extends Struct.ComponentSchema {
  collectionName: "components_utilities_links_with_titles"
  info: {
    displayName: "LinksWithTitle"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesText extends Struct.ComponentSchema {
  collectionName: "components_utilities_texts"
  info: {
    displayName: "Text"
  }
  attributes: {
    text: Schema.Attribute.String
  }
}

export interface UtilitiesTipTapRichText extends Struct.ComponentSchema {
  collectionName: "components_utilities_tip_tap_rich_texts"
  info: {
    displayName: "TipTapRichText"
    icon: "layer"
  }
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.CustomField<
        "plugin::tiptap-editor.RichText",
        {
          preset: "everything"
        }
      >
  }
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "elements.cart-item": ElementsCartItem
      "elements.category-card": ElementsCategoryCard
      "elements.info-card": ElementsInfoCard
      "elements.news-card": ElementsNewsCard
      "elements.product-card": ElementsProductCard
      "elements.spec-row": ElementsSpecRow
      "elements.stat": ElementsStat
      "elements.step-card": ElementsStepCard
      "elements.footer-item": ElementsFooterItem
      "layout.navbar-item": LayoutNavbarItem
      "sections.home-categories": SectionsHomeCategories
      "sections.home-hero": SectionsHomeHero
      "sections.home-products": SectionsHomeProducts
      "sections.home-program": SectionsHomeProgram
      "sections.card-grid": SectionsCardGrid
      "sections.faq": SectionsFaq
      "sections.cart": SectionsCart
      "sections.catalog": SectionsCatalog
      "sections.home-promo": SectionsHomePromo
      "sections.news": SectionsNews
      "sections.product": SectionsProduct
      "sections.steps": SectionsSteps
      "sections.story": SectionsStory
      "sections.text-block": SectionsTextBlock
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "shared.figure": SharedFigure
      "shared.image-with-config": SharedImageWithConfig
      "shared.image-with-title-and-description": SharedImageWithTitleAndDescription
      "utilities.accordions": UtilitiesAccordions
      "utilities.basic-image": UtilitiesBasicImage
      "utilities.ck-editor-content": UtilitiesCkEditorContent
      "utilities.ck-editor-text": UtilitiesCkEditorText
      "utilities.image-with-link": UtilitiesImageWithLink
      "utilities.link": UtilitiesLink
      "utilities.link-decorations": UtilitiesLinkDecorations
      "utilities.links-with-title": UtilitiesLinksWithTitle
      "utilities.text": UtilitiesText
      "utilities.tip-tap-rich-text": UtilitiesTipTapRichText
    }
  }
}
