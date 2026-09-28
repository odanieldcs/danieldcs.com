import { getAllPosts, type PostSummary } from '@/lib/content/posts'

let cachedPosts: PostSummary[] | undefined

function loadPosts(context: string): PostSummary[] {
  cachedPosts ??= getAllPosts()

  if (cachedPosts.length === 0) {
    throw new Error(
      `e2e (${context}) requires at least one post in content/posts`,
    )
  }

  return cachedPosts
}

export function getNewestBlogPost(context: string): PostSummary {
  const posts = loadPosts(context)
  const newest = posts[0]

  if (!newest) {
    throw new Error(
      `e2e (${context}) requires at least one post in content/posts`,
    )
  }

  return newest
}

export function getBlogPostCount(context: string): number {
  return loadPosts(context).length
}
