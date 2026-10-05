import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { flattenRedirects, redirectGroups } from '@/lib/redirects'
import { getAllPostSlugs } from './posts'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const contentDir = path.join(repoRoot, 'content')
const appDir = path.join(repoRoot, 'app')
const publicDir = path.join(repoRoot, 'public')

const markdownLink = /\]\((\/[^)\s]+)(?:\s+"[^"]*")?\)/g

const postSlugs = new Set(getAllPostSlugs())

type AppRoute =
  | { kind: 'exact'; pathname: string }
  | { kind: 'post'; pattern: RegExp }

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function loadAppRoutes(): AppRoute[] {
  return readdirSync(appDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => {
      const base = path.basename(file)
      return base === 'page.tsx' || base === 'route.ts'
    })
    .map((file) => {
      const segments = path
        .dirname(file)
        .split(path.sep)
        .filter((segment) => segment !== '.' && !/^\(.+\)$/.test(segment))
      const pathname = `/${segments.join('/')}`

      if (!segments.some((segment) => segment.startsWith('['))) {
        return { kind: 'exact', pathname }
      }

      const pattern = segments
        .map((segment) =>
          segment === '[slug]' ? '([^/]+)' : escapeRegExp(segment),
        )
        .join('/')

      return { kind: 'post', pattern: new RegExp(`^/${pattern}$`) }
    })
}

function compileSource(source: string): RegExp {
  let pattern = ''
  let index = 0

  while (index < source.length) {
    if (source.startsWith('{/}?', index)) {
      pattern += '(?:/)?'
      index += '{/}?'.length
      continue
    }

    const param = /^:([A-Za-z0-9_]+)(\*|\+)?/.exec(source.slice(index))
    if (param) {
      const modifier = param[2]
      pattern +=
        modifier === '*' ? '(.*)' : modifier === '+' ? '(.+)' : '([^/]+)'
      index += param[0].length
      continue
    }

    pattern += escapeRegExp(source[index] ?? '')
    index += 1
  }

  return new RegExp(`^${pattern}$`)
}

const appRoutes = loadAppRoutes()
const redirectPatterns = flattenRedirects(redirectGroups).map((entry) =>
  compileSource(entry.source),
)

function pathCandidates(href: string): string[] {
  const withoutSuffix = href.split(/[?#]/, 1)[0] ?? href
  let decoded = withoutSuffix
  try {
    decoded = decodeURIComponent(withoutSuffix)
  } catch {
    decoded = withoutSuffix
  }

  if (decoded.length > 1 && decoded.endsWith('/')) {
    return [decoded, decoded.slice(0, -1)]
  }

  return [decoded]
}

function isAppRoute(pathname: string): boolean {
  return appRoutes.some((route) => {
    if (route.kind === 'exact') {
      return route.pathname === pathname
    }
    const slug = route.pattern.exec(pathname)?.[1]
    return slug != null && postSlugs.has(slug)
  })
}

function isPublicFile(pathname: string): boolean {
  if (!pathname.startsWith('/')) {
    return false
  }
  const file = path.resolve(publicDir, pathname.slice(1))
  const root = path.resolve(publicDir)
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    return false
  }
  return existsSync(file) && statSync(file).isFile()
}

function isRedirectSource(pathname: string): boolean {
  return redirectPatterns.some((pattern) => pattern.test(pathname))
}

function isInternalTarget(href: string): boolean {
  return pathCandidates(href).some(
    (pathname) =>
      isAppRoute(pathname) ||
      isRedirectSource(pathname) ||
      isPublicFile(pathname),
  )
}

function mdxFiles(): string[] {
  return readdirSync(contentDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(contentDir, file))
}

function markdownInternalLinks(source: string): string[] {
  return [...source.matchAll(markdownLink)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  )
}

test('redirect-only paths and unknown slugs follow the internal-link rule', () => {
  expect(isInternalTarget('/contato')).toBe(true)
  expect(isInternalTarget('/instagram')).toBe(true)
  expect(isInternalTarget('/telegram')).toBe(true)
  expect(isInternalTarget('/about')).toBe(true)
  expect(isInternalTarget('/blog/does-not-exist')).toBe(false)
  expect(isInternalTarget('/missing-page')).toBe(false)
})

test('every internal markdown link points at a route, post, public file, or redirect', () => {
  const missing: string[] = []
  let checked = 0

  for (const file of mdxFiles()) {
    const source = readFileSync(file, 'utf8')
    for (const href of markdownInternalLinks(source)) {
      const pathname = href.split(/[?#]/, 1)[0] ?? href
      if (pathname.startsWith('/media/')) {
        continue
      }
      checked += 1
      if (!isInternalTarget(href)) {
        missing.push(`${path.relative(contentDir, file)} → ${href}`)
      }
    }
  }

  expect(checked).toBeGreaterThan(0)
  expect(missing).toEqual([])
})
