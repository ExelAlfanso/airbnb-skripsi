import { browseCatalog } from "./catalog-flow.js";

export const options = {
  scenarios: {
    normal: {
      executor: "constant-vus",
      duration: "40s",
      gracefulStop: "5s",
      tags: { phase: "normal" },
      vus: 5,
    },
    spike: {
      executor: "ramping-vus",
      gracefulStop: "5s",
      stages: [
        { duration: "10s", target: 75 },
        { duration: "20s", target: 75 },
        { duration: "10s", target: 0 },
      ],
      startTime: "40s",
      startVUs: 5,
      tags: { phase: "spike" },
    },
    recovery: {
      executor: "constant-vus",
      duration: "40s",
      gracefulStop: "5s",
      startTime: "1m20s",
      tags: { phase: "recovery" },
      vus: 5,
    },
  },
  thresholds: {
    "http_req_duration{phase:normal}": ["p(95)<500"],
    "http_req_duration{phase:recovery}": ["p(95)<600"],
    "http_req_failed{phase:recovery}": ["rate<0.01"],
  },
};

export default function () {
  browseCatalog(0.25);
}
