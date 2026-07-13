import type { PopulateOverrideEntries } from "@notum-cz/strapi-plugin-smart-populate/types"
import type { Modules, UID } from "@strapi/strapi"

type ComponentPopulateMap = {
  [TComponentUID in UID.Component]: Required<
    Modules.Documents.Params.Pick<TComponentUID, "populate:object">
  >["populate"]
}

const populateOverrides = [
  {
    componentUid: "utilities.link",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      page: {
        fields: ["fullPath"],
      },
    },
  },
  {
    // The home rail links to real products; without this the tiles would render
    // with no photo and no category label.
    componentUid: "sections.home-products",
    mergeWithGeneratedPopulate: true,
    overridePopulate: {
      products: {
        populate: {
          images: true,
          category: true,
        },
      },
    },
  },
] satisfies PopulateOverrideEntries<ComponentPopulateMap>

export function smartPopulateConfig() {
  return {
    enabled: true,
    config: {
      populateOverrides,
    },
  }
}
