import { edenTreaty } from "@elysia/eden";
import type { App } from "./app";

export function createApiClient(domain: string) {
  return edenTreaty<App>(domain);
}
