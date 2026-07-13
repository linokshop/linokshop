import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    /**
     * GET /API/categories/counts?locale=uk
     *
     * How many published products sit in each category. Strapi cannot return
     * facet counts alongside a normal `find`, and asking per category would be
     * one request per row — this answers the whole sidebar in a single query.
     */
    async counts(ctx) {
      const locale = (ctx.query.locale as string) || "uk"

      const categories = await strapi.db
        .query("api::category.category")
        .findMany({
          select: ["id", "documentId", "name", "slug"],
          where: { publishedAt: { $notNull: true }, locale },
          orderBy: [{ order: "asc" }, { name: "asc" }],
        })

      const rows: { category_id: number; count: string | number }[] =
        await strapi.db
          .connection("products")
          .join(
            "products_category_lnk",
            "products.id",
            "products_category_lnk.product_id"
          )
          .whereNotNull("products.published_at")
          .andWhere("products.locale", locale)
          .groupBy("products_category_lnk.category_id")
          .select("products_category_lnk.category_id")
          .count("* as count")

      const countByRowId = new Map(
        rows.map((row) => [row.category_id, Number(row.count)])
      )

      ctx.body = {
        data: categories.map((category) => ({
          documentId: category.documentId,
          name: category.name,
          slug: category.slug,
          count: countByRowId.get(category.id) ?? 0,
        })),
      }
    },
  })
)
