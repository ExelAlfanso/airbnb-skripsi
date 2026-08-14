import { check, sleep } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";

export const catalogErrors = new Rate("catalog_errors");

const API_BASE_URL = (__ENV.API_BASE_URL || "http://localhost:3001").replace(
  /\/$/,
  ""
);

export function browseCatalog(thinkTime = 0.5) {
  const listResponse = http.get(
    `${API_BASE_URL}/properties?limit=4&page=1&sort=recommended`,
    { tags: { name: "list_properties" } }
  );

  const listPassed = check(listResponse, {
    "list returns 200": (response) => response.status === 200,
    "list returns properties": (response) =>
      Array.isArray(response.json("data")) && response.json("data").length > 0,
  });
  catalogErrors.add(!listPassed);

  const detailResponse = http.get(`${API_BASE_URL}/properties/prop_001`, {
    tags: { name: "property_detail" },
  });

  const detailPassed = check(detailResponse, {
    "detail returns 200": (response) => response.status === 200,
    "detail has expected id": (response) => response.json("id") === "prop_001",
  });
  catalogErrors.add(!detailPassed);

  sleep(thinkTime);
}
