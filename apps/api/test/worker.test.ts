import { describe, expect, test } from "bun:test";
import { createCloudflareApp } from "../src/cloudflare-app";
import { createLocalPropertyCatalogRepository } from "../src/local-repository";

describe("Cloudflare Worker entrypoint", () => {
  test("uses the DB binding and serves catalog data", async () => {
    const binding = {} as D1Database;
    const repository = await createLocalPropertyCatalogRepository();
    let receivedBinding: D1Database | undefined;
    const app = createCloudflareApp(binding, (database) => {
      receivedBinding = database;
      return repository;
    });

    const response = await app.fetch(
      new Request("https://api.example.test/properties/prop_002")
    );

    expect(receivedBinding).toBe(binding);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: "prop_002",
      isWishlisted: true,
    });
  });
});
