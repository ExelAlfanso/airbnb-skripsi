import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Browser, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const CPU_THROTTLE_RATE = 4;
const EVENT_DURATION_THRESHOLD_MS = 16;
const RESULTS_PATH = resolve("artifacts/inp/results.json");
const VIEWPORT = { height: 844, width: 390 };
const WISHLIST_BUTTON_NAME =
  /^(?:Simpan|Hapus) Villa Tropis dengan Kolam Renang (?:ke|dari) wishlist$/;

const frameworks = {
  svelte: "http://127.0.0.1:5174/",
  vue: "http://127.0.0.1:3100/",
} as const;

type Framework = keyof typeof frameworks;
type Scenario = "advanced-filter" | "search" | "wishlist";

interface InpEntry {
  duration: number;
  interactionId: number;
  name: string;
  startTime: number;
}

interface Measurement {
  belowReportingThreshold: boolean;
  entries: InpEntry[];
  inpMs: number;
}

interface Observation extends Measurement {
  framework: Framework;
  frameworkPosition: number;
  run: number;
  scenario: Scenario;
  scenarioPosition: number;
}

interface Summary {
  framework: Framework;
  iqrMs: number;
  maxMs: number;
  medianMs: number;
  minMs: number;
  q1Ms: number;
  q3Ms: number;
  runs: number;
  scenario: Scenario;
}

type InpWindow = typeof window & {
  __inpEntries?: InpEntry[];
  __inpObserver?: PerformanceObserver;
};

const scenarioOrders: Scenario[][] = [
  ["search", "advanced-filter", "wishlist"],
  ["advanced-filter", "wishlist", "search"],
  ["wishlist", "search", "advanced-filter"],
];

const frameworkOrders: Framework[][] = [
  ["vue", "svelte"],
  ["svelte", "vue"],
  ["vue", "svelte"],
];

test("measures three scripted INP scenarios across three controlled runs", async ({
  browser,
}) => {
  const observations: Observation[] = [];

  for (const [runIndex, frameworkOrder] of frameworkOrders.entries()) {
    for (const [frameworkIndex, framework] of frameworkOrder.entries()) {
      for (const [scenarioIndex, scenario] of scenarioOrders[
        runIndex
      ].entries()) {
        const measurement = await measureScenario(
          browser,
          frameworks[framework],
          scenario
        );

        observations.push({
          ...measurement,
          framework,
          frameworkPosition: frameworkIndex + 1,
          run: runIndex + 1,
          scenario,
          scenarioPosition: scenarioIndex + 1,
        });
      }
    }
  }

  const report = {
    metadata: {
      browser: browser.version(),
      cachePolicy: "fresh browser context per observation",
      cpuThrottleRate: CPU_THROTTLE_RATE,
      eventDurationThresholdMs: EVENT_DURATION_THRESHOLD_MS,
      gitCommit: execFileSync("git", ["rev-parse", "HEAD"], {
        encoding: "utf8",
        windowsHide: true,
      }).trim(),
      generatedAt: new Date().toISOString(),
      metric: "scripted session INP",
      runsPerScenario: 3,
      viewport: VIEWPORT,
    },
    observations,
    summaries: summarize(observations),
  };

  mkdirSync(dirname(RESULTS_PATH), { recursive: true });
  writeFileSync(RESULTS_PATH, `${JSON.stringify(report, null, 2)}\n`);

  expect(observations).toHaveLength(18);
  expect(report.summaries).toHaveLength(6);
  for (const summary of report.summaries) {
    expect(summary.runs).toBe(3);
  }
});

