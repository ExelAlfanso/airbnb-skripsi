import { describe, expect, test } from "bun:test";
import { app } from "../src/app";

describe("property catalog routes", () => {
  test("GET /properties returns paginated property list items", async () => {
    const response = await app.handle(
      new Request("http://localhost/properties")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(6);
    expect(body.data[0]).toMatchObject({
      id: "prop_004",
      title: "Kabin Kayu Tenang di Kaliurang",
      isGuestFavorite: true,
      isWishlisted: false,
    });
    expect(body.data[0].coverImage).toMatchObject({
      propertyId: "prop_004",
      isCover: true,
    });
    expect(body.meta).toEqual({
      page: 1,
      limit: 12,
      total: 6,
      totalPages: 1,
      hasMore: false,
    });
  });

  test("GET /properties applies search, filters, sorting, and pagination", async () => {
    const response = await app.handle(
      new Request(
        "http://localhost/properties?search=villa&type=villa&amenities=amenity_pool,wifi&sort=price_desc&page=1&limit=1"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe("prop_006");
    expect(body.meta).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
      hasMore: true,
    });
  });

  test("GET /properties returns validation error for invalid query", async () => {
    const response = await app.handle(
      new Request("http://localhost/properties?minPrice=100&maxPrice=50")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid query parameter",
        details: {
          field: "maxPrice",
          reason: "maxPrice must be greater than or equal to minPrice",
        },
      },
    });
  });

  test("GET /properties/:id returns property detail", async () => {
    const response = await app.handle(
      new Request("http://localhost/properties/prop_001")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: "prop_001",
      title: "Villa Tropis dengan Kolam Renang",
      host: {
        id: "host_001",
        name: "Made Pratama",
      },
      location: {
        id: "loc_bali_canggu",
      },
      propertyType: {
        id: "type_villa",
      },
      isWishlisted: false,
    });
    expect(body.coverImage).toBeUndefined();
    expect(body.images.length).toBeGreaterThan(1);
    expect(
      body.amenities.map((amenity: { id: string }) => amenity.id)
    ).toContain("amenity_pool");
  });

  test("GET /properties/:id returns not found error", async () => {
    const response = await app.handle(
      new Request("http://localhost/properties/prop_missing")
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: {
        code: "PROPERTY_NOT_FOUND",
        message: "Property not found",
      },
    });
  });

  test("reference endpoints return ERD reference data", async () => {
    const [locationsResponse, typesResponse, amenitiesResponse] =
      await Promise.all([
        app.handle(new Request("http://localhost/locations")),
        app.handle(new Request("http://localhost/property-types")),
        app.handle(new Request("http://localhost/amenities")),
      ]);

    expect(locationsResponse.status).toBe(200);
    expect(typesResponse.status).toBe(200);
    expect(amenitiesResponse.status).toBe(200);

    const locations = await locationsResponse.json();
    const propertyTypes = await typesResponse.json();
    const amenities = await amenitiesResponse.json();

    expect(locations.map((location: { id: string }) => location.id)).toContain(
      "loc_bali_canggu"
    );
    expect(
      propertyTypes.map((propertyType: { slug: string }) => propertyType.slug)
    ).toContain("villa");
    expect(amenities.map((amenity: { id: string }) => amenity.id)).toContain(
      "amenity_wifi"
    );
  });
});
