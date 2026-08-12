import { describe, expect, test } from "bun:test";
import { createLocalPropertyCatalogRepository } from "../src/local-repository";
import { createCloudflareWorker } from "../src/worker";

describe("Cloudflare Worker entrypoint", () => {
  test("uses the DB binding and serves catalog data", async () => {
    const binding = {} as D1Database;
    const repository = await createLocalPropertyCatalogRepository();
    let receivedBinding: D1Database | undefined;
    const worker = createCloudflareWorker((database) => {
      receivedBinding = database;
      return repository;
    });

    const response = await worker.fetch(
      new Request("https://api.example.test/properties/prop_002"),
      { DB: binding }
    );

    expect(receivedBinding).toBe(binding);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: "prop_002",
      isWishlisted: true,
    });
  });
});
