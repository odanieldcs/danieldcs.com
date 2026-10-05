import { readdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { getAllPostSlugs } from '@/lib/content/posts'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import {
  flattenRedirects,
  type RedirectGroup,
  redirectGroups,
} from './redirects'

const appDir = path.resolve(import.meta.dirname, '../app')

function routesOf(language: InterfaceLanguage): Set<string> {
  const pageFiles = readdirSync(path.join(appDir, `(${language})`), {
    recursive: true,
    encoding: 'utf8',
  }).filter((file) => {
    const base = path.basename(file)
    return base === 'page.tsx' || base === 'route.ts'
  })

  return new Set(
    pageFiles.map((file) => {
      const segments = path
        .dirname(file)
        .split(path.sep)
        .filter((segment) => segment !== '.' && !/^\(.+\)$/.test(segment))

      return `/${segments.join('/')}`
    }),
  )
}

const appRoutes = new Set([...routesOf('pt'), ...routesOf('en')])

function expandSource(source: string): string[] {
  if (source.endsWith('{/}?')) {
    const base = source.slice(0, -'{/}?'.length)
    return [base, `${base}/`]
  }
  if (source.includes(':') || source.includes('*')) {
    return []
  }
  return [source]
}

function allSources(groups: readonly RedirectGroup[]): string[] {
  return groups.flatMap((group) => group.from)
}

function emittedRedirects() {
  return flattenRedirects(redirectGroups)
}

const postSlugs = new Set(getAllPostSlugs())

function isAbsoluteUrl(destination: string): boolean {
  return /^https?:\/\//.test(destination)
}

function destinationPathname(destination: string): string {
  if (isAbsoluteUrl(destination)) {
    return destination
  }
  const queryIndex = destination.indexOf('?')
  return queryIndex === -1 ? destination : destination.slice(0, queryIndex)
}

function isKnownDestination(destination: string): boolean {
  if (isAbsoluteUrl(destination)) {
    return true
  }
  const pathname = destinationPathname(destination)
  if (appRoutes.has(pathname)) {
    return true
  }
  const blogPrefix = '/blog/'
  if (pathname.startsWith(blogPrefix)) {
    const slug = pathname.slice(blogPrefix.length)
    return postSlugs.has(slug)
  }
  return false
}

test('no duplicate redirect sources (including pending groups)', () => {
  const sources = allSources(redirectGroups)
  expect(new Set(sources).size).toBe(sources.length)
})

test('redirect sources do not collide with live app routes', () => {
  for (const source of allSources(redirectGroups)) {
    for (const expanded of expandSource(source)) {
      if (expanded === '/alunos/' && source === '/alunos/') {
        continue
      }
      expect(appRoutes.has(expanded), `source ${source} → ${expanded}`).toBe(
        false,
      )
    }
  }
})

test('every emitted destination is a known route, blog post, or absolute URL', () => {
  for (const { destination } of emittedRedirects()) {
    expect(isKnownDestination(destination), destination).toBe(true)
  }
})

test('no emitted redirect has empty, null, or TODO destination', () => {
  for (const redirect of emittedRedirects()) {
    expect(redirect.destination).not.toBe('')
    expect(redirect.destination).not.toBe('TODO')
  }
  for (const group of redirectGroups) {
    if (group.from.length === 0) {
      continue
    }
    if (group.to == null || group.to === '' || group.to === 'TODO') {
      continue
    }
    expect(group.to).toBeTruthy()
    expect(group.to).not.toBe('TODO')
  }
})

test('flatten skips groups with to null and empty from', () => {
  const sample: RedirectGroup[] = [
    { to: null, permanent: false, from: ['/pending'] },
    { to: '/about', permanent: true, from: [] },
    { to: '/blog/foo', permanent: true, from: ['/foo'] },
  ]
  expect(flattenRedirects(sample)).toEqual([
    { source: '/foo', destination: '/blog/foo', permanent: true },
  ])
})

test('percent-encoded emoji old slug is registered', () => {
  const sources = allSources(redirectGroups)
  expect(sources).toContain(
    '/onde-encontrar-vagas-remota-no-exterior-usd-%f0%9f%a4%91{/}?',
  )
})

test('WordPress post section has 40 groups', () => {
  const firstPageGroupIndex = redirectGroups.findIndex((group) =>
    group.from.some((source) => source.startsWith('/sobre')),
  )
  const postGroups = redirectGroups.slice(0, firstPageGroupIndex)
  expect(postGroups).toHaveLength(40)
})
