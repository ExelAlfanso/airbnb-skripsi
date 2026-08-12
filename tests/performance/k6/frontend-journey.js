import { check, fail } from "k6";
import { browser } from "k6/browser";
import { Rate } from "k6/metrics";

const FRONTEND_URL = __ENV.FRONTEND_URL || "http://localhost:3000";
const SEARCH_RESPONSE_PATTERN = /\/properties\?.*search=Lembang/;
const framework = __ENV.FRAMEWORK || "unknown";
const journeyErrors = new Rate("journey_errors");

export const options = {
  scenarios: {
    frontendJourney: {
      executor: "shared-iterations",
      iterations: Number(__ENV.ITERATIONS || 3),
      options: {
        browser: {
          type: "chromium",
        },
      },
      tags: { framework },
      vus: 1,
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
    browser_web_vital_cls: ["p(90)<0.1"],
    browser_web_vital_inp: ["p(90)<200"],
    browser_web_vital_lcp: ["p(90)<2500"],
    journey_errors: ["rate<0.01"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto(FRONTEND_URL, { waitUntil: "domcontentloaded" });

    const card = page.locator(".property-card").first();
    await card.waitFor();

    const search = page.locator('input[name="search"]');
    await search.fill("Lembang");
    const searchResponsePromise = page.waitForResponse(SEARCH_RESPONSE_PATTERN);
    await page.locator(".search-button").click();
    const searchResponse = await searchResponsePromise;
    check(searchResponse, {
      "search API returns 200": (response) => response.status() === 200,
    });
    await page.getByText("2 properti ditemukan", { exact: true }).waitFor();
    await card.waitFor();

    await page.locator(".wishlist-button").first().click();
    await page.locator(".property-card__title").first().click();

    const detail = page.locator(".detail");
    await detail.waitFor();
    const detailTitle = await page.locator(".detail h1").textContent();

    check(detailTitle, {
      "property detail is visible": (title) => Boolean(title?.trim()),
    });
    journeyErrors.add(false);
  } catch (error) {
    journeyErrors.add(true);
    fail(`${framework} browser journey failed: ${String(error)}`);
  } finally {
    await page.close();
  }
}
