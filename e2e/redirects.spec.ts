import { expect, test } from '@playwright/test'
import { flattenRedirects, redirectGroups } from '@/lib/redirects'

const samples = [
  {
    label: 'post',
    source: '/docker-introducao-e-primeiros-passos-para-devs{/}?',
    path: '/docker-introducao-e-primeiros-passos-para-devs',
  },
  {
    label: 'page',
    source: '/sobre{/}?',
    path: '/sobre',
  },
  {
    label: 'page number',
    source: '/page/:n',
    path: '/page/2',
  },
  {
    label: 'feed',
    source: '/feed/atom{/}?',
    path: '/feed/atom',
  },
  {
    label: 'category',
    source: '/categoria/:path*',
    path: '/categoria/javascript',
  },
  {
    label: 'tag',
    source: '/tag/:path*',
    path: '/tag/javascript',
  },
  {
    label: 'author',
    source: '/author/daniel/:path*',
    path: '/author/daniel/page/2',
  },
  {
    label: 'temporary',
    source: '/cursos{/}?',
    path: '/cursos',
  },
  {
    label: 'short link',
    source: '/telegram{/}?',
    path: '/telegram',
  },
  {
    label: 'emoji old slug',
    source: '/onde-encontrar-vagas-remota-no-exterior-usd-%f0%9f%a4%91{/}?',
    path: '/onde-encontrar-vagas-remota-no-exterior-usd-%f0%9f%a4%91',
  },
] as const

const emittedRedirects = flattenRedirects(redirectGroups)

function expectation(source: string): { status: 307 | 308; location: string } {
  const redirect = emittedRedirects.find((entry) => entry.source === source)
  if (!redirect) {
    throw new Error(`Redirect group for ${source} does not emit a destination`)
  }

  return {
    status: redirect.permanent ? 308 : 307,
    location: redirect.destination,
  }
}

for (const sample of samples) {
  test(`${sample.label}: ${sample.path} redirects in one hop`, async ({
    request,
  }) => {
    const expected = expectation(sample.source)
    const response = await request.get(sample.path, { maxRedirects: 0 })

    expect(response.status()).toBe(expected.status)
    expect(response.headers().location ?? '').toBe(expected.location)
  })
}

test('unknown legacy URL returns 404 (no catch-all to home)', async ({
  request,
}) => {
  const response = await request.get('/codigo-fonte-serverless', {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(404)
})
