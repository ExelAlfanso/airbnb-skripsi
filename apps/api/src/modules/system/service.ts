import type { AppInfoResponse, HealthResponse } from "./model";

export function getAppInfo(): AppInfoResponse {
  return {
    name: "@airbnb-skripsi/api",
    status: "ok",
  };
}

export function getHealth(): HealthResponse {
  return {
    status: "ok",
  };
}
