import { afterEach, expect, test, vi } from 'vitest'
import { absoluteSiteUrl } from '@/lib/site'
import { buildRobots } from './robots'

afterEach(() => {
  vi.unstubAllEnvs()
})

test('production allows crawling and points to the sitemap', () => {
  vi.stubEnv('VERCEL_ENV', 'production')

  expect(buildRobots()).toEqual({
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
  })
})

test.each(['preview', 'development'] as const)(
  '%s disallows crawling and omits the sitemap',
  (vercelEnv) => {
    vi.stubEnv('VERCEL_ENV', vercelEnv)

    expect(buildRobots()).toEqual({
      rules: { userAgent: '*', disallow: '/' },
    })
  },
)
