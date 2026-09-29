import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { expect, test } from 'vitest'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const postsDir = path.join(repoRoot, 'content/posts')
const publicDir = path.join(repoRoot, 'public')
const mediaPostsDir = path.join(publicDir, 'media/posts')

function postFiles(): string[] {
  return readdirSync(postsDir)
    .filter((name) => name.endsWith('.mdx'))
    .sort()
}

function mediaDirectories(): string[] {
  return readdirSync(mediaPostsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function readPost(filename: string): string {
  return readFileSync(path.join(postsDir, filename), 'utf8')
}

function normalizePublicPath(urlPath: string): string {
  const withoutSuffix = urlPath.split(/[?#]/, 1)[0] ?? urlPath
  try {
    return decodeURIComponent(withoutSuffix)
  } catch {
    return withoutSuffix
  }
}

function isAbsolutePublicPath(urlPath: string): boolean {
  return urlPath.startsWith('/') && !urlPath.startsWith('//')
}

function fileInPublic(urlPath: string): string {
  const normalized = normalizePublicPath(urlPath)
  const file = path.resolve(publicDir, normalized.slice(1))
  const root = path.resolve(publicDir)
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Path escapes public/: ${urlPath}`)
  }
  return file
}

function coverPath(raw: string): string | undefined {
  const cover = matter(raw).data.cover
  return typeof cover === 'string' ? cover : undefined
}

function bodyMediaPaths(raw: string): string[] {
  const content = matter(raw).content
  return [...content.matchAll(/\/media\/[A-Za-z0-9_./%-]+/g)].map((match) =>
    normalizePublicPath(match[0]),
  )
}

function citedPaths(raw: string): Set<string> {
  const cited = new Set(bodyMediaPaths(raw))
  const cover = coverPath(raw)
  if (cover && isAbsolutePublicPath(cover)) {
    cited.add(normalizePublicPath(cover))
  }
  return cited
}

function filesInDirectory(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...filesInDirectory(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

function urlPathForFile(file: string): string {
  const relative = path.relative(publicDir, file).split(path.sep).join('/')
  return `/${relative}`
}

test('absolute post covers exist in public/', () => {
  const missing: string[] = []
  for (const filename of postFiles()) {
    const cover = coverPath(readPost(filename))
    if (!cover || !isAbsolutePublicPath(cover)) continue
    if (!existsSync(fileInPublic(cover))) missing.push(`${filename}: ${cover}`)
  }
  expect(missing).toEqual([])
})

test('each post media directory has a matching post', () => {
  const missing = mediaDirectories().filter(
    (slug) => !existsSync(path.join(postsDir, `${slug}.mdx`)),
  )
  expect(missing).toEqual([])
})

test('every file in a post media directory is cited by that post', () => {
  const uncited: string[] = []
  for (const slug of mediaDirectories()) {
    const postPath = path.join(postsDir, `${slug}.mdx`)
    if (!existsSync(postPath)) continue
    const cited = citedPaths(readFileSync(postPath, 'utf8'))
    for (const file of filesInDirectory(path.join(mediaPostsDir, slug))) {
      const urlPath = urlPathForFile(file)
      if (!cited.has(urlPath)) uncited.push(urlPath)
    }
  }
  expect(uncited).toEqual([])
})

test('media paths in post bodies exist in public/', () => {
  const missing: string[] = []
  for (const filename of postFiles()) {
    for (const urlPath of bodyMediaPaths(readPost(filename))) {
      if (!existsSync(fileInPublic(urlPath))) {
        missing.push(`${filename}: ${urlPath}`)
      }
    }
  }
  expect(missing).toEqual([])
})

test('posts do not reference wp-content', () => {
  const hits = postFiles().filter((filename) =>
    readPost(filename).includes('wp-content'),
  )
  expect(hits).toEqual([])
})
