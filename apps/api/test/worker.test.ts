import { describe, expect, test } from "bun:test";
import worker from "../src/worker";

describe("Cloudflare Worker entrypoint", () => {
  test("serves the Elysia health route", async () => {
    const response = await worker.fetch(
      new Request("https://api.example.test/health")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
