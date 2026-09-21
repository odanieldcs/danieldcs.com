import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { type PostFrontmatter, postFrontmatterSchema } from './schema'

const DEFAULT_POSTS_DIR = path.join(process.cwd(), 'content/posts')

export type Post = {
  slug: string
  frontmatter: PostFrontmatter
  content: string
}

export type PostSummary = {
  slug: string
  frontmatter: PostFrontmatter
}

function resolvePostsDir(postsDir = DEFAULT_POSTS_DIR): string {
  return postsDir
}

function slugFromFilename(filename: string): string {
  return path.basename(filename, '.mdx')
}

function isSafeSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    path.basename(slug) === slug &&
    slug !== '.' &&
    slug !== '..'
  )
}

function formatFrontmatterError(filename: string, error: z.ZodError): Error {
  const fields = [
    ...new Set(error.issues.map((issue) => issue.path.join('.') || '(root)')),
  ]

  return new Error(`Invalid frontmatter in ${filename}: ${fields.join(', ')}`, {
    cause: error,
  })
}

function parsePostFile(filePath: string, slug: string): Post {
  let raw: string
  try {
    raw = readFileSync(filePath, 'utf8')
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`Post not found: ${slug}`)
    }
    throw error
  }

  const { data, content } = matter(raw)

  try {
    return {
      slug,
      frontmatter: postFrontmatterSchema.parse(data),
      content,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw formatFrontmatterError(path.basename(filePath), error)
    }
    throw error
  }
}

export function getAllPostSlugs(postsDir?: string): string[] {
  return readdirSync(resolvePostsDir(postsDir))
    .filter((filename) => filename.endsWith('.mdx'))
    .map(slugFromFilename)
}

export function getPostBySlug(slug: string, postsDir?: string): Post {
  if (!isSafeSlug(slug)) {
    throw new Error(`Post not found: ${slug}`)
  }

  return parsePostFile(
    path.join(resolvePostsDir(postsDir), `${slug}.mdx`),
    slug,
  )
}

export function getAllPosts(postsDir?: string): PostSummary[] {
  const dir = resolvePostsDir(postsDir)

  return getAllPostSlugs(dir)
    .map((slug) => {
      const { slug: postSlug, frontmatter } = getPostBySlug(slug, dir)
      return { slug: postSlug, frontmatter }
    })
    .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
}
