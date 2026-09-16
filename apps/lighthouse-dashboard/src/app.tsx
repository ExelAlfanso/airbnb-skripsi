import { useState } from "react";
import {
  FRAMEWORKS,
  type Framework,
  formatMetric,
  type LighthouseRun,
  loadLighthouseFiles,
  METRIC_DEFINITIONS,
  type MetricDefinition,
  median,
  metricStatus,
} from "./lighthouse";

type FrameworkFilter = "all" | Framework;

const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  svelte: "Svelte",
  vue: "Vue",
};

const SCORE_LABELS = [
  ["performance", "Performance"],
  ["accessibility", "Accessibility"],
  ["bestPractices", "Best practices"],
  ["seo", "SEO"],
] as const;

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function App() {
  const [reports, setReports] = useState<LighthouseRun[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<FrameworkFilter>("all");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedReport =
    reports.find((report) => report.id === selectedId) ?? reports[0] ?? null;
  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((report) => report.framework === filter);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    setIsLoading(true);
    const result = await loadLighthouseFiles(Array.from(fileList));
    setReports(result.reports);
    setSelectedId(result.reports[0]?.id ?? "");
    setErrors(result.errors);
    setFilter("all");
    setIsLoading(false);
  }

  return (
    <main className="app-shell">
      <header className="masthead">
        <div aria-hidden="true" className="masthead__rail">
          <span>00</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="masthead__copy">
          <p className="eyebrow">Local performance instrument</p>
          <h1>
            Lighthouse
            <span>Workbench</span>
          </h1>
          <p className="masthead__lede">
            Baca run, cek variasi, lalu bedah audit. Semua file tetap di browser
            lokal ini.
          </p>
        </div>
        <div className="masthead__action">
          <DirectoryPicker compact={reports.length > 0} onFiles={handleFiles} />
          <p aria-live="polite" className="load-status">
            {isLoading ? "Membaca report…" : `${reports.length} run dimuat`}
          </p>
        </div>
      </header>

      {errors.length > 0 ? (
        <aside className="notice notice--error" role="alert">
          <strong>{errors.length} file dilewati.</strong>
          <span>{errors[0]}</span>
        </aside>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState isLoading={isLoading} onFiles={handleFiles} />
      ) : (
        <div className="dashboard">
          <ComparisonTable reports={reports} />
          <section aria-labelledby="inspection-title" className="inspection">
            <RunBrowser
              filter={filter}
              reports={filteredReports}
              selectedId={selectedReport?.id ?? ""}
              setFilter={setFilter}
              setSelectedId={setSelectedId}
            />
            {selectedReport ? <ReportDetail report={selectedReport} /> : null}
          </section>
        </div>
      )}
    </main>
  );
}

interface DirectoryPickerProps {
  compact?: boolean;
  onFiles: (files: FileList | null) => void;
}

function DirectoryPicker({ compact = false, onFiles }: DirectoryPickerProps) {
  const directoryAttribute = { webkitdirectory: "" };

  return (
    <label
      className={
        compact ? "folder-button folder-button--compact" : "folder-button"
      }
    >
      <input
        {...directoryAttribute}
        accept=".json,application/json"
        multiple
        onChange={(event) => {
          const files = event.currentTarget.files;
          onFiles(files);
          event.currentTarget.value = "";
        }}
        type="file"
      />
      <span aria-hidden="true" className="folder-button__mark" />
      <span>{compact ? "Ganti folder" : "Pilih folder artifact"}</span>
    </label>
  );
}

function EmptyState({
  isLoading,
  onFiles,
}: DirectoryPickerProps & { isLoading: boolean }) {
  return (
    <section className="empty-state">
      <div aria-hidden="true" className="empty-state__diagram">
        <span className="empty-state__pulse" />
        <span>JSON</span>
      </div>
      <div>
        <p className="eyebrow">Mulai dari data mentah</p>
        <h2>Pilih folder `artifacts/lighthouse`.</h2>
        <p>
          Workbench akan menemukan semua `*.report.json`, mengabaikan manifest,
          dan mengelompokkan run dari folder Vue, Svelte, serta React.
        </p>
        <DirectoryPicker onFiles={onFiles} />
        <small aria-live="polite">
          {isLoading
            ? "Report sedang diproses…"
            : "Tidak ada file yang dikirim keluar dari perangkat."}
        </small>
      </div>
    </section>
  );
}

