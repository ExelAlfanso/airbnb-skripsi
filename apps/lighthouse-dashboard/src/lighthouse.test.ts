import { describe, expect, it } from "vitest";
import {
  inferFramework,
  METRIC_DEFINITIONS,
  median,
  metricStatus,
  parseLighthouseReport,
} from "./lighthouse";

const reportFixture = JSON.stringify({
  audits: {
    "cumulative-layout-shift": { numericValue: 0.02 },
    "first-contentful-paint": { numericValue: 1200 },
    "largest-contentful-paint": {
      description: "Render the largest element sooner.",
      displayValue: "1.9 s",
      numericValue: 1900,
      score: 0.8,
      title: "Largest Contentful Paint",
    },
    "resource-summary": {
      details: {
        items: [
          { requestCount: 12, resourceType: "total", transferSize: 2048 },
          { requestCount: 2, resourceType: "script", transferSize: 1024 },
        ],
      },
    },
    "speed-index": { numericValue: 1500 },
    "total-blocking-time": { numericValue: 30 },
  },
  categories: {
    accessibility: { auditRefs: [], score: 0.95 },
    "best-practices": { auditRefs: [], score: 1 },
    performance: {
      auditRefs: [{ id: "largest-contentful-paint" }],
      score: 0.91,
    },
    seo: { auditRefs: [], score: 0.83 },
  },
  configSettings: { formFactor: "desktop" },
  fetchTime: "2026-08-26T02:36:40.528Z",
  finalDisplayedUrl: "http://localhost:3000/",
  lighthouseVersion: "12.6.1",
  runWarnings: ["Example warning"],
});

describe("Lighthouse report parser", () => {
  it("extracts metrics, framework, scores, and actionable audits", () => {
    const report = parseLighthouseReport(
      reportFixture,
      "run.report.json",
      "lighthouse/vue/run.report.json"
    );

    expect(report.framework).toBe("vue");
    expect(report.metrics.performance).toBe(91);
    expect(report.metrics.lcp).toBe(1900);
    expect(report.metrics.transferSize).toBe(2048);
    expect(report.metrics.requestCount).toBe(12);
    expect(report.scores.accessibility).toBe(95);
    expect(report.audits[0]?.id).toBe("largest-contentful-paint");
    expect(report.warnings).toEqual(["Example warning"]);
  });

  it("rejects JSON that is not a complete Lighthouse report", () => {
    expect(() => parseLighthouseReport("{}", "manifest.json")).toThrow(
      "bukan report Lighthouse lengkap"
    );
  });
});

describe("summary helpers", () => {
  it("calculates odd and even medians without mutating the input", () => {
    const values = [3, 1, 2];

    expect(median(values)).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(values).toEqual([3, 1, 2]);
  });

  it("uses report folders first and local ports as a fallback", () => {
    expect(inferFramework("lighthouse/svelte/run.json", "http://x.test")).toBe(
      "svelte"
    );
    expect(inferFramework("run.json", "http://localhost:3002/")).toBe("react");
  });

  it("maps metric thresholds to readable states", () => {
    expect(metricStatus(2400, METRIC_DEFINITIONS[2])).toBe("good");
    expect(metricStatus(3200, METRIC_DEFINITIONS[2])).toBe("needs-improvement");
    expect(metricStatus(4500, METRIC_DEFINITIONS[2])).toBe("poor");
  });
});
