import { describe, expect, it } from "vitest";
import { createDefaultFilters, formatPrice, optimizeImage } from "./catalog";

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
});
