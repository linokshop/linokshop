/**
 * Custom route in its own file: `createCoreRouter` owns `routes/category.ts` and
 * would overwrite anything added there. The file name also has to sort before
 * `category.ts` so `/categories/counts` is matched before `/categories/:id`.
 *
 * `auth: false` because Strapi's read-only API token (what the UI holds) only
 * grants the built-in `find` / `findOne` actions — a custom action is 403 for it.
 * The route is safe to leave open: it returns nothing but the number of
 * published products per published category, which the catalog shows anyway.
 */
export default {
  routes: [
    {
      method: "GET",
      path: "/categories/counts",
      handler: "category.counts",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
}
