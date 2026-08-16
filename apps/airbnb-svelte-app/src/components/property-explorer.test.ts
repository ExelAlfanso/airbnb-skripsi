import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  catalogOptions,
  property,
  propertyDetail,
  propertyPage,
} from "../test/fixtures";
import PropertyExplorer from "./PropertyExplorer.svelte";

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
    const user = userEvent.setup();
    render(PropertyExplorer);

    await screen.findByText(property.title);
    expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
      expect.objectContaining({ search: "" }),
      1
    );

    await user.type(screen.getByRole("searchbox"), "Bandung");
    await user.click(screen.getByRole("button", { name: "Cari properti" }));

    await waitFor(() => {
      expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "Bandung" }),
        1
      );
    });
    expect(window.location.search).toBe("?search=Bandung");

    const wishlistButton = screen.getByRole("button", {
      name: `Simpan ${property.title} ke wishlist`,
    });
    expect(wishlistButton.getAttribute("aria-pressed")).toBe("false");

    await user.click(wishlistButton);
    expect(wishlistButton.getAttribute("aria-pressed")).toBe("true");

    await user.click(
      screen.getByRole("button", {
        name: property.title,
      })
    );

    await screen.findByText(propertyDetail.description);
    expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(property.id);
    expect(
      screen
        .getByRole("button", { name: "Tersimpan" })
        .getAttribute("aria-pressed")
    ).toBe("true");
  });

  it("hydrates filters from the URL and restores them on popstate", async () => {
    window.history.replaceState(null, "", "/?search=Bandung&sort=rating_desc");
    render(PropertyExplorer);

    await screen.findByText(property.title);
    expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Bandung", sort: "rating_desc" }),
      1
    );
    expect(screen.getByRole("searchbox")).toHaveValue("Bandung");

    window.history.pushState(null, "", "/?location=loc_bandung");
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() => {
      expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ location: "loc_bandung", search: "" }),
        1
      );
    });
    expect(screen.getByRole("combobox", { name: "Lokasi" })).toHaveValue(
      "loc_bandung"
    );
  });
});
