import { Elysia } from "elysia";
import { propertyCatalogModels } from "./model";
import {
  getPropertyDetail,
  listAmenities,
  listLocations,
  listProperties,
  listPropertyTypes,
} from "./service";

export const propertyCatalogModule = new Elysia({ name: "PropertyCatalog" })
  .model(propertyCatalogModels)
  .get(
    "/properties",
    ({ query, status }) => {
      const result = listProperties(query);

      if (!result.ok) {
        return status(400, result.error);
      }

      return result.value;
    },
    {
      response: {
        200: "catalogPropertyListResponse",
        400: "catalogApiErrorResponse",
      },
    }
  )
  .get(
    "/properties/:id",
    ({ params: { id }, status }) => {
      const result = getPropertyDetail(id);

      if (!result.ok) {
        return status(404, result.error);
      }

      return result.value;
    },
    {
      params: "catalogPropertyIdParams",
      response: {
        200: "catalogPropertyDetail",
        404: "catalogApiErrorResponse",
      },
    }
  )
  .get("/locations", () => listLocations(), {
    response: {
      200: "catalogLocationsResponse",
    },
  })
  .get("/property-types", () => listPropertyTypes(), {
    response: {
      200: "catalogPropertyTypesResponse",
    },
  })
  .get("/amenities", () => listAmenities(), {
    response: {
      200: "catalogAmenitiesResponse",
    },
  });
