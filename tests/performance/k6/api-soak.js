import { browseCatalog } from "./catalog-flow.js";

const duration = __ENV.SOAK_DURATION || "30m";
const virtualUsers = Number(__ENV.SOAK_VUS || 20);

export const options = {
  duration,
  thresholds: {
    checks: ["rate>0.99"],
    catalog_errors: ["rate<0.01"],
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
  },
  vus: virtualUsers,
};

export default function () {
  browseCatalog();
}
