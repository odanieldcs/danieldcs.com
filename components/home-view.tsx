'use client'

import Link from 'next/link'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { getHomeCopy } from '@/lib/i18n/pages'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { linkClassName } from '@/lib/link-styles'

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
      <div className="flex max-w-content flex-col gap-section">
        <section className="flex flex-col gap-content-gap">
          <div className="flex flex-col gap-inline">
            <p className="text-caption text-muted">{copy.eyebrow}</p>
            <h1 className="text-h1 font-semibold">Daniel Castro</h1>
          </div>
          <p className="text-body text-muted">{copy.intro}</p>
        </section>

        <section className="flex flex-col gap-content-gap">
          <h2 className="text-h2 font-semibold">{copy.recentTitle}</h2>
          <ul className="flex list-none flex-col gap-content-gap">
            {posts.map((post) => (
              <li key={post.slug} className="flex flex-col gap-inline">
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
                <p className="text-body text-muted">{post.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col items-start gap-content-gap">
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
