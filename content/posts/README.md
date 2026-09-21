# Posts

Flat `*.mdx` files (not recursive). Slug is the filename without the extension.

Each file starts with YAML frontmatter validated by `lib/content/schema.ts`. Loaders live in `lib/content/posts.ts`.

`README.md` is ignored by the loaders.
