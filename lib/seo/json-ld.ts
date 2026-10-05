import type { PostFrontmatter } from '@/lib/content/schema'
import { htmlLang } from '@/lib/i18n/types'
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

type JsonLdIdRef = { '@id': string }

export type JsonLdPerson = {
  '@type': 'Person'
  '@id': string
  name: string
  url: string
  image: string
  jobTitle: string
  sameAs: readonly string[]
}

export type JsonLdWebSite = {
  '@type': 'WebSite'
  '@id': string
  name: string
  url: string
  inLanguage: string
  publisher: JsonLdIdRef
}

export type JsonLdAboutPage = {
  '@type': 'AboutPage'
  '@id': string
  url: string
  isPartOf: JsonLdIdRef
  about: JsonLdIdRef
  inLanguage: string
}

export type JsonLdBlogPosting = {
  '@type': 'BlogPosting'
  headline: string
  description: string
  datePublished: string
  dateModified: string
  author: JsonLdIdRef
  url: string
  mainEntityOfPage: string
  image: string
  inLanguage: string
}

export type JsonLdDocument = {
  '@context': 'https://schema.org'
  '@graph': ReadonlyArray<
    JsonLdPerson | JsonLdWebSite | JsonLdAboutPage | JsonLdBlogPosting
  >
}

export function buildPerson(): JsonLdPerson {
  return {
    '@type': 'Person',
    '@id': personId,
    name: personName,
    url: siteUrl,
    image: absoluteSiteUrl(personImagePath),
    jobTitle: personJobTitle,
    sameAs: personSameAs,
  }
}

export function buildWebSite(inLanguage: string): JsonLdWebSite {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: personName,
    url: siteUrl,
    inLanguage,
    publisher: { '@id': personId },
  }
}

export type BuildBlogPostingInput = {
  frontmatter: Pick<
    PostFrontmatter,
    'title' | 'description' | 'date' | 'updatedAt' | 'language'
  >
  url: string
  image: string
}

export function buildBlogPosting(
  input: BuildBlogPostingInput,
): JsonLdBlogPosting {
  const { frontmatter, url, image } = input
  const datePublished = frontmatter.date.toISOString()
  const dateModified = (frontmatter.updatedAt ?? frontmatter.date).toISOString()

  return {
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished,
    dateModified,
    author: { '@id': personId },
    url,
    mainEntityOfPage: url,
    image,
    inLanguage: htmlLang[frontmatter.language],
  }
}

export type BuildAboutPageInput = {
  url: string
  inLanguage: string
}

export function buildAboutPage(input: BuildAboutPageInput): JsonLdAboutPage {
  return {
    '@type': 'AboutPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
    inLanguage: input.inLanguage,
  }
}

export function buildAboutJsonLd(input: BuildAboutPageInput): JsonLdDocument {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPerson(), buildAboutPage(input)],
  }
}

export function buildHomeJsonLd(inLanguage: string): JsonLdDocument {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPerson(), buildWebSite(inLanguage)],
  }
}

export function buildPostJsonLd(input: BuildBlogPostingInput): JsonLdDocument {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPerson(), buildBlogPosting(input)],
  }
}

/** Safe for embedding in `<script type="application/ld+json">`. */
export function serializeJsonLd(data: JsonLdDocument): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}
