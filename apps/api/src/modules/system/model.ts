import { t } from "elysia";

export const systemModels = {
  appInfoResponse: t.Object({
    name: t.Literal("@airbnb-skripsi/api"),
    status: t.Literal("ok"),
  }),
  healthResponse: t.Object({
    status: t.Literal("ok"),
  }),
};

export type AppInfoResponse = typeof systemModels.appInfoResponse.static;
export type HealthResponse = typeof systemModels.healthResponse.static;
