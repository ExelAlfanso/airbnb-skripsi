import json
from pathlib import Path

path = Path(__file__).with_name("analisis_pengujian.ipynb")
notebook = json.loads(path.read_text(encoding="utf-8"))


def set_source(index, source):
    cell = notebook["cells"][index]
    cell["source"] = source.splitlines(keepends=True)
    cell["outputs"] = []
    cell["execution_count"] = None


notebook["cells"][0]["source"] = [
    "# Analisis Lighthouse berpasangan: VueJS vs Svelte\n",
    "\n",
    "Setiap blok pengujian memuat satu report VueJS dan satu report Svelte dengan `pair_id` yang sama. Analisis inferensial memakai selisih dalam pasangan.\n",
]

source = "".join(notebook["cells"][1]["source"])
source = source.replace('Path("artifacts/lighthouse")', 'Path("artifacts/lighthouse/paired")')
source = source.replace('Path("../../artifacts/lighthouse")', 'Path("../../artifacts/lighthouse/paired")')
set_source(1, source)

set_source(3, '''manifest_path = LIGHTHOUSE_ROOT / "manifest.json"
pairs = json.loads(manifest_path.read_text(encoding="utf-8"))
if len(pairs) != 20:
    raise ValueError(f"Diperlukan 20 pasangan lengkap; ditemukan {len(pairs)}")
if [pair["pair_id"] for pair in pairs] != list(range(1, len(pairs) + 1)):
    raise ValueError("ID pasangan tidak berurutan atau duplikat")

paired_reports = []
for pair in pairs:
    reports = {}
    for entry in pair["reports"]:
        report_path = Path(entry["report"])
        if not report_path.exists():
            report_path = LIGHTHOUSE_ROOT / report_path.name
        reports[entry["framework"]] = {
            "path": report_path,
            "report": json.loads(report_path.read_text(encoding="utf-8")),
        }
    if set(reports) != {"vue", "svelte"}:
        raise ValueError(f"Pasangan {pair['pair_id']} tidak lengkap")
    paired_reports.append((pair["pair_id"], reports))

print(f"Pasangan lengkap: {len(paired_reports)}")
print("Desain inferensial: selisih run dalam pasangan")
''')

source = "".join(notebook["cells"][5]["source"])
start = source.index("rows = []")
end = source.index("data = pd.DataFrame(rows)")
source = source[:start] + '''rows = []
for pair_id, reports in paired_reports:
    for framework, item in reports.items():
        report = item["report"]
        for metric, value in extract_run_metrics(report).items():
            rows.append({"pair_id": pair_id, "framework": framework, "scenario": scenario_from_report(report), "metric": metric, "value": value, "report": item["path"].name})

''' + source[end:]
source = source.replace("summary = pd.DataFrame(summary_rows)", "summary = pd.DataFrame(summary_rows)\nsummary.to_csv(LIGHTHOUSE_ROOT / 'descriptive.csv', index=False)")
set_source(5, source)

notebook["cells"][6]["source"] = [
    "## Inferensi berdasarkan selisih pasangan\n",
    "\n",
    "Normalitas dinilai pada `d_i = Vue_i - Svelte_i`. Jika selisih mendekati normal digunakan uji t berpasangan; jika tidak digunakan uji permutasi dengan membalik tanda selisih di dalam pasangan. Bootstrap mengambil ulang pasangan utuh.\n",
]

set_source(8, '''LIGHTHOUSE_METRICS = ["FCP", "LCP", "SPEED INDEX", "TBT", "CLS"]
ALPHA = 0.05
RNG = np.random.default_rng(20260925)

def holm_adjust(p_values):
    order, adjusted, running_max = np.argsort(p_values), np.empty_like(p_values), 0.0
    for rank, index in enumerate(order):
        running_max = max(running_max, (len(p_values) - rank) * p_values[index])
        adjusted[index] = min(running_max, 1.0)
    return adjusted

def paired_ci(differences, resamples=20_000):
    means = RNG.choice(differences, size=(resamples, len(differences)), replace=True).mean(axis=1)
    return tuple(np.quantile(means, [0.025, 0.975]))

def paired_permutation_pvalue(differences, resamples=100_000):
    if not np.ptp(differences):
        return 1.0 if differences[0] == 0 else 2 / (2 ** len(differences))
    observed = abs(differences.mean())
    signs = RNG.choice([-1, 1], size=(resamples, len(differences)))
    simulated = abs((signs * differences).mean(axis=1))
    return (np.count_nonzero(simulated >= observed - 1e-12) + 1) / (resamples + 1)

def analyze_metric(group):
    pair = group.pivot(index="pair_id", columns="framework", values="value")
    if pair.isna().any().any() or len(pair) != len(paired_reports):
        raise ValueError("Metrik tidak memiliki pasangan lengkap")
    differences = (pair["vue"] - pair["svelte"]).to_numpy(float)
    shapiro_p = stats.shapiro(differences).pvalue if np.ptp(differences) else np.nan
    ci_low, ci_high = paired_ci(differences)
    use_t = np.isfinite(shapiro_p) and shapiro_p > ALPHA
    result = stats.ttest_1samp(differences, 0) if use_t else None
    sd_difference = differences.std(ddof=1)
    return {"n_pairs": len(differences), "mean_difference": differences.mean(), "sd_difference": sd_difference,
            "ci_low": ci_low, "ci_high": ci_high, "shapiro_difference_p": shapiro_p,
            "test": "Uji t berpasangan" if use_t else "Permutasi berpasangan",
            "statistic": result.statistic if use_t else differences.mean(),
            "p_raw": result.pvalue if use_t else paired_permutation_pvalue(differences),
            "effect": differences.mean() / sd_difference if sd_difference else np.nan, "effect_name": "Cohen dz"}

analysis_data = data[data["metric"].isin(LIGHTHOUSE_METRICS)]
results = [{"scenario": scenario, "metric": metric} | analyze_metric(group) for (scenario, metric), group in analysis_data.groupby(["scenario", "metric"], sort=True)]
inferential = pd.DataFrame(results)
inferential["p_holm"] = holm_adjust(inferential["p_raw"].to_numpy(float))
inferential["decision"] = np.where(inferential["p_holm"] < ALPHA, "Tolak H0", "Gagal menolak H0")
inferential.to_csv(LIGHTHOUSE_ROOT / "inferential.csv", index=False)
display(inferential.round(4))

QQ_PLOT_METRICS = ["FCP", "LCP", "SPEED INDEX"]
REPORT_FIGURE_PATH = LIGHTHOUSE_ROOT.parents[2] / "apps/skripsi-exel/img/qq-plot-lighthouse-core.png"
fig, axes = plt.subplots(1, len(QQ_PLOT_METRICS), figsize=(12, 3.5))
for column, metric in enumerate(QQ_PLOT_METRICS):
    metric_data = analysis_data[analysis_data["metric"] == metric]
    pair = metric_data.pivot(index="pair_id", columns="framework", values="value")
    stats.probplot(pair["vue"] - pair["svelte"], dist="norm", plot=axes[column])
    axes[column].set_title(f"Q-Q selisih pasangan: {metric}")
fig.tight_layout()
fig.savefig(REPORT_FIGURE_PATH, dpi=300, bbox_inches="tight")
print(f"Q-Q plot selisih pasangan: {REPORT_FIGURE_PATH}")
''')

path.write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
