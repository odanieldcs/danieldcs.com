import type { StaticImageData } from 'next/image'
import { expect, test } from 'vitest'
import { getAllPosts } from '@/lib/content/posts'
import {
  absoluteSiteUrl,
  personId,
  personImagePath,
  personJobTitle,
  personName,
  personSameAs,
  siteUrl,
  websiteId,
} from '@/lib/site'
import {
  buildBlogPosting,
  buildPerson,
  buildWebSite,
  serializeJsonLd,
} from './json-ld'
import { getHomeJsonLd, getPostJsonLd } from './page-json-ld'
import { buildPostMetadata } from './post-metadata'
import { absolutePostShareImageUrl, resolvePostShareImage } from './share-image'

const fallbackImage: StaticImageData = {
  src: '/_next/static/media/opengraph-image.default.png',
  width: 1200,
  height: 630,
}

function graphNode(
  data: { '@graph': ReadonlyArray<Record<string, unknown>> },
  type: string,
): Record<string, unknown> | undefined {
  return data['@graph'].find((node) => node['@type'] === type)
}

test('buildPerson exposes stable ids and profile fields', () => {
  const person = buildPerson()

  expect(person['@id']).toBe(personId)
  expect(person.name).toBe(personName)
  expect(person.url).toBe(siteUrl)
  expect(person.image).toBe(absoluteSiteUrl(personImagePath))
  expect(person.jobTitle).toBe(personJobTitle)
  expect(person.sameAs).toEqual([...personSameAs])
})

test('buildWebSite references Person only by @id', () => {
  const website = buildWebSite('pt-BR')

  expect(website['@id']).toBe(websiteId)
  expect(website.inLanguage).toBe('pt-BR')
  expect(website.publisher).toEqual({ '@id': personId })
})

test('english home keeps stable @id values and sets WebSite.inLanguage', () => {
  const data = getHomeJsonLd('en')
  const website = graphNode(data, 'WebSite')

  expect(graphNode(data, 'Person')?.['@id']).toBe(personId)
  expect(website?.['@id']).toBe(websiteId)
  expect(website?.inLanguage).toBe('en')
})

test('buildBlogPosting uses author @id and canonical url fields', () => {
  const url = absoluteSiteUrl('/blog/exemplo')
  const posting = buildBlogPosting({
    frontmatter: {
      title: 'Título',
      description: 'Descrição',
      date: new Date('2024-02-03T00:00:00.000Z'),
      language: 'pt',
    },
    url,
    image: absoluteSiteUrl('/media/posts/capa.png'),
  })

  expect(posting.author).toEqual({ '@id': personId })
  expect(posting.url).toBe(url)
  expect(posting.mainEntityOfPage).toBe(url)
  expect(posting.datePublished).toBe('2024-02-03T00:00:00.000Z')
  expect(posting.dateModified).toBe('2024-02-03T00:00:00.000Z')
  expect(posting.inLanguage).toBe('pt')
})

test('dateModified falls back to datePublished when updatedAt is absent', () => {
  const posting = buildBlogPosting({
    frontmatter: {
      title: 'Título',
      description: 'Descrição',
      date: new Date('2024-02-03T00:00:00.000Z'),
      updatedAt: new Date('2024-05-06T00:00:00.000Z'),
      language: 'en',
    },
    url: absoluteSiteUrl('/blog/exemplo'),
    image: absoluteSiteUrl('/media/posts/capa.png'),
  })

  expect(posting.dateModified).toBe('2024-05-06T00:00:00.000Z')
})

test('serializeJsonLd escapes closing script tags', () => {
  const serialized = serializeJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      buildPerson(),
      buildBlogPosting({
        frontmatter: {
          title: '</script>',
          description: 'safe',
          date: new Date('2024-01-01T00:00:00.000Z'),
          language: 'pt',
        },
        url: absoluteSiteUrl('/blog/x'),
        image: absoluteSiteUrl('/media/x.png'),
      }),
    ],
  })

  expect(serialized).toContain('\\u003c/script>')
  expect(serialized).not.toContain('</script>')
})

test('post JSON-LD image matches Open Graph share image rule', () => {
  const post = getAllPosts()[0]
  expect(post).toBeDefined()
  if (!post) {
    return
  }

  const ogImage = buildPostMetadata(post, fallbackImage).openGraph as {
    images?: ReadonlyArray<{ url: string }>
  }
  const shareImage = resolvePostShareImage(
    post.frontmatter.cover,
    fallbackImage,
  )
  const posting = graphNode(getPostJsonLd(post), 'BlogPosting')

  expect(shareImage).toEqual(ogImage.images?.[0])
  expect(posting?.image).toBe(absolutePostShareImageUrl(shareImage))
})

test('post JSON-LD url is the PT canonical', () => {
  const post = getAllPosts()[0]
  expect(post).toBeDefined()
  if (!post) {
    return
  }

  const posting = graphNode(getPostJsonLd(post), 'BlogPosting')
  expect(posting?.url).toBe(absoluteSiteUrl(`/blog/${post.slug}`))
})