function ComparisonTable({ reports }: { reports: readonly LighthouseRun[] }) {
  return (
    <section aria-labelledby="comparison-title" className="comparison">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Median & rentang run</p>
          <h2 id="comparison-title">Treatment snapshot</h2>
        </div>
        <p>
          Vue dan Svelte adalah treatment utama. React ditahan sebagai
          reference, bukan bagian kesimpulan komparatif.
        </p>
      </div>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Metrik</th>
              {FRAMEWORKS.map((framework) => (
                <th
                  className={`framework-heading framework-heading--${framework}`}
                  key={framework}
                  scope="col"
                >
                  <FrameworkMark framework={framework} />
                  {framework === "react" ? (
                    <small>reference</small>
                  ) : (
                    <small>treatment</small>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRIC_DEFINITIONS.map((definition) => (
              <ComparisonRow
                definition={definition}
                key={definition.id}
                reports={reports}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonRow({
  definition,
  reports,
}: {
  definition: MetricDefinition;
  reports: readonly LighthouseRun[];
}) {
  return (
    <tr>
      <th scope="row">
        <strong className="comparison-metric-name">
          {definition.shortLabel}
        </strong>
        <span className="comparison-metric-label">{definition.label}</span>
      </th>
      {FRAMEWORKS.map((framework) => {
        const values = reports.flatMap((report) => {
          const value = report.metrics[definition.id];
          return report.framework === framework && value !== null
            ? [value]
            : [];
        });
        const middle = median(values);
        const minimum = values.length > 0 ? Math.min(...values) : null;
        const maximum = values.length > 0 ? Math.max(...values) : null;
        const status = metricStatus(middle, definition);

        return (
          <td data-status={status} key={framework}>
            <strong className="comparison-value">
              {formatMetric(middle, definition)}
            </strong>
            <span className="comparison-range">
              {values.length === 0
                ? "belum ada run"
                : `${formatMetric(minimum, definition)} — ${formatMetric(maximum, definition)} · n=${values.length}`}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

interface RunBrowserProps {
  filter: FrameworkFilter;
  reports: readonly LighthouseRun[];
  selectedId: string;
  setFilter: (filter: FrameworkFilter) => void;
  setSelectedId: (id: string) => void;
}

function RunBrowser({
  filter,
  reports,
  selectedId,
  setFilter,
  setSelectedId,
}: RunBrowserProps) {
  const filters: FrameworkFilter[] = ["all", ...FRAMEWORKS];

  return (
    <aside aria-label="Daftar run Lighthouse" className="run-browser">
      <div className="run-browser__header">
        <div>
          <p className="eyebrow">Artifact index</p>
          <h2 id="inspection-title">Pilih run</h2>
        </div>
        <span>{reports.length}</span>
      </div>
      <fieldset className="filter-tabs">
        <legend className="sr-only">Filter framework</legend>
        {filters.map((option) => (
          <button
            aria-pressed={filter === option}
            key={option}
            onClick={() => setFilter(option)}
            type="button"
          >
            {option === "all" ? "Semua" : FRAMEWORK_LABELS[option]}
          </button>
        ))}
      </fieldset>
      <div className="run-list">
        {reports.map((report) => (
          <button
            aria-pressed={report.id === selectedId}
            className="run-item"
            key={report.id}
            onClick={() => setSelectedId(report.id)}
            type="button"
          >
            <span
              className={`run-item__framework run-item__framework--${report.framework}`}
            >
              {FRAMEWORK_LABELS[report.framework]}
            </span>
            <strong className="run-item__date">
              {formatDate(report.fetchTime)}
            </strong>
            <span>{report.fileName}</span>
            <span className="run-item__metrics">
              <b>
                {formatMetric(
                  report.metrics.performance,
                  METRIC_DEFINITIONS[0]
                )}
              </b>
              <small>score</small>
              <b>{formatMetric(report.metrics.lcp, METRIC_DEFINITIONS[2])}</b>
              <small>LCP</small>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ReportDetail({ report }: { report: LighthouseRun }) {
  return (
    <article className="report-detail">
      <header className="report-detail__header">
        <div>
          <div className="report-detail__labels">
            <FrameworkMark framework={report.framework} />
            {report.framework === "react" ? (
              <span className="reference-tag">Reference only</span>
            ) : null}
          </div>
          <h2>{formatDate(report.fetchTime)}</h2>
          <a href={report.url} rel="noreferrer" target="_blank">
            {report.url}
          </a>
        </div>
        <div
          className="score-plate"
          data-status={metricStatus(
            report.metrics.performance,
            METRIC_DEFINITIONS[0]
          )}
        >
          <span>Performance</span>
          <strong className="score-plate__value">
            {formatMetric(report.metrics.performance, METRIC_DEFINITIONS[0])}
          </strong>
          <small>/ 100</small>
        </div>
      </header>

      <section aria-label="Skor kategori Lighthouse" className="score-strip">
        {SCORE_LABELS.map(([key, label]) => (
          <div key={key}>
            <span>{label}</span>
            <strong className="score-strip__value">
              {report.scores[key] ?? "—"}
            </strong>
          </div>
        ))}
      </section>

      <section aria-labelledby="metrics-title">
        <div className="subsection-heading">
          <h3 id="metrics-title">Metrik run</h3>
          <span>Ambang mengikuti metodologi skripsi dan budget LHCI repo.</span>
        </div>
        <div className="metric-grid">
          {METRIC_DEFINITIONS.slice(1).map((definition) => (
            <MetricCard
              definition={definition}
              key={definition.id}
              value={report.metrics[definition.id]}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="audits-title" className="audit-section">
        <div className="subsection-heading">
          <h3 id="audits-title">Audit yang perlu dilihat</h3>
          <span>{report.audits.length} audit di bawah skor penuh</span>
        </div>
        <div className="audit-list">
          {report.audits.length === 0 ? (
            <p className="notice">Tidak ada audit berskor di bawah 1.</p>
          ) : (
            report.audits.slice(0, 12).map((audit) => (
              <details key={audit.id}>
                <summary>
                  <span className="audit-score">
                    {Math.round(audit.score * 100)}
                  </span>
                  <span>
                    <strong className="audit-title">{audit.title}</strong>
                    <small className="audit-meta">
                      {audit.displayValue || audit.categories.join(" · ")}
                    </small>
                  </span>
                  <span aria-hidden="true" className="audit-open-mark">
                    +
                  </span>
                </summary>
                <p>{audit.description}</p>
                <code>{audit.id}</code>
              </details>
            ))
          )}
        </div>
      </section>

      {report.warnings.length > 0 ? (
        <section aria-labelledby="warnings-title" className="warning-section">
          <h3 id="warnings-title">Run warnings</h3>
          <ul>
            {report.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="report-meta">
        <span>Lighthouse {report.lighthouseVersion}</span>
        <span>{report.formFactor}</span>
        <span title={report.path}>{report.fileName}</span>
      </footer>
    </article>
  );
}

function MetricCard({
  definition,
  value,
}: {
  definition: MetricDefinition;
  value: number | null;
}) {
  const status = metricStatus(value, definition);

  return (
    <div className="metric-card" data-status={status}>
      <span>{definition.shortLabel}</span>
      <strong className="metric-card__value">
        {formatMetric(value, definition)}
      </strong>
      <small>{definition.label}</small>
      <div aria-hidden="true" className="metric-card__calibration">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function FrameworkMark({ framework }: { framework: Framework }) {
  return (
    <span className={`framework-mark framework-mark--${framework}`}>
      <i aria-hidden="true" />
      {FRAMEWORK_LABELS[framework]}
    </span>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}
