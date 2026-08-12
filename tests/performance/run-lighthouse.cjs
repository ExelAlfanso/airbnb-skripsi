"use strict";

const { spawn, spawnSync } = require("node:child_process");
const { existsSync, mkdtempSync, rmSync } = require("node:fs");
const { createServer } = require("node:net");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");

const [configPath] = process.argv.slice(2);

if (!configPath) {
  throw new Error("Expected a Lighthouse config path");
}

function runLhci(extraEnvironment = {}) {
  const isWindows = process.platform === "win32";
  const executable = isWindows ? process.env.ComSpec || "cmd.exe" : "pnpm";
  const args = isWindows
    ? [
        "/d",
        "/s",
        "/c",
        "pnpm",
        "exec",
        "lhci",
        "autorun",
        `--config=${configPath}`,
      ]
    : ["exec", "lhci", "autorun", `--config=${configPath}`];

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      env: { ...process.env, ...extraEnvironment },
      stdio: "inherit",
      windowsHide: true,
    });

    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.ProgramFiles
      ? join(process.env.ProgramFiles, "Google/Chrome/Application/chrome.exe")
      : undefined,
    process.env["ProgramFiles(x86)"]
      ? join(
          process.env["ProgramFiles(x86)"],
          "Google/Chrome/Application/chrome.exe"
        )
      : undefined,
    process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe")
      : undefined,
  ];

  const chromePath = candidates.find((candidate) =>
    candidate ? existsSync(candidate) : false
  );

  if (!chromePath) {
    throw new Error("Chrome was not found. Set CHROME_PATH and try again.");
  }

  return chromePath;
}

function findOpenPort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForChrome(port, processHandle) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (processHandle.exitCode !== null) {
      throw new Error("Chrome exited before its debug port became ready");
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome is still starting.
    }

    await delay(250);
  }

  throw new Error("Chrome debug port did not become ready");
}

async function main() {
  if (process.platform !== "win32") {
    process.exitCode = await runLhci();
    return;
  }

  const port = await findOpenPort();
  const profile = mkdtempSync(join(tmpdir(), "airbnb-lhci-"));
  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true }
  );

  try {
    await waitForChrome(port, chrome);
    process.exitCode = await runLhci({ LIGHTHOUSE_CHROME_PORT: String(port) });
  } finally {
    spawnSync("taskkill.exe", ["/PID", String(chrome.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    await delay(500);
    rmSync(profile, {
      force: true,
      maxRetries: 5,
      recursive: true,
      retryDelay: 500,
    });
  }
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exitCode = 1;
});
