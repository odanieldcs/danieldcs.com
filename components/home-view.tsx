'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { getHomeCopy } from '@/lib/i18n/pages'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { linkClassName } from '@/lib/link-styles'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_2.jpg'

export type HomePostSummary = {
  slug: string
  title: string
  /** ISO-8601 timestamp serialized on the server. */
  date: string
  description: string
  language: 'pt' | 'en'
}

// Mirrors `baseClass` + `variantClass.primary` in components/button.tsx.
const primaryCtaClassName = [
  'inline-flex min-h-11 items-center justify-center rounded-md',
  'text-body font-medium',
  'transition-colors',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'bg-foreground px-4 text-background',
  'hover:bg-foreground/90',
].join(' ')

const dateLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

function formatPostDate(isoDate: string, language: InterfaceLanguage): string {
  // Frontmatter dates are UTC midnight. Format in UTC so the calendar day
  // does not shift in timezones behind UTC.
  return new Intl.DateTimeFormat(dateLocale[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

export function HomeView({ posts }: { posts: HomePostSummary[] }) {
  const { language } = useInterfaceLanguage()
  const copy = getHomeCopy(language)

  return (
    <Container as="main" width="page" className="py-section">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-section">
        <section className="grid items-center gap-content-gap md:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-content-gap">
            <div className="flex flex-col gap-inline">
              <h1 className="font-semibold text-[2.5rem] leading-[1.1] md:text-[3rem] md:leading-[1.05]">
                Daniel Castro
              </h1>
              <p className="text-h4 font-medium text-muted">{copy.eyebrow}</p>
            </div>
            <p className="text-body">{copy.intro}</p>
          </div>
          <div className="relative size-72 overflow-hidden rounded-2xl md:size-80">
            <Image
              src={PORTRAIT_SRC}
              alt={copy.portraitAlt}
              fill
              priority
              sizes="(min-width: 48rem) 20rem, 18rem"
              className="object-cover object-[center_30%]"
            />
          </div>
        </section>

        <ul className="flex list-none flex-col gap-inline md:flex-row md:gap-content-gap">
          {copy.highlights.map((highlight) => (
            <li
              key={highlight.label}
              className="flex min-w-0 flex-1 flex-col gap-1"
            >
              <p className="text-caption font-medium">{highlight.label}</p>
              <p className="text-body text-muted">{highlight.description}</p>
            </li>
          ))}
        </ul>

        <section className="flex flex-col gap-content-gap">
          <h2 className="text-h2 font-semibold">{copy.recentTitle}</h2>
          <ul className="flex list-none flex-col">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex flex-col gap-inline border-b border-border py-content-gap first:pt-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-content-gap gap-y-inline">
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`${linkClassName} text-body`}
                  >
                    {post.title}
                  </Link>
                  <time
                    className="text-caption text-muted"
                    dateTime={post.date}
                  >
                    {formatPostDate(post.date, language)}
                  </time>
                </div>
                <p className="truncate text-body text-muted">
                  {post.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-content-gap rounded-xl border border-border p-content-gap">
          <h2 className="text-h2 font-semibold">{copy.trilhaHeading}</h2>
          <p className="text-body text-muted">{copy.trilhaDescription}</p>
          <Link href="/trilha" className={primaryCtaClassName}>
            {copy.trilhaCta}
          </Link>
        </section>
      </div>
    </Container>
  )
}
