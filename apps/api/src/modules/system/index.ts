import { Elysia } from "elysia";
import { systemModels } from "./model";
import { getAppInfo, getHealth } from "./service";

export const systemModule = new Elysia({ name: "System" })
  .model(systemModels)
  .get("/", () => getAppInfo(), {
    response: {
      200: "appInfoResponse",
    },
  })
  .get("/health", () => getHealth(), {
    response: {
      200: "healthResponse",
    },
  });
