import { env } from "cloudflare:workers";
import { createCloudflareApp } from "./cloudflare-app";

export interface CloudflareEnv {
  DB: D1Database;
}

export default createCloudflareApp((env as CloudflareEnv).DB);
