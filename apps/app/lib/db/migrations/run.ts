#!/usr/bin/env tsx

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// Load environment variables from the monorepo root .env.local file
import { config as dotenvConfig } from "dotenv";

// Get the root directory (two levels up from packages/database/migrations)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "../../..");
dotenvConfig({ path: resolve(rootDir, ".env.local") });

import {
  createDb,
  rollbackMigrations,
  runMigrations,
  showMigrationStatus,
} from "@repo/database";

// migrationsDir is already set from __dirname above
const migrationsDir = __dirname;

function printUsage() {
  console.log(`
Usage: tsx migrations/run.ts [dev|prod] [command] [options]

ENVIRONMENT
  dev   Use DATABASE_URL_DEV_ADMIN
  prod  Use DATABASE_URL_PROD_ADMIN

COMMANDS
  up       Run all pending migrations (default)
  down     Rollback migrations
  status   Show migration status

OPTIONS
  --all              Rollback all migrations (with 'down')
  --count <number>    Rollback N migrations (with 'down')
  --to <migration>    Run up to this migration (with 'up') or rollback down to this (with 'down')
  --migrations <list> Run/rollback specific migrations (comma-separated)
  --migration <name>  Add a migration to run/rollback (can be used multiple times)
  --only <migration>  Run only this specific migration (with 'up', deprecated)
  --dry-run           Show what would happen without executing

EXAMPLES
  # Run all pending migrations
  tsx migrations/run.ts dev up

  # Run specific migrations
  tsx migrations/run.ts dev up --migrations 20240101120000_auth,20240102120000_posts
  tsx migrations/run.ts dev up --migration 20240101120000_auth --migration 20240102120000_posts

  # Run up to a specific migration
  tsx migrations/run.ts dev up --to 20240101120000_auth

  # Rollback migrations
  tsx migrations/run.ts dev down
  tsx migrations/run.ts dev down --count 2
  tsx migrations/run.ts dev down --migrations 20240102120000_posts,20240103120000_comments
  tsx migrations/run.ts dev down --to 20240101120000_auth

  # Check status
  tsx migrations/run.ts dev status

  # Dry run
  tsx migrations/run.ts dev up --dry-run
`);
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const env = args[0];
  const command = args[1] || "up";
  const options: {
    count?: number;
    all?: boolean;
    dryRun?: boolean;
    to?: string;
    only?: string;
    migrations?: string[];
  } = {};

  // Parse additional options
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--all") {
      options.all = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--count" && args[i + 1]) {
      options.count = Number.parseInt(args[i + 1], 10);
      i++;
    } else if (arg === "--to" && args[i + 1]) {
      options.to = args[i + 1];
      i++;
    } else if (arg === "--only" && args[i + 1]) {
      options.only = args[i + 1];
      i++;
    } else if (arg === "--migrations" && args[i + 1]) {
      // Support comma-separated list: --migrations migration1,migration2,migration3
      options.migrations = args[i + 1].split(",").map((m) => m.trim());
      i++;
    } else if (arg === "--migration" && args[i + 1]) {
      // Support multiple --migration flags: --migration migration1 --migration migration2
      if (!options.migrations) {
        options.migrations = [];
      }
      options.migrations.push(args[i + 1]);
      i++;
    }
  }

  // Validate environment
  if (!env || (env !== "prod" && env !== "dev")) {
    printUsage();
    process.exit(1);
  }

  // Get admin URL for migrations
  const adminUrl =
    env === "prod"
      ? process.env.DATABASE_URL_PROD_ADMIN
      : process.env.DATABASE_URL_DEV_ADMIN;

  if (!adminUrl) {
    console.error(
      `Error: DATABASE_URL_${env === "prod" ? "PROD" : "DEV"}_ADMIN is not set`
    );
    process.exit(1);
  }

  const isProd = env === "prod";
  const envLabel = isProd ? "production" : "development";

  // Create admin connection for migrations
  const db = createDb(adminUrl);

  try {
    switch (command) {
      case "up": {
        console.log(`Running migrations on ${envLabel} database...\n`);
        await runMigrations(db, migrationsDir, options);
        break;
      }

      case "down": {
        console.log(`Rolling back migrations on ${envLabel} database...\n`);
        await rollbackMigrations(db, migrationsDir, options);
        break;
      }

      case "status": {
        await showMigrationStatus(db, migrationsDir);
        break;
      }

      default: {
        console.error(`\n✗ Unknown command: ${command}\n`);
        console.error("Valid commands: up, down, status\n");
        printUsage();
        process.exit(1);
      }
    }
  } catch (error) {
    console.error("\n✗ Migration operation failed:", error);
    throw error;
  } finally {
    await db.destroy();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
