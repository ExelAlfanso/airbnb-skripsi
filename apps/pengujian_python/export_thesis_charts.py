"""Render thesis charts from the paired Lighthouse notebook CSV outputs."""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "artifacts/lighthouse/paired"
IMAGES = ROOT / "apps/skripsi-exel/img"
summary = pd.read_csv(DATA / "descriptive.csv").set_index("metric")
inferential = pd.read_csv(DATA / "inferential.csv").set_index("metric")

plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False})
colors = ("#315c86", "#d56a46")


def compare_means(metrics, labels, filename, scale=1, unit=""):
    fig, axes = plt.subplots(1, len(metrics), figsize=(11, 3.4), constrained_layout=True)
    for ax, metric, label in zip(axes, metrics, labels, strict=True):
        row = summary.loc[metric]
        means = [row["vue_mean"] / scale, row["svelte_mean"] / scale]
        errors = [row["vue_sd"] / scale, row["svelte_sd"] / scale]
        ax.bar([0, 1], means, yerr=errors, capsize=4, color=colors, width=0.62)
        ax.set_xticks([0, 1], ["Vue.js", "Svelte"])
        ax.set_title(label)
        ax.set_ylabel(unit)
        ax.set_ylim(0, max(means) * 1.28 if max(means) else 1)
        for i, mean in enumerate(means):
            ax.text(i, mean + errors[i] + max(means) * 0.04, f"{mean:,.2f}", ha="center", fontsize=9)
    fig.savefig(IMAGES / filename, dpi=220, bbox_inches="tight")
    plt.close(fig)


compare_means(
    ["FCP", "LCP", "SPEED INDEX"],
    ["FCP", "LCP", "Speed Index"],
    "bar-lighthouse-mean.png",
    unit="Milidetik (mean ± SD)",
)
compare_means(
    ["JAVASCRIPT TRANSFER SIZE", "TOTAL TRANSFERRED SIZE"],
    ["Transfer JavaScript", "Total transfer"],
    "bar-lighthouse-transfer.png",
    scale=1024,
    unit="KiB (mean ± SD)",
)

fig, ax = plt.subplots(figsize=(7.2, 3.3), constrained_layout=True)
metrics = ["FCP", "LCP", "SPEED INDEX"]
rows = inferential.loc[metrics]
means = rows["mean_difference"].to_numpy()
lower = means - rows["ci_low"].to_numpy()
upper = rows["ci_high"].to_numpy() - means
ax.bar(np.arange(3), means, color=[colors[0] if value < 0 else colors[1] for value in means])
ax.errorbar(np.arange(3), means, yerr=[lower, upper], fmt="none", ecolor="#222222", capsize=5)
ax.axhline(0, color="#333333", linewidth=0.8)
ax.set_xticks(np.arange(3), ["FCP", "LCP", "Speed Index"])
ax.set_ylabel("Selisih Vue.js − Svelte (ms)")
ax.set_title("Mean selisih pasangan dan interval bootstrap 95%")
fig.savefig(IMAGES / "bar-lighthouse-paired-difference.png", dpi=220, bbox_inches="tight")
plt.close(fig)

print("Grafik tersimpan di", IMAGES)
