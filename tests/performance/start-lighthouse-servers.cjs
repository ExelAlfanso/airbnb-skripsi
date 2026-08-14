"use strict";

const { spawn } = require("node:child_process");
const { setTimeout: delay } = require("node:timers/promises");

const API_PACKAGE = "@airbnb-skripsi/api";
const API_URL = "http://localhost:3001/health";
const READY_RETRY_COUNT = 60;
const READY_RETRY_DELAY_MS = 500;
const [frontendPackage, frontendUrl] = process.argv.slice(2);

if (!(frontendPackage && frontendUrl)) {
  throw new Error("Expected a frontend package and URL");
}

const isWindows = process.platform === "win32";
const executable = isWindows ? process.env.ComSpec || "cmd.exe" : "pnpm";
const spawnOptions = {
  cwd: process.cwd(),
  stdio: "inherit",
  windowsHide: true,
};
const servers = [API_PACKAGE, frontendPackage].map((packageName) => {
  const args = isWindows
    ? ["/d", "/s", "/c", "pnpm", "--filter", packageName, "start"]
    : ["--filter", packageName, "start"];

  return spawn(executable, args, spawnOptions);
});

function stopServers() {
  for (const server of servers) {
    server.kill();
  }
}

async function waitUntilReady(url) {
  for (let attempt = 0; attempt < READY_RETRY_COUNT; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The server is still starting.
    }

    await delay(READY_RETRY_DELAY_MS);
  }

  throw new Error(`Server did not become ready: ${url}`);
}

const exitedEarly = Promise.race(
  servers.map(
    (server) =>
      new Promise((_, reject) => {
        server.once("error", reject);
        server.once("exit", (code) =>
          reject(new Error(`Server exited before readiness with code ${code}`))
        );
      })
  )
);

Promise.race([
  Promise.all([waitUntilReady(API_URL), waitUntilReady(frontendUrl)]),
  exitedEarly,
]).then(
  () => process.stdout.write("LHCI_READY\n"),
  (error) => {
    process.stderr.write(`${error.message}\n`);
    stopServers();
    process.exitCode = 1;
  }
);
