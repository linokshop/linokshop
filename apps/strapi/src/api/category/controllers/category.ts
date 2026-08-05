import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    /**
     * GET /API/categories/counts?locale=uk
     *
     * How many published products sit in each **subcategory** (products attach to
     * subcategories, not directly to categories). Keyed by subcategory slug; the
     * UI rolls these up per category. One query answers the whole sidebar — Strapi
     * cannot return facet counts alongside a normal `find`.
     */
    async counts(ctx) {
      const locale = (ctx.query.locale as string) || "uk"

      const subcategories = await strapi.db
        .query("api::subcategory.subcategory")
        .findMany({
          select: ["id", "documentId", "name", "slug"],
          where: { publishedAt: { $notNull: true }, locale },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        })

      const rows: { subcategory_id: number; count: string | number }[] =
        await strapi.db
          .connection("products")
          .join(
            "products_subcategory_lnk",
            "products.id",
            "products_subcategory_lnk.product_id"
          )
          .whereNotNull("products.published_at")
          .andWhere("products.locale", locale)
          .groupBy("products_subcategory_lnk.subcategory_id")
          .select("products_subcategory_lnk.subcategory_id")
          .count("* as count")

      const countByRowId = new Map(
        rows.map((row) => [row.subcategory_id, Number(row.count)])
      )

      // Same shape one level down, for subcategories that have a third level
      // (e.g. Вудилища → Поплавочні → Болонські/Махові). Most subcategories have
      // none, so this is usually a short list.
      const subSubcategories = await strapi.db
        .query("api::sub-subcategory.sub-subcategory")
        .findMany({
          select: ["id", "documentId", "name", "slug"],
          where: { publishedAt: { $notNull: true }, locale },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        })

      const subSubRows: {
        sub_subcategory_id: number
        count: string | number
      }[] = await strapi.db
        .connection("products")
        .join(
          "products_sub_subcategory_lnk",
          "products.id",
          "products_sub_subcategory_lnk.product_id"
        )
        .whereNotNull("products.published_at")
        .andWhere("products.locale", locale)
        .groupBy("products_sub_subcategory_lnk.sub_subcategory_id")
        .select("products_sub_subcategory_lnk.sub_subcategory_id")
        .count("* as count")

      const countBySubSubRowId = new Map(
        subSubRows.map((row) => [row.sub_subcategory_id, Number(row.count)])
      )

      ctx.body = {
        data: subcategories.map((subcategory) => ({
          documentId: subcategory.documentId,
          name: subcategory.name,
          slug: subcategory.slug,
          count: countByRowId.get(subcategory.id) ?? 0,
        })),
        subSubcategories: subSubcategories.map((subSubcategory) => ({
          documentId: subSubcategory.documentId,
          name: subSubcategory.name,
          slug: subSubcategory.slug,
          count: countBySubSubRowId.get(subSubcategory.id) ?? 0,
        })),
      }
    },
  })
)
