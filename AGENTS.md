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
- Interface language comes from the route, not from cookies: PT lives at the root in `app/(pt)` (no prefix, no `/pt` route) and EN lives under `/en` in `app/(en)/en`. Each group has its own root layout rendering `components/site-shell.tsx` with its `lang`. No `Accept-Language` detection or automatic redirects.
- `/alunos` is the interim certificate check for certificates already issued. It stays PT-only, `noindex`, outside `localizedPages` (no hreflang), and out of any sitemap. When the Trilha certificate lookup exists, replace this route with a redirect to that lookup.
- Analytics via PostHog in Production only; event contract in [`docs/analytics.md`](docs/analytics.md) — document new events there first.

## Out of V1

Do not add these unless the current ticket asks for them: custom domain `danieldcs.com`, MDX loaders, CMS, required PR reviews, CODEOWNERS.

## Workflow

Trunk-based: feature branch → PR → `main` → Vercel. Direct pushes to `main` are blocked. The GitHub Actions check `ci` must pass. Reviews are not required (solo V1). No CODEOWNERS or issue/PR templates.
