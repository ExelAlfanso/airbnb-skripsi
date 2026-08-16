import { describe, expect, it } from "vitest";
import {
  createCatalogSearchParams,
  createDefaultFilters,
  formatPrice,
  optimizeImage,
  parseCatalogFilters,
} from "./catalog";

const RUPIAH_PRICE = /Rp\s*1\.250\.000/;

describe("catalog utilities", () => {
  it("creates an isolated default filter set", () => {
    const first = createDefaultFilters();
    const second = createDefaultFilters();

    first.amenities.push("amenity_wifi");

    expect(second).toEqual({
      amenities: [],
      bathrooms: "",
      bedrooms: "",
      beds: "",
      guests: "",
      location: "",
      maxPrice: "",
      minPrice: "",
      search: "",
      sort: "recommended",
      type: "",
    });
  });

  it("formats Indonesian Rupiah without fractional digits", () => {
    expect(formatPrice(1_250_000)).toMatch(RUPIAH_PRICE);
  });

  it("adds deterministic image optimization parameters", () => {
    expect(optimizeImage("https://example.com/image.jpg", 1200)).toBe(
      "https://example.com/image.jpg?auto=format&fit=crop&w=1200&q=78"
    );
    expect(optimizeImage("https://example.com/image.jpg?crop=faces")).toContain(
      "&auto=format&fit=crop&w=900&q=78"
    );
  });

  it("parses catalog filters from query parameters", () => {
    const filters = parseCatalogFilters(
      new URLSearchParams(
        "search=%20Bandung%20&location=loc_bandung&amenities=wifi%2Cpool%2Cwifi&sort=rating_desc"
      )
    );

    expect(filters).toEqual(
      expect.objectContaining({
        amenities: ["wifi", "pool"],
        location: "loc_bandung",
        search: "Bandung",
        sort: "rating_desc",
      })
    );
    expect(
      parseCatalogFilters(new URLSearchParams("sort=unsupported")).sort
    ).toBe("recommended");
  });

  it("serializes filters while preserving unrelated query parameters", () => {
    const filters = createDefaultFilters();
    filters.search = "Bandung";
    filters.amenities = ["amenity_wifi"];
    filters.sort = "rating_desc";

    const searchParams = createCatalogSearchParams(
      filters,
      new URLSearchParams("maze-session=abc&search=lama&sort=price_asc")
    );

    expect(searchParams.get("maze-session")).toBe("abc");
    expect(searchParams.get("search")).toBe("Bandung");
    expect(searchParams.get("amenities")).toBe("amenity_wifi");
    expect(searchParams.get("sort")).toBe("rating_desc");
    expect(
      createCatalogSearchParams(createDefaultFilters(), searchParams).toString()
    ).toBe("maze-session=abc");
  });
});
