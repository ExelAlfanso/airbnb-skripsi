import { browseCatalog } from "./catalog-flow.js";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 25 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    checks: ["rate>0.98"],
    catalog_errors: ["rate<0.02"],
    http_req_duration: ["p(95)<1000", "p(99)<2000"],
    http_req_failed: ["rate<0.02"],
  },
};

export default function () {
  browseCatalog(0.25);
}
