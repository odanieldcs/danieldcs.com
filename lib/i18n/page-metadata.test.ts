import { expect, test } from 'vitest'
import { getAlternates } from '@/lib/i18n/alternates'
import { getPageSeo } from '@/lib/i18n/pages'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'
import {
  getBlogListingMetadata,
  getLocalizedPageMetadata,
} from './page-metadata'

const indexablePages = [
  'home',
  'blog',
  'community',
  'about',
  'privacy',
] as const

const pathname = {
  home: { pt: '/', en: '/en' },
  blog: { pt: '/blog', en: '/en/blog' },
  community: { pt: '/community', en: '/en/community' },
  about: { pt: '/about', en: '/en/about' },
  privacy: { pt: '/privacy', en: '/en/privacy' },
} as const

function languagesFor(page: keyof typeof pathname) {
  return {
    [htmlLang.pt]: pathname[page].pt,
    [htmlLang.en]: pathname[page].en,
    'x-default': pathname[page].pt,
  }
}

test.each(indexablePages)(
  '%s has a canonical and reciprocal hreflang',
  (page) => {
    for (const language of ['pt', 'en'] as const) {
      expect(getLocalizedPageMetadata(page, language).alternates).toEqual({
        canonical: pathname[page][language],
        languages: languagesFor(page),
      })
    }
  },
)

test('home keeps the default document title and localizes the description', () => {
  const pt = getLocalizedPageMetadata('home', 'pt')
  const en = getLocalizedPageMetadata('home', 'en')

  expect(pt.title).toBeUndefined()
  expect(en.title).toBeUndefined()
  expect(pt.description).toBe(getPageSeo('home', 'pt').seoDescription)
  expect(en.description).toBe(
    'Building software products and running long distances.',
  )
  expect(en.openGraph).toMatchObject({
    title: 'Daniel Castro',
    locale: 'en_US',
    alternateLocale: 'pt_BR',
    url: '/en',
  })
})

test.each([
  ['blog', 'Blog', 'Writing'],
  ['community', 'Comunidade', 'Community'],
  ['about', 'Sobre', 'About'],
] as const)('%s uses the localized SEO title', (page, ptTitle, enTitle) => {
  expect(getLocalizedPageMetadata(page, 'pt')).toMatchObject({
    title: ptTitle,
    description: getPageSeo(page, 'pt').seoDescription,
    openGraph: { title: ptTitle, locale: 'pt_BR', alternateLocale: 'en_US' },
  })
  expect(getLocalizedPageMetadata(page, 'en')).toMatchObject({
    title: enTitle,
    description: getPageSeo(page, 'en').seoDescription,
    openGraph: { title: enTitle, locale: 'en_US', alternateLocale: 'pt_BR' },
  })
  expect(getPageSeo(page, 'en').seoDescription).not.toBe(
    getPageSeo(page, 'pt').seoDescription,
  )
})

test('privacy uses localized SEO titles and descriptions', () => {
  expect(getLocalizedPageMetadata('privacy', 'pt')).toMatchObject({
    title: 'Política de Privacidade',
    description:
      'Como o danieldcs.com trata dados pessoais, cookies e contato.',
    openGraph: {
      title: 'Política de Privacidade',
      url: '/privacy',
    },
  })
  expect(getLocalizedPageMetadata('privacy', 'en')).toMatchObject({
    title: 'Privacy Policy',
    description: 'How danieldcs.com handles personal data, cookies, and contact.',
    openGraph: { title: 'Privacy Policy', url: '/en/privacy' },
  })
})

test('trilha stays noindex and emits no hreflang', () => {
  for (const language of [
    'pt',
    'en',
  ] as const satisfies readonly InterfaceLanguage[]) {
    const metadata = getLocalizedPageMetadata('trilha', language)

    expect(metadata.alternates).toEqual({
      canonical: language === 'pt' ? '/trilha' : '/en/trilha',
    })
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.openGraph).toMatchObject({
      locale: language === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: language === 'pt' ? 'en_US' : 'pt_BR',
    })
  }

  expect(getLocalizedPageMetadata('trilha', 'en').description).toBe(
    'Guided by someone who applies it every day, in software engineering.',
  )
})

test('blog page 1 and grid view share the path canonical', () => {
  const listing = getAlternates('/blog')

  expect(getBlogListingMetadata({}, 'pt').alternates).toEqual(listing)
  expect(getBlogListingMetadata({ page: '1' }, 'pt').alternates).toEqual(
    listing,
  )
  expect(getBlogListingMetadata({ view: 'grid' }, 'pt').alternates).toEqual(
    listing,
  )
  expect(
    getBlogListingMetadata({ page: '1', view: 'grid' }, 'en').alternates,
  ).toEqual(getAlternates('/en/blog'))
})

test('blog page above 1 keeps page on the canonical and on hreflang', () => {
  const languages = {
    [htmlLang.pt]: '/blog?page=2',
    [htmlLang.en]: '/en/blog?page=2',
    'x-default': '/blog?page=2',
  }

  expect(getBlogListingMetadata({ page: '2' }, 'pt')).toMatchObject({
    alternates: { canonical: '/blog?page=2', languages },
    openGraph: { url: '/blog?page=2' },
  })
  expect(getBlogListingMetadata({ page: '2' }, 'en')).toMatchObject({
    alternates: { canonical: '/en/blog?page=2', languages },
    openGraph: { url: '/en/blog?page=2' },
  })
  expect(
    getBlogListingMetadata({ page: '2', view: 'grid' }, 'pt').alternates,
  ).toEqual(getBlogListingMetadata({ page: '2' }, 'pt').alternates)
})

test('blog ignores a non-positive page and still drops view', () => {
  const listing = getBlogListingMetadata({}, 'pt').alternates

  expect(
    getBlogListingMetadata({ page: '0', view: 'grid' }, 'pt').alternates,
  ).toEqual(listing)
  expect(getBlogListingMetadata({ page: 'nope' }, 'en').alternates).toEqual(
    getAlternates('/en/blog'),
  )
})
