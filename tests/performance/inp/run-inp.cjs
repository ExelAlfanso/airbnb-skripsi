"use strict";

const { spawn, spawnSync } = require("node:child_process");

const API_URL = "http://127.0.0.1:3101";
const CONFIG_PATH = "tests/performance/inp/playwright.config.ts";
const [mode] = process.argv.slice(2);
const isWindows = process.platform === "win32";
const executable = isWindows ? process.env.ComSpec || "cmd.exe" : "pnpm";

function commandArgs(args) {
  return isWindows ? ["/d", "/s", "/c", "pnpm", ...args] : args;
}

function run(args, extraEnvironment = {}) {
  const result = spawnSync(executable, commandArgs(args), {
    env: { ...process.env, ...extraEnvironment },
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (mode === "serve-api") {
  const child = spawn(
    executable,
    commandArgs(["--filter", "@airbnb-skripsi/api", "start"]),
    {
      env: { ...process.env, PORT: "3101" },
      stdio: "inherit",
      windowsHide: true,
    }
  );

  child.once("error", (error) => {
    throw error;
  });
  child.once("exit", (code) => {
    process.exit(code ?? 1);
  });
} else {
  const buildEnvironment = { VITE_API_URL: API_URL };
  run(["--filter", "@airbnb-skripsi/vue-app", "build"], buildEnvironment);
  run(["--filter", "@airbnb-skripsi/svelte-app", "build"], buildEnvironment);
  run(["exec", "playwright", "test", "--config", CONFIG_PATH]);
}
