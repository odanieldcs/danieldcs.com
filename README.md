# danieldcs.com

Personal website of Daniel Castro. Static-first Next.js app, hosted on Vercel.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript (strict)
- Tailwind CSS v4
- Biome (lint and format)
- MDX (content loaders come later)
- Vitest and Testing Library
- Playwright (Chromium)
- Vercel

## Getting started

Requires [pnpm](https://pnpm.io) 11.5.2 and Node.js 22+.

```sh
pnpm install
cp .env.example .env
pnpm dev
```

V1 does not need any environment variables. `.env.example` only documents placeholders for later (PostHog in the Analytics & Observability milestone).

## Scripts

- `pnpm dev` — Next.js development server
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm test` — unit tests (Vitest)
- `pnpm test:e2e` — E2E smoke tests (Playwright, Chromium)
- `pnpm lint` — Biome check
- `pnpm format` — Biome check and write
- `pnpm typecheck` — `tsc --noEmit`

Install Playwright's Chromium browser once before the first E2E run:

```sh
pnpm exec playwright install
pnpm test:e2e
```

`pnpm test:e2e` builds and starts the app (`pnpm build && pnpm start`) via Playwright's `webServer`.

## Project structure

- `app/` — Next.js App Router (routes, layouts, and styles)
- `content/` — source content (`posts/`, `community/`); MDX loaders come later
- `public/` — static files, including `media/` for posts, personal photos, icons, illustrations, and documents
- `lib/` — shared TypeScript modules
- `e2e/` — Playwright smoke tests

`@/foo` resolves to `<repo>/foo` via `compilerOptions.paths` in `tsconfig.json`. Example: `@/lib/site` → `lib/site.ts`. There is no `~/*` alias.

## Branching

Trunk-based: feature branch → pull request → `main` → Vercel. Direct pushes, force-pushes, and deleting `main` are blocked. The GitHub Actions check `ci` must be green before merge. Reviews are not required in V1 (solo project).
