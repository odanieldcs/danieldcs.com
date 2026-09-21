# Agent notes

Operational context for this repo. Commands, scripts, and folder layout live in [README.md](README.md) — do not repeat them here. Follow the Linear issue in front of you; if it conflicts with this file, flag the conflict instead of silently redefining the decision.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict, pnpm 11.5
- Tailwind CSS v4, Biome, MDX (content files only for now)
- Vitest + Testing Library, Playwright (Chromium)
- Vercel Git integration (no `vercel.ts` in V1)
- Import alias is `@/*` → repo root. Do not add `~/*`.

## Architecture (V1)

- Static-first. Server Components by default. Keep client JavaScript minimal.
- No CMS, database, or authentication.
- Do not reintroduce React Router, Vite, Fly.io, or Docker.

## Out of V1

Do not add these unless the current ticket asks for them: PostHog, custom domain `danieldcs.com`, MDX loaders, i18n/redirects, CMS, required PR reviews, CODEOWNERS.

## Workflow

Trunk-based: feature branch → PR → `main` → Vercel. Direct pushes to `main` are blocked. The GitHub Actions check `ci` must pass. Reviews are not required (solo V1). No CODEOWNERS or issue/PR templates.
