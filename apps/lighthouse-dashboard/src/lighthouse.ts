export const FRAMEWORKS = ["vue", "svelte", "react"] as const;

export type Framework = (typeof FRAMEWORKS)[number];
export type MetricStatus = "good" | "needs-improvement" | "poor" | "neutral";

export const METRIC_DEFINITIONS = [
  {
    direction: "higher" as const,
    good: 90,
    id: "performance" as const,
    label: "Performance",
    shortLabel: "Score",
    unit: "score" as const,
    warning: 50,
  },
  {
    direction: "lower" as const,
    good: 1800,
    id: "fcp" as const,
    label: "First Contentful Paint",
    shortLabel: "FCP",
    unit: "ms" as const,
    warning: 3000,
  },
  {
    direction: "lower" as const,
    good: 2500,
    id: "lcp" as const,
    label: "Largest Contentful Paint",
    shortLabel: "LCP",
    unit: "ms" as const,
    warning: 4000,
  },
  {
    direction: "lower" as const,
    good: 3400,
    id: "speedIndex" as const,
    label: "Speed Index",
    shortLabel: "SI",
    unit: "ms" as const,
    warning: 5800,
  },
  {
    direction: "lower" as const,
    good: 200,
    id: "tbt" as const,
    label: "Total Blocking Time",
    shortLabel: "TBT",
    unit: "ms" as const,
    warning: 600,
  },
  {
    direction: "lower" as const,
    good: 0.1,
    id: "cls" as const,
    label: "Cumulative Layout Shift",
    shortLabel: "CLS",
    unit: "unitless" as const,
    warning: 0.25,
  },
  {
    direction: "lower" as const,
    good: null,
    id: "transferSize" as const,
    label: "Total transfer",
    shortLabel: "Transfer",
    unit: "bytes" as const,
    warning: null,
  },
  {
    direction: "lower" as const,
    good: 150_000,
    id: "scriptSize" as const,
    label: "JavaScript transfer",
    shortLabel: "JS",
    unit: "bytes" as const,
    warning: Number.POSITIVE_INFINITY,
  },
  {
    direction: "lower" as const,
    good: null,
    id: "requestCount" as const,
    label: "Request count",
    shortLabel: "Requests",
    unit: "count" as const,
    warning: null,
  },
] as const;

export type MetricId = (typeof METRIC_DEFINITIONS)[number]["id"];
export type MetricDefinition = (typeof METRIC_DEFINITIONS)[number];

export interface ActionableAudit {
  categories: string[];
  description: string;
  displayValue: string;
  id: string;
  score: number;
  title: string;
}

export interface LighthouseRun {
  audits: ActionableAudit[];
  fetchTime: string;
  fileName: string;
  formFactor: string;
  framework: Framework;
  id: string;
  lighthouseVersion: string;
  metrics: Record<MetricId, number | null>;
  path: string;
  scores: {
    accessibility: number | null;
    bestPractices: number | null;
    performance: number | null;
    seo: number | null;
  };
  url: string;
  warnings: string[];
}

export interface LoadResult {
  errors: string[];
  reports: LighthouseRun[];
}

const AUDIT_METRICS = {
  cls: "cumulative-layout-shift",
  fcp: "first-contentful-paint",
  lcp: "largest-contentful-paint",
  speedIndex: "speed-index",
  tbt: "total-blocking-time",
} as const;
const PATH_SEPARATOR_PATTERN = /[\\/]+/;
const LOCAL_PORT_PATTERN = /:(3000|3002|5173)(?:\/|$)/;
const FRAMEWORK_BY_LOCAL_PORT: Record<string, Framework> = {
  "3000": "vue",
  "3002": "react",
  "5173": "svelte",
};

const byteFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2,
});

export async function loadLighthouseFiles(
  files: readonly File[]
): Promise<LoadResult> {
  const candidates = files.filter(
    (file) =>
      file.name.toLowerCase().endsWith(".report.json") ||
      file.name.toLowerCase() === "lhr.json"
  );
  const parsed = await Promise.all(
    candidates.map(async (file) => {
      try {
        return {
          error: null,
          report: parseLighthouseReport(
            await file.text(),
            file.name,
            file.webkitRelativePath || file.name
          ),
        };
      } catch (error) {
        return {
          error: `${file.name}: ${error instanceof Error ? error.message : "gagal dibaca"}`,
          report: null,
        };
      }
    })
  );

  return {
    errors: parsed.flatMap(({ error }) => (error ? [error] : [])),
    reports: parsed
      .flatMap(({ report }) => (report ? [report] : []))
      .sort((left, right) => right.fetchTime.localeCompare(left.fetchTime)),
  };
}

