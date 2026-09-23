'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@/components/arrow-right-icon'
import { ButtonLink } from '@/components/button'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { type HomeCopy, type HomeHighlight, getHomeCopy } from '@/lib/i18n/pages'
import type { InterfaceLanguage } from '@/lib/i18n/types'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_2.jpg'

export type HomePostSummary = {
  slug: string
  title: string
  /** ISO-8601 timestamp serialized on the server. */
  date: string
  description: string
  language: 'pt' | 'en'
  /** First frontmatter tag. Omitted when the post has none. */
  tag?: string
}

const dateLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

function formatPostDate(isoDate: string, language: InterfaceLanguage): string {
  // Frontmatter dates are UTC midnight. Format in UTC so the calendar day
  // does not shift in timezones behind UTC. Shape: "21 set. 2026".
  const parts = new Intl.DateTimeFormat(dateLocale[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(isoDate))
  const day = parts.find((part) => part.type === 'day')?.value ?? ''
  const month = parts.find((part) => part.type === 'month')?.value ?? ''
  const year = parts.find((part) => part.type === 'year')?.value ?? ''
  const monthLabel = month.endsWith('.') ? month : `${month}.`

  return `${day} ${monthLabel} ${year}`
}

const articleCardClassName = [
  'group flex h-full w-full flex-col rounded-lg border border-border p-7',
  'transition-colors hover:border-accent/40 hover:bg-foreground/5',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const trailCtaClassName = [
  'h-12 gap-2 px-6! text-sm! font-semibold!',
  'border-trail-foreground/30! text-trail-foreground!',
  'hover:border-trail-foreground/70! hover:bg-transparent!',
].join(' ')

function Hero({ copy }: { copy: HomeCopy }) {
  return (
    <section className="grid items-center gap-content-gap md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-section">
      <figure className="group relative order-1 aspect-[3/4] w-[90%] justify-self-center overflow-hidden rounded-lg md:order-2 md:justify-self-end">
        <Image
          src={PORTRAIT_SRC}
          alt={copy.portraitAlt}
          fill
          priority
          sizes="(min-width: 48rem) 24rem, 90vw"
          className="object-cover object-[center_30%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.06] motion-safe:group-hover:rotate-2"
        />
      </figure>
      <div className="order-2 flex min-w-0 flex-col gap-content-gap md:order-1">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="font-display text-display">{copy.headline}</h1>
        <p className="max-w-xl text-home-intro text-foreground/70">{copy.intro}</p>
      </div>
    </section>
  )
}

function Pillars({ highlights }: { highlights: HomeHighlight[] }) {
  return (
    <ul className="grid list-none md:grid-cols-3">
      {highlights.map((highlight, index) => {
        const isLast = index === highlights.length - 1

        return (
          <li
            key={highlight.label}
            className={[
              'flex flex-col gap-inline border-border py-12',
              index === 0 ? 'md:pr-7' : 'md:pl-7',
              !isLast && index !== 0 ? 'md:pr-7' : '',
              !isLast ? 'border-b md:border-r md:border-b-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="font-display font-normal text-sm text-label">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display text-display-title">{highlight.label}</h2>
            <p className="text-note text-foreground/65">{highlight.description}</p>
          </li>
        )
      })}
    </ul>
  )
}

function RecentWriting({
  copy,
  posts,
  language,
}: {
  copy: HomeCopy
  posts: HomePostSummary[]
  language: InterfaceLanguage
}) {
  return (
    <section className="flex flex-col gap-content-gap">
      <div className="flex flex-col gap-inline">
        <p className="text-eyebrow uppercase text-label">{copy.recentEyebrow}</p>
        <h2 className="font-display text-display-section">{copy.recentTitle}</h2>
      </div>
      <ul className="grid list-none gap-content-gap md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="flex">
            <Link href={`/blog/${post.slug}`} className={articleCardClassName}>
              <p className="text-xs font-medium uppercase text-foreground/45">
                {post.tag ? (
                  <>
                    <span>{post.tag}</span>
                    <span aria-hidden="true"> · </span>
                  </>
                ) : null}
                <time dateTime={post.date}>
                  {formatPostDate(post.date, language)}
                </time>
              </p>
              <h3 className="mt-4 font-display text-display-title transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-3 text-note text-foreground/65">
                {post.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent">
                {copy.readArticle}
                <ArrowRightIcon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TrailBand({ copy }: { copy: HomeCopy }) {
  return (
    <div className="flex max-w-2xl flex-col items-start gap-content-gap">
      <p className="text-eyebrow uppercase text-trail-foreground/70">
        {copy.trilhaEyebrow}
      </p>
      <h2 className="font-display text-display-band">{copy.trilhaHeading}</h2>
      <p className="max-w-xl text-lead text-trail-foreground/80">
        {copy.trilhaDescription}
      </p>
      <ButtonLink
        href="/trilha"
        variant="outline"
        shape="pill"
        className={trailCtaClassName}
      >
        {copy.trilhaCta}
        <ArrowRightIcon />
      </ButtonLink>
    </div>
  )
}

export function HomeView({ posts }: { posts: HomePostSummary[] }) {
  const { language } = useInterfaceLanguage()
  const copy = getHomeCopy(language)

  return (
    <main className="flex w-full flex-col gap-section py-section">
      <Container width="page">
        <Hero copy={copy} />
      </Container>
      <section className="w-full border-y border-border">
        <Container width="page">
          <Pillars highlights={copy.highlights} />
        </Container>
      </section>
      <Container width="page">
        <RecentWriting copy={copy} posts={posts} language={language} />
      </Container>
      <section className="w-full bg-trail py-section text-trail-foreground">
        <Container width="page">
          <TrailBand copy={copy} />
        </Container>
      </section>
    </main>
  )
}
