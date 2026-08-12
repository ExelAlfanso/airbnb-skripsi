import { Elysia } from "elysia";
import { propertyCatalogModels } from "./model";
import type { PropertyCatalogRepository } from "./repository";
import {
  getPropertyDetail,
  listAmenities,
  listLocations,
  listProperties,
  listPropertyTypes,
} from "./service";

export const createPropertyCatalogModule = (
  repository: PropertyCatalogRepository
) =>
  new Elysia({ name: "PropertyCatalog" })
    .model(propertyCatalogModels)
    .get(
      "/properties",
      async ({ query, status }) => {
        const result = await listProperties(repository, query);

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
      async ({ params: { id }, status }) => {
        const result = await getPropertyDetail(repository, id);

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
    .get("/locations", () => listLocations(repository), {
      response: {
        200: "catalogLocationsResponse",
      },
    })
    .get("/property-types", () => listPropertyTypes(repository), {
      response: {
        200: "catalogPropertyTypesResponse",
      },
    })
    .get("/amenities", () => listAmenities(repository), {
      response: {
        200: "catalogAmenitiesResponse",
      },
    });