export function parseLighthouseReport(
  text: string,
  fileName: string,
  path = fileName
): LighthouseRun {
  const root: unknown = JSON.parse(text);
  if (!(isRecord(root) && isRecord(root.audits) && isRecord(root.categories))) {
    throw new Error("bukan report Lighthouse lengkap");
  }

  const lighthouseVersion = readString(root.lighthouseVersion);
  const fetchTime = readString(root.fetchTime);
  const url =
    readString(root.finalDisplayedUrl) ||
    readString(root.finalUrl) ||
    readString(root.requestedUrl);

  if (!(lighthouseVersion && fetchTime && url)) {
    throw new Error("metadata report tidak lengkap");
  }

  const framework = inferFramework(path, url);
  const performanceScore = readCategoryScore(root.categories, "performance");
  const resourceItems = readResourceItems(root.audits);
  const metrics: Record<MetricId, number | null> = {
    cls: readAuditNumber(root.audits, AUDIT_METRICS.cls),
    fcp: readAuditNumber(root.audits, AUDIT_METRICS.fcp),
    lcp: readAuditNumber(root.audits, AUDIT_METRICS.lcp),
    performance:
      performanceScore === null ? null : Math.round(performanceScore * 100),
    requestCount: readResourceNumber(resourceItems, "total", "requestCount"),
    scriptSize: readResourceNumber(resourceItems, "script", "transferSize"),
    speedIndex: readAuditNumber(root.audits, AUDIT_METRICS.speedIndex),
    tbt: readAuditNumber(root.audits, AUDIT_METRICS.tbt),
    transferSize: readResourceNumber(resourceItems, "total", "transferSize"),
  };

  return {
    audits: readActionableAudits(root.audits, root.categories),
    fetchTime,
    fileName,
    formFactor:
      readNestedString(root, "configSettings", "formFactor") || "unknown",
    framework,
    id: `${framework}:${fetchTime}:${fileName}`,
    lighthouseVersion,
    metrics,
    path,
    scores: {
      accessibility: scoreAsPercent(
        readCategoryScore(root.categories, "accessibility")
      ),
      bestPractices: scoreAsPercent(
        readCategoryScore(root.categories, "best-practices")
      ),
      performance: metrics.performance,
      seo: scoreAsPercent(readCategoryScore(root.categories, "seo")),
    },
    url,
    warnings: Array.isArray(root.runWarnings)
      ? root.runWarnings.flatMap((warning) => {
          const value = readString(warning);
          return value ? [value] : [];
        })
      : [],
  };
}

export function inferFramework(path: string, url: string): Framework {
  const segments = path.toLowerCase().split(PATH_SEPARATOR_PATTERN);
  const fromPath = FRAMEWORKS.find((framework) => segments.includes(framework));
  if (fromPath) {
    return fromPath;
  }

  const port = LOCAL_PORT_PATTERN.exec(url)?.[1];
  if (port) {
    return FRAMEWORK_BY_LOCAL_PORT[port];
  }

  throw new Error("framework tidak bisa dikenali dari folder atau URL");
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function metricStatus(
  value: number | null,
  definition: MetricDefinition
): MetricStatus {
  if (value === null || definition.good === null) {
    return "neutral";
  }

  if (definition.direction === "higher") {
    if (value >= definition.good) {
      return "good";
    }
    return definition.warning !== null && value >= definition.warning
      ? "needs-improvement"
      : "poor";
  }

  if (value <= definition.good) {
    return "good";
  }
  return definition.warning !== null && value <= definition.warning
    ? "needs-improvement"
    : "poor";
}

export function formatMetric(
  value: number | null,
  definition: MetricDefinition
): string {
  if (value === null) {
    return "—";
  }

  if (definition.unit === "score") {
    return `${Math.round(value)}`;
  }
  if (definition.unit === "ms") {
    return value >= 1000
      ? `${numberFormatter.format(value / 1000)} dtk`
      : `${Math.round(value)} md`;
  }
  if (definition.unit === "bytes") {
    return value >= 1_048_576
      ? `${byteFormatter.format(value / 1_048_576)} MiB`
      : `${byteFormatter.format(value / 1024)} KiB`;
  }
  if (definition.unit === "count") {
    return `${Math.round(value)}`;
  }
  return numberFormatter.format(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readNestedString(
  root: Record<string, unknown>,
  parentKey: string,
  key: string
): string {
  const parent = root[parentKey];
  return isRecord(parent) ? readString(parent[key]) : "";
}

function readCategoryScore(
  categories: Record<string, unknown>,
  id: string
): number | null {
  const category = categories[id];
  return isRecord(category) ? readNumber(category.score) : null;
}

function scoreAsPercent(score: number | null): number | null {
  return score === null ? null : Math.round(score * 100);
}

function readAuditNumber(
  audits: Record<string, unknown>,
  id: string
): number | null {
  const audit = audits[id];
  return isRecord(audit) ? readNumber(audit.numericValue) : null;
}

function readResourceItems(audits: Record<string, unknown>): unknown[] {
  const summary = audits["resource-summary"];
  if (!(isRecord(summary) && isRecord(summary.details))) {
    return [];
  }
  return Array.isArray(summary.details.items) ? summary.details.items : [];
}

function readResourceNumber(
  items: readonly unknown[],
  resourceType: string,
  key: "requestCount" | "transferSize"
): number | null {
  const item = items.find(
    (candidate) =>
      isRecord(candidate) && candidate.resourceType === resourceType
  );
  return isRecord(item) ? readNumber(item[key]) : null;
}

function readActionableAudits(
  audits: Record<string, unknown>,
  categories: Record<string, unknown>
): ActionableAudit[] {
  const actionable = new Map<string, ActionableAudit>();

  for (const [categoryId, categoryValue] of Object.entries(categories)) {
    if (!(isRecord(categoryValue) && Array.isArray(categoryValue.auditRefs))) {
      continue;
    }

    for (const reference of categoryValue.auditRefs) {
      if (!isRecord(reference)) {
        continue;
      }
      const id = readString(reference.id);
      const audit = audits[id];
      if (!(id && isRecord(audit))) {
        continue;
      }

      const score = readNumber(audit.score);
      const title = readString(audit.title);
      if (score === null || score >= 1 || !title) {
        continue;
      }

      const existing = actionable.get(id);
      if (existing) {
        existing.categories.push(categoryId);
        continue;
      }

      actionable.set(id, {
        categories: [categoryId],
        description: readString(audit.description),
        displayValue: readString(audit.displayValue),
        id,
        score,
        title,
      });
    }
  }

  return [...actionable.values()].sort(
    (left, right) =>
      left.score - right.score || left.title.localeCompare(right.title)
  );
}
