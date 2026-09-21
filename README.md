# danieldcs.com

## Project structure

- `app/` — Next.js App Router (routes, layouts, and styles)
- `content/` — source content (`posts/`, `community/`); MDX loaders come later
- `public/` — static files, including `media/` for posts, personal photos, icons, illustrations, and documents
- `lib/` — shared TypeScript modules

`@/foo` resolves to `<repo>/foo` via `compilerOptions.paths` in `tsconfig.json`. Example: `@/lib/site` → `lib/site.ts`. There is no `~/*` alias.
