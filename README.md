# danieldcs.com

## Project structure

- `app/` — Next.js App Router (routes, layouts, and styles)
- `content/` — source content (`posts/`, `community/`); MDX loaders come later
- `public/` — static files, including `media/` for posts, personal photos, icons, illustrations, and documents
- `lib/` — shared TypeScript modules

`@/foo` resolves to `<repo>/foo` via `compilerOptions.paths` in `tsconfig.json`. Example: `@/lib/site` → `lib/site.ts`. There is no `~/*` alias.

## E2E tests

Install Playwright's Chromium browser once, then run the smoke test against a local production build:

```sh
pnpm exec playwright install
pnpm test:e2e
```

`pnpm test:e2e` builds and starts the app (`pnpm build && pnpm start`) via Playwright's `webServer`.
