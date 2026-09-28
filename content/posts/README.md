# Posts

Flat `*.mdx` files (not recursive). Slug is the filename without the extension.

Each file starts with YAML frontmatter validated by [`lib/content/schema.ts`](../../lib/content/schema.ts). Loaders live in `lib/content/posts.ts`.

`README.md` is ignored by the loaders.

## Add a post

1. Create `content/posts/<slug>.mdx`. The slug becomes the route `/blog/<slug>`. No subfolders.

2. Put YAML frontmatter at the top.

   Required: `title`, `description`, `date`, `language`.

   Optional: `updatedAt`, `tags` (omit = `[]`), `cover`.

   `language` is `pt` or `en`. `date` and `updatedAt` use `YYYY-MM-DD`. Extra keys fail — the schema is strict, so skip `draft` and typos. Validation lives in [`lib/content/schema.ts`](../../lib/content/schema.ts).

3. Cover images go in [`public/media/posts/<slug>/`](../../public/media/posts/). Use an absolute path in frontmatter (`cover: /media/posts/<slug>/capa.png`) and the same prefix for inline images in the body (`/media/posts/<slug>/<arquivo>`). A bare filename still resolves to `/media/posts/<filename>`.

Copy this and change the values:

````mdx
---
title: Meu artigo
description: Resumo curto para listagens e SEO.
date: 2026-09-21
tags:
  - exemplo
cover: /media/posts/meu-artigo/capa.png
language: pt
---

Texto introdutório do artigo.

## Seção

Conteúdo em Markdown ou MDX.

```ts
export function exemplo(): string {
  return 'hello'
}
```

![Legenda opcional](/media/posts/meu-artigo/figura.png)
````

The reference article is [`postgresql-e-pgadmin-com-docker-compose.mdx`](postgresql-e-pgadmin-com-docker-compose.mdx).

### Code fences

Fenced blocks are highlighted with Shiki at build time. To highlight lines, append meta to the opening fence (sets `data-highlight="true"` on those lines):

````md
```ts {1,5,13}
const a = 1
```
````

Ranges work too: `{1,5-7}`.

Invalid frontmatter breaks the loaders and `pnpm build`. Publishing follows the branch/PR flow in [`AGENTS.md`](../../AGENTS.md) and the [root README](../../README.md).
