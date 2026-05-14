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

type NeonSql = ReturnType<typeof neon>;

// URL resolution and `neon()` construction are deferred until the first query.
// This keeps `createDb()` safe to call at module load (e.g. during `next build`'s
// page-data collection) when DATABASE_URL is not yet present. The error surfaces
// only if a query actually runs without a connection string.
export const createDb = <DB>(url?: string): Kysely<DB> => {
  let cached: NeonSql | undefined;

  const resolveNeon = (): NeonSql => {
    if (cached) return cached;
    const connectionString = url || getDatabaseUrl();
    if (!connectionString) {
      throw new Error(
        `Database URL is not defined. Please set DATABASE_URL_${
          process.env.NODE_ENV === "production" ? "PROD" : "DEV"
        }`
      );
    }
    cached = neon(connectionString);
    return cached;
  };

  // NeonDialect invokes its `neon` field as a SQL executor; forward all args to
  // the lazily-resolved instance.
  const lazyNeon = ((...args: Parameters<NeonSql>) =>
    resolveNeon()(...args)) as NeonSql;

  return new Kysely<DB>({
    dialect: new NeonDialect({ neon: lazyNeon }),
  });
};

export * from "kysely";
export {
  rollbackMigrations,
  runMigrations,
  showMigrationStatus,
} from "./migrations/runner";