async function measureScenario(
  browser: Browser,
  baseUrl: string,
  scenario: Scenario
): Promise<Measurement> {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    locale: "id-ID",
    viewport: VIEWPORT,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", {
    rate: CPU_THROTTLE_RATE,
  });

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "6 properti ditemukan" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cari properti" })
    ).toBeEnabled();

    if (scenario === "search") {
      await page.getByLabel("Cari").fill("Canggu");
      await startMeasurement(page);
      await page.getByRole("button", { name: "Cari properti" }).click();
      await expect(
        page.getByRole("heading", { name: "2 properti ditemukan" })
      ).toBeVisible();
    } else if (scenario === "advanced-filter") {
      await page
        .getByLabel("Lokasi")
        .selectOption({ label: "Senggigi, Lombok" });
      await page.getByLabel("Tipe").selectOption({ label: "Villa" });
      await page.getByText("Filter lanjutan", { exact: true }).click();
      await page.getByLabel("Tamu minimum").fill("6");
      await startMeasurement(page);
      await page.getByLabel("Kitchen").check();
      const measurement = await finishMeasurement(page);
      await page.goto(
        `${baseUrl}?location=loc_lombok_senggigi&type=villa&guests=6&amenities=amenity_kitchen`,
        { waitUntil: "domcontentloaded" }
      );
      await expect(
        page.getByRole("heading", { name: "1 properti ditemukan" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", {
          exact: true,
          name: "Villa Pantai Senggigi untuk Grup",
        })
      ).toBeVisible();
      return measurement;
    } else {
      const wishlist = page.getByRole("button", {
        name: WISHLIST_BUTTON_NAME,
      });
      await startMeasurement(page);
      await wishlist.click();
      await expect(wishlist).toHaveAttribute("aria-pressed", "true");
    }

    return await finishMeasurement(page);
  } finally {
    await context.close();
  }
}

async function startMeasurement(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (!PerformanceObserver.supportedEntryTypes.includes("event")) {
      throw new Error("This browser does not support Event Timing entries");
    }

    const target = window as InpWindow;
    target.__inpObserver?.disconnect();
    target.__inpEntries = [];
    target.__inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        if (entry.interactionId > 0) {
          target.__inpEntries?.push({
            duration: entry.duration,
            interactionId: entry.interactionId,
            name: entry.name,
            startTime: entry.startTime,
          });
        }
      }
    });
    target.__inpObserver.observe({
      durationThreshold: 16,
      type: "event",
    } as PerformanceObserverInit & { durationThreshold: number });
  });
}

async function finishMeasurement(page: Page): Promise<Measurement> {
  await page.evaluate(
    () =>
      new Promise<void>((resolveFrame) => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolveFrame())
        );
      })
  );
  await page.waitForTimeout(50);

  return await page.evaluate((threshold) => {
    const target = window as InpWindow;
    const pending = (target.__inpObserver?.takeRecords() ??
      []) as PerformanceEventTiming[];

    for (const entry of pending) {
      if (entry.interactionId > 0) {
        target.__inpEntries?.push({
          duration: entry.duration,
          interactionId: entry.interactionId,
          name: entry.name,
          startTime: entry.startTime,
        });
      }
    }

    target.__inpObserver?.disconnect();
    const entries = target.__inpEntries ?? [];
    const interactionDurations = new Map<number, number>();

    for (const entry of entries) {
      interactionDurations.set(
        entry.interactionId,
        Math.max(
          interactionDurations.get(entry.interactionId) ?? 0,
          entry.duration
        )
      );
    }

    if (interactionDurations.size === 0) {
      return {
        belowReportingThreshold: true,
        entries,
        inpMs: threshold,
      };
    }

    return {
      belowReportingThreshold: false,
      entries,
      inpMs: Math.max(...interactionDurations.values()),
    };
  }, EVENT_DURATION_THRESHOLD_MS);
}

function summarize(observations: Observation[]): Summary[] {
  const summaries: Summary[] = [];

  for (const framework of Object.keys(frameworks) as Framework[]) {
    for (const scenario of scenarioOrders[0]) {
      const values = observations
        .filter(
          (observation) =>
            observation.framework === framework &&
            observation.scenario === scenario
        )
        .map((observation) => observation.inpMs)
        .sort((left, right) => left - right);
      const q1Ms = quantile(values, 0.25);
      const q3Ms = quantile(values, 0.75);

      summaries.push({
        framework,
        iqrMs: q3Ms - q1Ms,
        maxMs: values.at(-1) ?? 0,
        medianMs: quantile(values, 0.5),
        minMs: values[0] ?? 0,
        q1Ms,
        q3Ms,
        runs: values.length,
        scenario,
      });
    }
  }

  return summaries;
}

function quantile(values: number[], probability: number): number {
  if (values.length === 0) {
    return 0;
  }

  const position = (values.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const fraction = position - lower;
  return values[lower] + (values[upper] - values[lower]) * fraction;
}
