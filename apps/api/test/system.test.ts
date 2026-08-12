import { describe, expect, test } from "bun:test";
import { app } from "../src/app";

describe("system routes", () => {
  test("GET / returns app info", async () => {
    const response = await app.handle(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      name: "@airbnb-skripsi/api",
      status: "ok",
    });
  });

  test("GET /health returns health status", async () => {
    const response = await app.handle(new Request("http://localhost/health"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
    });
  });

  test("unknown routes return 404", async () => {
    const response = await app.handle(new Request("http://localhost/unknown"));

    expect(response.status).toBe(404);
  });
});
