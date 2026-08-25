import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  catalogOptions,
  property,
  propertyDetail,
  propertyPage,
} from "../test/fixtures";
import PropertyExplorer from "./PropertyExplorer.vue";

const catalogMocks = vi.hoisted(() => ({
  fetchCatalogOptions: vi.fn(),
  fetchPropertyDetail: vi.fn(),
  fetchPropertyPage: vi.fn(),
}));

vi.mock("../catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../catalog")>();

  return {
    ...actual,
    ...catalogMocks,
  };
});

describe("PropertyExplorer integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, "", "/");
    catalogMocks.fetchCatalogOptions.mockResolvedValue(catalogOptions);
    catalogMocks.fetchPropertyDetail.mockResolvedValue(propertyDetail);
    catalogMocks.fetchPropertyPage.mockResolvedValue(propertyPage);
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("searches, keeps local wishlist state, and opens property detail", async () => {
    const wrapper = mount(PropertyExplorer, {
      attachTo: document.body,
    });

    try {
      await flushPromises();

      expect(wrapper.text()).toContain(property.title);
      expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
        expect.objectContaining({ search: "" }),
        1
      );

      await wrapper.find('input[name="search"]').setValue("Bandung");
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "Bandung" }),
        1
      );
      expect(window.location.search).toBe("?search=Bandung");

      const wishlistButton = wrapper.find(".wishlist-button");
      expect(wishlistButton.attributes("aria-pressed")).toBe("false");

      await wishlistButton.trigger("click");
      expect(wishlistButton.attributes("aria-pressed")).toBe("true");

      await wrapper.find(".property-card__title").trigger("click");
      await flushPromises();

      expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(
        property.slug
      );
      expect(window.location.pathname).toBe(`/properties/${property.slug}`);
      expect(wrapper.text()).toContain(propertyDetail.description);
      expect(wrapper.find(".detail-wishlist").attributes("aria-pressed")).toBe(
        "true"
      );
    } finally {
      wrapper.unmount();
    }
  });

  it("applies advanced filters together and reloads from page one", async () => {
    const wrapper = mount(PropertyExplorer, {
      attachTo: document.body,
    });

    try {
      await flushPromises();

      await wrapper.find('input[name="minPrice"]').setValue("500000");
      await wrapper.find('input[name="maxPrice"]').setValue("1500000");
      await wrapper.find('input[name="guests"]').setValue("4");
      await wrapper.find('input[name="bedrooms"]').setValue("2");
      await wrapper.find('input[name="beds"]').setValue("2");
      await wrapper.find('input[name="bathrooms"]').setValue("2");
      await wrapper.find('input[value="amenity_wifi"]').setValue(true);
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          amenities: ["amenity_wifi"],
          bathrooms: "2",
          bedrooms: "2",
          beds: "2",
          guests: "4",
          maxPrice: "1500000",
          minPrice: "500000",
        }),
        1
      );
      expect(window.location.search).toContain("amenities=amenity_wifi");
    } finally {
      wrapper.unmount();
    }
  });

  it("loads a property detail page directly from its slug", async () => {
    window.history.replaceState(null, "", `/properties/${property.slug}`);
    const wrapper = mount(PropertyExplorer, {
      attachTo: document.body,
    });

    try {
      await flushPromises();

      expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(
        property.slug
      );
      expect(catalogMocks.fetchPropertyPage).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain(propertyDetail.description);

      await wrapper.find(".back-button").trigger("click");
      await flushPromises();

      expect(window.location.pathname).toBe("/");
      expect(catalogMocks.fetchPropertyPage).toHaveBeenCalled();
    } finally {
      wrapper.unmount();
    }
  });

  it("hydrates filters from the URL and restores them on popstate", async () => {
    window.history.replaceState(null, "", "/?search=Bandung&sort=rating_desc");
    const wrapper = mount(PropertyExplorer, {
      attachTo: document.body,
    });

    try {
      await flushPromises();

      expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Bandung", sort: "rating_desc" }),
        1
      );
      expect(
        (wrapper.find('input[name="search"]').element as HTMLInputElement).value
      ).toBe("Bandung");

      window.history.pushState(null, "", "/?location=loc_bandung");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await flushPromises();

      expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ location: "loc_bandung", search: "" }),
        1
      );
      expect(
        (wrapper.find('select[name="location"]').element as HTMLSelectElement)
          .value
      ).toBe("loc_bandung");
    } finally {
      wrapper.unmount();
    }
  });
});
