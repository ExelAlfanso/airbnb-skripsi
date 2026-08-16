import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  catalogOptions,
  property,
  propertyDetail,
  propertyPage,
} from "../test/fixtures";
import PropertyExplorer from "./property-explorer";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const catalogMocks = vi.hoisted(() => ({
  fetchCatalogOptions: vi.fn(),
  fetchPropertyDetail: vi.fn(),
  fetchPropertyPage: vi.fn(),
}));

vi.mock("../catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../catalog")>();
  return { ...actual, ...catalogMocks };
});

let container: HTMLDivElement;
let root: Root;

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

async function renderExplorer() {
  await act(() => root.render(<PropertyExplorer />));
  await flush();
}

function getElement<T extends Element>(selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing test element: ${selector}`);
  }
  return element;
}

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
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(() => root.unmount());
    container.remove();
  });

  it("searches, keeps local wishlist state, and opens property detail", async () => {
    await renderExplorer();
    expect(container.textContent).toContain(property.title);
    expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
      expect.objectContaining({ search: "" }),
      1
    );

    const search = getElement<HTMLInputElement>('input[name="search"]');
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(search, "Bandung");
      search.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(() => getElement<HTMLFormElement>("form").requestSubmit());
    await flush();

    expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "Bandung" }),
      1
    );
    expect(window.location.search).toBe("?search=Bandung");

    const wishlist = getElement<HTMLButtonElement>(".wishlist-button");
    expect(wishlist.getAttribute("aria-pressed")).toBe("false");
    await act(() => wishlist.click());
    expect(wishlist.getAttribute("aria-pressed")).toBe("true");

    await act(() =>
      getElement<HTMLButtonElement>(".property-card__title").click()
    );
    await flush();
    expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(
      property.slug
    );
    expect(window.location.pathname).toBe(`/properties/${property.slug}`);
    expect(container.textContent).toContain(propertyDetail.description);
    expect(
      getElement<HTMLButtonElement>(".detail-wishlist").getAttribute(
        "aria-pressed"
      )
    ).toBe("true");
  });

  it("loads a property detail page directly from its slug", async () => {
    window.history.replaceState(null, "", `/properties/${property.slug}`);
    await renderExplorer();

    expect(catalogMocks.fetchPropertyDetail).toHaveBeenCalledWith(
      property.slug
    );
    expect(catalogMocks.fetchPropertyPage).not.toHaveBeenCalled();
    expect(container.textContent).toContain(propertyDetail.description);

    await act(() => getElement<HTMLButtonElement>(".back-button").click());
    await flush();
    expect(window.location.pathname).toBe("/");
    expect(catalogMocks.fetchPropertyPage).toHaveBeenCalled();
  });

  it("hydrates filters from the URL and restores them on popstate", async () => {
    window.history.replaceState(null, "", "/?search=Bandung&sort=rating_desc");
    await renderExplorer();

    expect(catalogMocks.fetchPropertyPage).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Bandung", sort: "rating_desc" }),
      1
    );
    expect(getElement<HTMLInputElement>('input[name="search"]').value).toBe(
      "Bandung"
    );

    window.history.pushState(null, "", "/?location=loc_bandung");
    await act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    await flush();

    expect(catalogMocks.fetchPropertyPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ location: "loc_bandung", search: "" }),
      1
    );
    expect(getElement<HTMLSelectElement>('select[name="location"]').value).toBe(
      "loc_bandung"
    );
  });
});
