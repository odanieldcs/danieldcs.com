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

3. Cover images go in [`public/media/posts/`](../../public/media/posts/). In frontmatter, use just the filename (`cover: meu-artigo.png`); the route resolves it to `/media/posts/<filename>`.

Copy this and change the values:

````mdx
---
title: Como o content system renderiza um artigo
description: Um passeio pelo pipeline de ponta a ponta — frontmatter, loaders, MDX, Shiki e a rota /blog/[slug].
date: 2026-09-21
tags:
  - content
  - mdx
  - nextjs
cover: content-system.png
language: pt
---

Este artigo existe para provar que o pipeline de conteúdo funciona: do MDX em `content/posts/` até `/blog/content-system`.

## Do arquivo à página

O trecho abaixo é o padrão usado pelos loaders para listar slugs em build time:

```ts
export function getAllPostSlugs(postsDir?: string): string[] {
  return readdirSync(resolvePostsDir(postsDir))
    .filter((filename) => filename.endsWith('.mdx'))
    .map(slugFromFilename)
}
```

![Fluxo simplificado do content system](/media/posts/content-system-pipeline.png)
````

The reference article is [`content-system.mdx`](content-system.mdx).

Invalid frontmatter breaks the loaders and `pnpm build`. Publishing follows the branch/PR flow in [`AGENTS.md`](../../AGENTS.md) and the [root README](../../README.md).
