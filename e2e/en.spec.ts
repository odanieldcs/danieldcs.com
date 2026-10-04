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
  { path: '/en/privacy', heading: 'Privacy Policy' },
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

test('/en home links recent posts under /en/blog', async ({ page }) => {
  await page.goto('/en')

  await expect(
    page.getByRole('main').getByRole('link', { name: 'Learn more' }),
  ).toHaveAttribute('href', '/en/about')
  await expect(
    page.getByRole('main').locator('a[href^="/en/blog/"]'),
  ).not.toHaveCount(0)
  await expect(page.getByRole('main').locator('a[href^="/blog/"]')).toHaveCount(
    0,
  )
})

test('/en/blog opens posts at /en/blog/[slug] with the EN shell', async ({
  page,
  request,
}) => {
  const html = await (await request.get(`/en/blog/${newestPost.slug}`)).text()
  expect(html).toContain('<html lang="en"')

  await page.goto('/en/blog')
  await page.getByRole('link', { name: newestPost.frontmatter.title }).click()
  await expect(page).toHaveURL(`/en/blog/${newestPost.slug}`)
  await expect(
    page.getByRole('heading', { level: 1, name: newestPost.frontmatter.title }),
  ).toBeVisible()
  const note = page.getByRole('note')
  await expect(note).toContainText('Content available only in Portuguese.')
  const backLink = note.getByRole('link', { name: 'Read in Portuguese' })
  await expect(backLink).toHaveAttribute('href', `/blog/${newestPost.slug}`)
  await backLink.click()
  await expect(page).toHaveURL(`/blog/${newestPost.slug}`)
  await expect(page.getByRole('note')).toHaveCount(0)
})

test('a PT post read in PT shows no language notice', async ({ page }) => {
  await page.goto(`/blog/${newestPost.slug}`)

  await expect(
    page.getByRole('heading', { level: 1, name: newestPost.frontmatter.title }),
  ).toBeVisible()
  await expect(page.getByRole('note')).toHaveCount(0)
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

const languageSwitchCases = [
  { from: '/about', label: 'Switch to English', to: '/en/about' },
  { from: '/en/about', label: 'Mudar para português', to: '/about' },
  { from: '/en/blog', label: 'Mudar para português', to: '/blog' },
  { from: '/community', label: 'Switch to English', to: '/en/community' },
  {
    from: `/blog/${newestPost.slug}`,
    label: 'Switch to English',
    to: `/en/blog/${newestPost.slug}`,
  },
  {
    from: `/en/blog/${newestPost.slug}`,
    label: 'Mudar para português',
    to: `/blog/${newestPost.slug}`,
  },
  {
    from: '/blog?view=grid',
    label: 'Switch to English',
    to: '/en/blog?view=grid',
  },
]

for (const { from, label, to } of languageSwitchCases) {
  test(`language switch on ${from} opens ${to}`, async ({ page }) => {
    await page.goto(from)

    await page.getByRole('banner').getByRole('link', { name: label }).click()
    await expect(page).toHaveURL(to)
  })
}
