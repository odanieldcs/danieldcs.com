import { expect, test } from '@playwright/test'

const unmatchedPaths = [
  '/qualquer',
  '/en/qualquer',
  '/blog/slug-inexistente',
  '/en/blog/slug-inexistente',
]

for (const path of unmatchedPaths) {
  test(`${path} renders the global 404 inside the PT site shell`, async ({
    page,
    request,
  }) => {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
    const html = await response.text()
    expect(html).toContain('<html lang="pt-BR"')
    expect(html).toContain('<meta name="robots" content="noindex"')

    await page.goto(path)

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(
      page
        .getByRole('main')
        .getByRole('heading', { level: 1, name: 'Página não encontrada.' }),
    ).toBeVisible()
    await expect(
      page
        .getByRole('main')
        .getByRole('link', { name: 'Voltar para o início' }),
    ).toHaveAttribute('href', '/')
    expect(
      await page.evaluate(() => getComputedStyle(document.body).fontFamily),
    ).toContain('Inter')
  })
}
