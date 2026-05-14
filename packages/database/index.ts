if (typeof process !== "undefined" && process.env.NEXT_RUNTIME) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("server-only");
}

import { neon, neonConfig } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";

// Route the Neon HTTP driver through /sql so Kysely queries are single-shot HTTP
// requests rather than WebSocket sessions.
neonConfig.fetchEndpoint = (host) => `https://${host}/sql`;

export const getDatabaseUrl = (env?: "dev" | "prod") => {
  if (env === "prod" || process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL_PROD;
  }
  return process.env.DATABASE_URL_DEV;
};

// Placeholder satisfies `neon()` URL parsing during `next build`'s page-data
// collection, when DATABASE_URL is not yet present. At runtime in deployed
// environments the real env var is set, so this fallback is never used; if it
// somehow is, the actual connection attempt fails at first query.
const BUILD_PLACEHOLDER_URL = "postgresql://placeholder@localhost/placeholder";

export const createDb = <DB>(url?: string): Kysely<DB> => {
  const connectionString = url || getDatabaseUrl() || BUILD_PLACEHOLDER_URL;
  return new Kysely<DB>({
    dialect: new NeonDialect({ neon: neon(connectionString) }),
  });
};

export * from "kysely";
export {
  rollbackMigrations,
  runMigrations,
  showMigrationStatus,
} from "./migrations/runner";
