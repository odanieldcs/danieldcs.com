import { expect, test } from '@playwright/test'

type RedirectCase = {
  label: string
  path: string
  expectedStatus: 308 | 307
  expectedLocation: string | RegExp
}

const cases: RedirectCase[] = [
  {
    label: 'post',
    path: '/docker-introducao-e-primeiros-passos-para-devs',
    expectedStatus: 308,
    expectedLocation: '/blog/docker-introducao-e-primeiros-passos-para-devs',
  },
  {
    label: 'page',
    path: '/sobre',
    expectedStatus: 308,
    expectedLocation: '/about',
  },
  {
    label: 'wp archive',
    path: '/categoria/javascript',
    expectedStatus: 308,
    expectedLocation: '/blog',
  },
  {
    label: 'temporary',
    path: '/cursos',
    expectedStatus: 307,
    expectedLocation: '/about?origin=cursos',
  },
  {
    label: 'short link',
    path: '/telegram',
    expectedStatus: 307,
    expectedLocation: 'https://t.me/odanieldcs',
  },
  {
    label: 'emoji old slug',
    path: '/onde-encontrar-vagas-remota-no-exterior-usd-%f0%9f%a4%91',
    expectedStatus: 308,
    expectedLocation: '/blog/onde-encontrar-vagas-remota-no-exterior-usd-eur',
  },
]

for (const redirectCase of cases) {
  test(`${redirectCase.label}: ${redirectCase.path} redirects in one hop`, async ({
    request,
  }) => {
    const response = await request.get(redirectCase.path, {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(redirectCase.expectedStatus)
    const location = response.headers().location ?? ''
    if (redirectCase.expectedLocation instanceof RegExp) {
      expect(location).toMatch(redirectCase.expectedLocation)
    } else {
      expect(location).toBe(redirectCase.expectedLocation)
    }
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
