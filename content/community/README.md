# Community

Flat `*.mdx` files (not recursive). The filename is a stable slug. It does not become a route — `/community` lists every entry. There is no `/community/[slug]`.

The timeline year comes from `date`. Loaders live in [`lib/content/community.ts`](../../lib/content/community.ts) and return slug plus frontmatter. The MDX body is ignored.

`README.md` is ignored by the loaders.

## Add an entry

1. Create `content/community/<slug>.mdx`. No subfolders. The slug is the filename, for example `exemplo-2026-05-palestra.mdx`. The timeline year is taken from `date`, not from the filename.

2. Put YAML frontmatter at the top. Validation lives in [`lib/content/community-schema.ts`](../../lib/content/community-schema.ts). The schema is strict.

   Required: `title`, `description`, `date` (`YYYY-MM-DD`), `type` (`talk`, `workshop`, `event`, or `other`), `language` (`pt` or `en`).

   Optional: `eventName`, `link` (absolute `http` or `https` URL), `cover` (filename only).

   `language` is the language of that participation, the same idea as posts. It does not filter the page. Extra keys fail — skip `draft` and typos.

3. The file body can stay empty. It is not rendered.

4. Cover photos go in [`public/media/personal/`](../../public/media/personal/). In frontmatter, use just the filename (`cover: foto.jpg`). The page resolves it to `/media/personal/<filename>`. Omit `cover` for a text-only row.

Copy this and change the values:

```mdx
---
title: Exemplo de palestra
description: Entrada de exemplo para exercitar a timeline.
date: 2026-05-03
type: talk
eventName: Encontro de exemplo
link: https://example.com/community/exemplo-2026-05-palestra
language: pt
---
```

Invalid frontmatter breaks the loaders and `pnpm build`.
