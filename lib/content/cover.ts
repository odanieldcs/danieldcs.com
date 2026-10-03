/**
 * Resolves a post `cover` to a site-absolute path. Absolute values are kept
 * as-is; bare filenames fall back to the shared `public/media/posts/` folder.
 */
export function resolveCoverSrc(cover: string): string {
  if (cover.startsWith('/') && !cover.startsWith('//')) {
    return cover
  }

  return `/media/posts/${cover}`
}
