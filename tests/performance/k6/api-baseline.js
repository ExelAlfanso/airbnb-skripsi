import { browseCatalog } from "./catalog-flow.js";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "2m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    checks: ["rate>0.99"],
    catalog_errors: ["rate<0.01"],
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    "http_req_duration{name:list_properties}": ["p(95)<500"],
    "http_req_duration{name:property_detail}": ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  browseCatalog();
}
