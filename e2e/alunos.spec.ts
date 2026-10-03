import { expect, test } from '@playwright/test'
import { siteUrl } from '@/lib/site'

test('/alunos lists issued certificates without indexing', async ({
  page,
  request,
}) => {
  const response = await request.get('/alunos')

  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('<title>Alunos · Daniel Castro</title>')
  expect(html).toContain('<meta name="robots" content="noindex"')
  expect(html).not.toContain('hreflang')
  expect(html).toContain(`<link rel="canonical" href="${siteUrl}/alunos"`)
  expect(html).toContain('João Vitor')
  expect(html).toContain('Jaci Bruno')
  expect(html).toContain('Nenhum aluno concluíu o treinamento até o momento.')
  expect(html).not.toContain('Santana')
  expect(html).not.toContain('André Quintino Pereira')
  expect(html).toContain('André Quintino')

  await page.goto('/alunos')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Alunos' }),
  ).toBeVisible()
  await expect(
    page.getByRole('banner').locator('a[href="/alunos"]'),
  ).toHaveCount(0)
  await expect(
    page.getByRole('contentinfo').locator('a[href="/alunos"]'),
  ).toHaveCount(0)
})

test('/alunos is absent from the sitemap and has no english route', async ({
  request,
}) => {
  expect((await request.get('/sitemap.xml')).status()).toBe(404)
  expect((await request.get('/en/alunos')).status()).toBe(404)
})
