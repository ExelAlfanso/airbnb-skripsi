"use strict";

const assert = require("node:assert/strict");
const { writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { chromium } = require("@playwright/test");

const KALIURANG = "Kabin Kayu Tenang di Kaliurang";
const CANGGU_VILLA = "Villa Tropis dengan Kolam Renang";
const CHEAPEST = "Guesthouse Nyaman untuk Remote Work";
const SENGGIGI = "Villa Pantai Senggigi untuk Grup";
const FOUR_GUESTS = /4\s+tamu/;
const BACK_TO_RESULTS = /Kembali ke hasil/;

const journeys = {
  "TA-01": async (page) => {
    await page.getByLabel("Cari", { exact: true }).fill("Kaliurang");
    await page.getByText("Filter lanjutan", { exact: true }).click();
    await page.getByLabel("Tamu minimum").fill("4");
    await page.getByRole("button", { name: "Cari properti" }).click();
    await page.getByRole("button", { name: KALIURANG, exact: true }).waitFor();
    await page
      .locator(".property-card")
      .filter({ hasText: KALIURANG })
      .getByText(FOUR_GUESTS)
      .waitFor();
  },
  "TA-02": async (page) => {
    await page.getByLabel("Lokasi").selectOption("loc_bali_canggu");
    await page.getByLabel("Tipe").selectOption("villa");
    await page.getByText("Filter lanjutan", { exact: true }).click();
    await page.getByLabel("Harga maksimum").fill("1500000");
    await page.getByLabel("Tamu minimum").fill("6");
    await page.getByLabel("Private Pool").check();
    await page.getByLabel("Wi-Fi").check();
    await page.getByRole("button", { name: "Cari properti" }).click();
    await page
      .getByRole("button", { name: CANGGU_VILLA, exact: true })
      .waitFor();
  },
  "TA-03": async (page) => {
    await page.getByLabel("Urutkan").selectOption("price_asc");
    await page.getByRole("button", { name: "Cari properti" }).click();
    await page
      .locator(".property-card__title")
      .first()
      .filter({ hasText: CHEAPEST })
      .waitFor();
    assert.equal(
      (
        await page.locator(".property-card__title").first().textContent()
      ).trim(),
      CHEAPEST
    );
  },
  "TA-04": async (page) => {
    await page.getByLabel("Cari", { exact: true }).fill("Senggigi");
    await page.getByText("Filter lanjutan", { exact: true }).click();
    await page.getByLabel("Tamu minimum").fill("10");
    await page.getByRole("button", { name: "Cari properti" }).click();
    await page.getByRole("button", { name: SENGGIGI, exact: true }).click();
    await page.getByRole("button", { name: "Simpan", exact: true }).click();
    await page
      .getByRole("button", { name: "Tersimpan", exact: true })
      .waitFor();
    await page.getByRole("button", { name: BACK_TO_RESULTS }).click();
    assert.equal(new URL(page.url()).pathname, "/");
    await page
      .getByRole("button", { name: `Hapus ${SENGGIGI} dari wishlist` })
      .waitFor();
  },
  "TA-05": async (page) => {
    const cards = page.locator(".property-card");
    await cards.nth(5).waitFor();
    assert.equal(await cards.count(), 6);
    const first = await page
      .locator(".property-card__title")
      .first()
      .textContent();
    const [response] = await Promise.all([
      page.waitForResponse((item) => {
        const url = new URL(item.url());
        return (
          url.pathname === "/properties" && url.searchParams.get("page") === "2"
        );
      }),
      page.getByRole("button", { name: "Muat lebih banyak" }).click(),
    ]);
    assert.equal(
      response.status(),
      200,
      `API halaman 2: HTTP ${response.status()}`
    );
    assert.equal(
      (await response.json()).data.length,
      6,
      "API halaman 2 harus mengirim 6 properti"
    );
    try {
      await cards.nth(11).waitFor();
    } catch (error) {
      const alerts = await page.getByRole("alert").allInnerTexts();
      throw new Error(
        `Halaman 2 tidak tampil: ${await cards.count()} kartu; ${alerts.join(" | ") || "tanpa pesan galat"}`,
        { cause: error }
      );
    }
    assert.equal(
      await page.locator(".property-card__title").first().textContent(),
      first
    );
  },
};

async function checkJourneys(urls, output) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const passed = [];
  try {
    for (const [framework, url] of Object.entries(urls)) {
      for (const [scenario, run] of Object.entries(journeys)) {
        const context = await browser.newContext({
          locale: "id-ID",
          viewport: { width: 1350, height: 940 },
        });
        try {
          const page = await context.newPage();
          await page.goto(url, { waitUntil: "domcontentloaded" });
          await run(page);
          passed.push({ framework, scenario });
          process.stdout.write(`Alur ${scenario}: ${framework} lulus\n`);
        } catch (error) {
          throw new Error(
            `Alur ${scenario} gagal pada ${framework}: ${error.message}`,
            { cause: error }
          );
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  writeFileSync(
    join(output, "journey-checks.json"),
    JSON.stringify({ passed }, null, 2)
  );
}

module.exports = { checkJourneys };
