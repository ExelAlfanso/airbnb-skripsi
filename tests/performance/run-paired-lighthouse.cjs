"use strict";

const { spawn, spawnSync } = require("node:child_process");
const { mkdirSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const LighthouseRunner = require("../../node_modules/@lhci/cli/src/collect/node-runner.js");
const { checkJourneys } = require("./paired-journeys.cjs");

const root = resolve(__dirname, "../..");
const pairs = Number(process.argv[2] || 20);
if (!Number.isInteger(pairs) || pairs < 1) {
  throw new Error("Jumlah pasangan harus bilangan bulat positif.");
}

const output = join(
  root,
  "artifacts",
  "lighthouse",
  pairs === 20 ? "paired" : `paired-pilot-${pairs}`
);
const urls = {
  vue: "http://localhost:3000/",
  svelte: "http://localhost:5173/",
};
const server = spawn(
  process.execPath,
  [
    join(__dirname, "start-lighthouse-servers.cjs"),
    "@airbnb-skripsi/vue-app",
    urls.vue,
    "@airbnb-skripsi/svelte-app",
    urls.svelte,
  ],
  {
    cwd: root,
    stdio: ["ignore", "pipe", "inherit"],
    windowsHide: true,
  }
);

function ready() {
  return new Promise((accept, reject) => {
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes("LHCI_READY")) {
        accept();
      }
    });
    server.once("error", reject);
    server.once("exit", (code) =>
      reject(new Error(`Server berhenti sebelum siap: ${code}`))
    );
  });
}

async function collectReport(runner, url) {
  let report;
  try {
    report = await runner.runUntilSuccess(url, {
      settings: { preset: "desktop" },
    });
  } catch (error) {
    const candidate = error.stdout?.trim();
    if (!candidate) {
      throw error;
    }
    report = candidate;
  }

  const result = JSON.parse(report);
  const audits = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "speed-index",
    "total-blocking-time",
    "cumulative-layout-shift",
  ];
  if (
    result.runtimeError ||
    result.finalUrl !== url ||
    !Number.isFinite(result.categories?.performance?.score) ||
    audits.some(
      (audit) => !Number.isFinite(result.audits?.[audit]?.numericValue)
    )
  ) {
    throw new Error(
      `Report Lighthouse tidak valid untuk ${url}: ${result.runtimeError?.code ?? result.finalUrl ?? "metrik tidak lengkap"}`
    );
  }
  return report;
}

async function main() {
  await ready();
  mkdirSync(output, { recursive: true });
  await checkJourneys(urls, output);
  const runner = new LighthouseRunner();
  const manifest = [];
  for (let pairId = 1; pairId <= pairs; pairId += 1) {
    const order = pairId % 2 ? ["vue", "svelte"] : ["svelte", "vue"];
    const entries = [];
    for (const framework of order) {
      process.stdout.write(`Pasangan ${pairId}/${pairs}: ${framework}\n`);
      const report = await collectReport(runner, urls[framework]);
      const reportPath = join(
        output,
        `pair-${String(pairId).padStart(2, "0")}-${framework}.json`
      );
      writeFileSync(reportPath, report);
      entries.push({ framework, report: reportPath });
    }
    manifest.push({ pair_id: pairId, order, reports: entries });
    writeFileSync(
      join(output, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );
  }
}

main()
  .catch((error) => {
    process.stderr.write(
      `${error.stack || error}\n${(error.stderr || "").slice(-3000)}\n`
    );
    process.exitCode = 1;
  })
  .finally(() => {
    if (process.platform === "win32") {
      spawnSync("taskkill.exe", ["/PID", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
    } else {
      server.kill();
    }
  });
