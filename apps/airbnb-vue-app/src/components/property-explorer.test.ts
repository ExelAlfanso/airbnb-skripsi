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

      const wishlistButton = wrapper.find(".wishlist-button");
      expect(wishlistButton.attributes("aria-pressed")).toBe("false");

      await wishlistButton.trigger("click");
      expect(wishlistButton.attributes("aria-pressed")).toBe("true");

      await wrapper.find(".property-card__title").trigger("click");
      await flushPromises();

      expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(
        property.id
      );
      expect(wrapper.text()).toContain(propertyDetail.description);
      expect(wrapper.find(".detail-wishlist").attributes("aria-pressed")).toBe(
        "true"
      );
    } finally {
      wrapper.unmount();
    }
  });
});
