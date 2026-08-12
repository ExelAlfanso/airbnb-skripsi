"use strict";

const AGGREGATION_METHOD = "median";

function createLighthouseConfig({ artifactName, frontendPackage, url }) {
  return {
    ci: {
      assert: {
        assertions: {
          "categories:performance": [
            "error",
            { aggregationMethod: AGGREGATION_METHOD, minScore: 0.9 },
          ],
          "cumulative-layout-shift": [
            "error",
            { aggregationMethod: AGGREGATION_METHOD, maxNumericValue: 0.1 },
          ],
          interactive: [
            "error",
            { aggregationMethod: AGGREGATION_METHOD, maxNumericValue: 5000 },
          ],
          "largest-contentful-paint": [
            "error",
            { aggregationMethod: AGGREGATION_METHOD, maxNumericValue: 2500 },
          ],
          "resource-summary:script:size": [
            "warn",
            {
              aggregationMethod: AGGREGATION_METHOD,
              maxNumericValue: 150_000,
            },
          ],
          "total-blocking-time": [
            "error",
            { aggregationMethod: AGGREGATION_METHOD, maxNumericValue: 200 },
          ],
        },
      },
      collect: {
        numberOfRuns: 3,
        settings: {
          preset: "desktop",
          ...(process.env.LIGHTHOUSE_CHROME_PORT
            ? { port: Number(process.env.LIGHTHOUSE_CHROME_PORT) }
            : {}),
        },
        startServerCommand: `node tests/performance/start-lighthouse-servers.cjs ${frontendPackage} ${url}`,
        startServerReadyPattern: "LHCI_READY",
        startServerReadyTimeout: 45_000,
        url: [url],
      },
      upload: {
        outputDir: `artifacts/lighthouse/${artifactName}`,
        target: "filesystem",
      },
    },
  };
}

module.exports = { createLighthouseConfig };
