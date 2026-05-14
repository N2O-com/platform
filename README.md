# Platform

**Production-grade monorepo built with Next.js and Turborepo.**

## Overview

Platform is a full-stack application using a monorepo structure managed by [Turborepo](https://turborepo.com) with [Next.js](https://nextjs.org/) apps and a set of shared packages.

### Philosophy

- **Fast** — Quick to build, run, deploy, and iterate on
- **Type-Safe** — End-to-end TypeScript
- **Modern** — Latest stable features with healthy community support
- **Scalable** — Monorepo structure that scales with your team

## Structure

```
platform/
├── apps/
│   ├── app/                 # Main authenticated application (port 3000)
│   └── web/                 # Marketing website (port 3001)
└── packages/
    ├── ai/                  # AI integration utilities (OpenAI)
    ├── analytics/           # PostHog + Google Analytics
    ├── auth/                # Authentication (Better Auth)
    ├── database/            # Database client (Kysely + Neon/Planetscale)
    ├── design/              # UI component library (shadcn/ui)
    ├── email/               # Email templates (React Email) + Resend
    ├── internationalization/# i18n support with locale detection
    ├── next-config/         # Shared Next.js configuration
    ├── observability/       # Error tracking and logging
    ├── realtime/            # Real-time messaging (Ably)
    ├── seo/                 # Metadata, sitemaps, JSON-LD
    ├── storage/             # File storage (S3, R2, custom)
    ├── typescript-config/   # Shared tsconfig
    ├── vitest/              # Shared Vitest + MSW config
    └── webhooks/            # Webhook handling and verification
```

Database migrations, schemas, and seeds live under `apps/app/lib/db/` and run from the `app` workspace.

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io) 10+
- A PostgreSQL database ([Neon](https://neon.tech) or [Planetscale](https://planetscale.com))
- Service accounts as required by the features you enable (Better Auth, Resend, PostHog, Ably, etc.)

### Installation

```sh
git clone <your-repo-url>
cd platform
pnpm install
```

### Setup

1. **Configure per-app environment variables:**
   ```sh
   cp apps/app/.env.local.example apps/app/.env.local
   cp apps/web/.env.local.example apps/web/.env.local
   ```

2. **Configure migration credentials** at the repo root in `.env.local`:
   ```sh
   DATABASE_URL_DEV_ADMIN=postgresql://admin:password@host:5432/dbname
   DATABASE_URL_PROD_ADMIN=postgresql://admin:password@host:5432/dbname
   ```
   Generate a Better Auth secret with `npx @better-auth/cli secret`. See [env.md](./env.md) for the full variable list.

3. **Run database migrations:**
   ```sh
   pnpm --filter app migrate:dev
   ```

4. **Start the dev servers:**
   ```sh
   pnpm dev
   ```
   - App: http://localhost:3000
   - Web: http://localhost:3001

## Environment Variables

Variables are scoped per app following [Turborepo conventions](https://turborepo.com/docs/crafting-your-repository/using-environment-variables):

- `apps/app/.env.local` — main application
- `apps/web/.env.local` — marketing site
- Root `.env.local` — database migration admin credentials only

Each app ships a `.env.local.example`. See [env.md](./env.md) for documentation.

## Scripts

- `pnpm dev` — start all apps in development mode
- `pnpm build` — build all apps and packages
- `pnpm test` — run tests across all packages
- `pnpm typecheck` — type-check the workspace
- `pnpm check` / `pnpm fix` — lint and auto-fix via Ultracite
- `pnpm --filter app migrate:dev` — run development migrations
- `pnpm --filter app migrate:prod` — run production migrations
- `pnpm --filter app seed:dev` — seed the development database

## License

MIT
