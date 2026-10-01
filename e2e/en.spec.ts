import { expect, test } from '@playwright/test'
import { BLOG_PAGE_SIZE } from '@/lib/blog/pagination'
import { collectConsoleErrors } from './helpers/console'
import { getBlogPostCount, getNewestBlogPost } from './helpers/posts'

const total = getBlogPostCount('en routes')
const newestPost = getNewestBlogPost('en routes')

const enRoutes = [
  { path: '/en', heading: 'Creating and sharing, from dev to dev.' },
  { path: '/en/blog', heading: 'Learnings and ideas.' },
  { path: '/en/community', heading: 'Talks, workshops, and gatherings.' },
  { path: '/en/about', heading: 'Between code, product and people.' },
  {
    path: '/en/trilha',
    heading: 'Guided by someone who applies it every day.',
  },
]

for (const { path, heading } of enRoutes) {
  test(`${path} is served with lang="en" and English UI`, async ({
    page,
    request,
  }) => {
    const response = await request.get(path)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toContain('<html lang="en"')

    const consoleErrors = collectConsoleErrors(page)
    await page.goto(path)

    await expect(
      page.getByRole('main').getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeVisible()
    await expect(
      page.getByRole('banner').getByRole('link', {
        name: 'Mudar para português',
      }),
    ).toBeVisible()
    expect(consoleErrors).toEqual([])
  })
}

test('/en/trilha stays out of the index', async ({ request }) => {
  const html = await (await request.get('/en/trilha')).text()
  expect(html).toContain('<meta name="robots" content="noindex, nofollow"')
})

test('header navigation keeps the visitor under /en', async ({ page }) => {
  await page.goto('/en')

  const header = page.getByRole('banner')
  await expect(
    header.getByRole('link', { name: 'Daniel Castro' }),
  ).toHaveAttribute('href', '/en')

  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  for (const href of await nav
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
    expect(href).toMatch(/^\/en\//)
  }

  await nav.getByRole('link', { name: 'Writing' }).click()
  await expect(page).toHaveURL('/en/blog')
  await nav.getByRole('link', { name: 'Community' }).click()
  await expect(page).toHaveURL('/en/community')
  await nav.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL('/en/about')

  const footerInternalLinks = page
    .getByRole('contentinfo')
    .locator('a[href^="/"]:not([href^="/en"])')
  await expect(footerInternalLinks).toHaveCount(0)
})

test('/en home links recent posts to the PT article', async ({ page }) => {
  await page.goto('/en')

  await expect(
    page.getByRole('main').getByRole('link', { name: 'Learn more' }),
  ).toHaveAttribute('href', '/en/about')
  const postLinks = page.getByRole('main').locator('a[href^="/blog/"]')
  await expect(postLinks).not.toHaveCount(0)
  await expect(
    page.getByRole('main').locator('a[href^="/en/blog/"]'),
  ).toHaveCount(0)
})

test('/en/blog opens posts at /blog/[slug]', async ({ page }) => {
  await page.goto('/en/blog')

  await page.getByRole('link', { name: newestPost.frontmatter.title }).click()
  await expect(page).toHaveURL(`/blog/${newestPost.slug}`)
})

test('/en/blog view switch stays under /en/blog', async ({ page }) => {
  await page.goto('/en/blog')

  await page.getByRole('link', { name: 'Grid', exact: true }).click()
  await expect(page).toHaveURL('/en/blog?view=grid')
  await page.getByRole('link', { name: 'List', exact: true }).click()
  await expect(page).toHaveURL('/en/blog')
})

test('/en/blog paginates under /en/blog', async ({ page }) => {
  test.skip(
    total <= BLOG_PAGE_SIZE,
    'pagination requires more posts than one page',
  )

  await page.goto('/en/blog?view=grid')
  await page
    .getByRole('navigation', { name: 'Pagination' })
    .getByRole('link', { name: '2', exact: true })
    .click()
  await expect(page).toHaveURL('/en/blog?view=grid&page=2')
})

test('/en/blog clamps an out-of-range page within /en/blog', async ({
  page,
}) => {
  await page.goto('/en/blog?page=999')
  await expect(page).toHaveURL(/\/en\/blog(\?page=\d+)?$/)
})
