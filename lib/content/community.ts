import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import {
  type CommunityFrontmatter,
  communityFrontmatterSchema,
} from './community-schema'

const DEFAULT_COMMUNITY_DIR = path.join(process.cwd(), 'content/community')

export type CommunityEntry = {
  slug: string
  frontmatter: CommunityFrontmatter
}

function resolveCommunityDir(communityDir = DEFAULT_COMMUNITY_DIR): string {
  return communityDir
}

function slugFromFilename(filename: string): string {
  return path.basename(filename, '.mdx')
}

function formatFrontmatterError(filename: string, error: z.ZodError): Error {
  const fields = [
    ...new Set(error.issues.map((issue) => issue.path.join('.') || '(root)')),
  ]

  return new Error(`Invalid frontmatter in ${filename}: ${fields.join(', ')}`, {
    cause: error,
  })
}

function parseCommunityFile(filePath: string, slug: string): CommunityEntry {
  const raw = readFileSync(filePath, 'utf8')
  const { data } = matter(raw)

  try {
    return {
      slug,
      frontmatter: communityFrontmatterSchema.parse(data),
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw formatFrontmatterError(path.basename(filePath), error)
    }
    throw error
  }
}

export function getAllCommunityEntrySlugs(communityDir?: string): string[] {
  return readdirSync(resolveCommunityDir(communityDir))
    .filter((filename) => filename.endsWith('.mdx'))
    .map(slugFromFilename)
}

export function getAllCommunityEntries(
  communityDir?: string,
): CommunityEntry[] {
  const dir = resolveCommunityDir(communityDir)

  return getAllCommunityEntrySlugs(dir)
    .map((slug) => parseCommunityFile(path.join(dir, `${slug}.mdx`), slug))
    .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
}
