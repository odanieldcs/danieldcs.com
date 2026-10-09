'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/arrow-right-icon'
import { formatDate } from '@/lib/i18n/format-date'
import {
  getHomeCopy,
  type HomeCopy,
  type HomeHighlight,
} from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_3.jpg'

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

const articleCardClassName = [
  'group flex h-full w-full flex-col rounded-lg border border-border p-7',
  'transition-colors hover:border-accent/40 hover:bg-foreground/5',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const quietCtaClassName = [
  'group inline-flex w-fit items-center gap-1.5 text-sm font-normal text-foreground/55',
  'rounded-sm transition-colors hover:text-foreground',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

function Hero({
  copy,
  language,
}: {
  copy: HomeCopy
  language: InterfaceLanguage
}) {
  return (
    <section className="grid items-center gap-inline md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-section">
      <figure className="group order-1 w-full justify-self-stretch md:order-2 md:w-9/10 md:justify-self-end">
        <div className="relative aspect-[3/3.2] overflow-hidden rounded-xl bg-foreground/6 md:aspect-3/4">
          <Image
            src={PORTRAIT_SRC}
            alt={copy.portraitAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 48rem) 24rem, 100vw"
            className="object-cover rounded-[0.875rem] object-[50%_28%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-106 motion-safe:group-hover:rotate-2 md:object-[center_30%]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-black/90 px-4 py-3 text-xs text-white/90">
            {copy.portraitCaption}
          </figcaption>
        </div>
      </figure>
      <div className="order-2 flex min-w-0 flex-col gap-content-gap md:order-1">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="break-words font-display text-display">
          {copy.headline}
        </h1>
        <div className="flex max-w-xl flex-col gap-3 text-home-intro text-foreground/80">
          {copy.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link
          href={localizePath('/about', language)}
          className={quietCtaClassName}
          data-cta="home_about"
          data-cta-location="home"
        >
          {copy.aboutCta}
          <ArrowRightIcon />
        </Link>
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
            <h2 className="font-display text-display-title">
              {highlight.label}
            </h2>
            <p className="text-note text-foreground/65">
              {highlight.description}
            </p>
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
        <p className="text-eyebrow uppercase text-label">
          {copy.recentEyebrow}
        </p>
        <h2 className="font-display text-display-section">
          {copy.recentTitle}
        </h2>
      </div>
      <ul className="grid list-none gap-content-gap md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="flex min-w-0">
            <Link
              href={localizePath(`/blog/${post.slug}`, language)}
              className={articleCardClassName}
              data-cta="post_card"
              data-cta-location="home"
              data-cta-target={post.slug}
            >
              <p className="text-xs font-semibold uppercase text-foreground/45">
                {post.tag ? (
                  <>
                    <span>{post.tag}</span>
                    <span aria-hidden="true"> · </span>
                  </>
                ) : null}
                <time dateTime={post.date}>
                  {formatDate(post.date, language, { style: 'full' })}
                </time>
              </p>
              <h3 className="mt-4 min-w-0 truncate font-display text-display-title transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-note text-foreground/65">
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

export function HomeView({ posts }: { posts: HomePostSummary[] }) {
  const { language } = useInterfaceLanguage()
  const copy = getHomeCopy(language)

  return (
    <main className="flex w-full flex-col gap-section pt-10 pb-section md:py-section">
      <Container width="page">
        <Hero copy={copy} language={language} />
      </Container>
      <section className="w-full border-y border-border">
        <Container width="page">
          <Pillars highlights={copy.highlights} />
        </Container>
      </section>
      <Container width="page">
        <RecentWriting copy={copy} posts={posts} language={language} />
      </Container>
    </main>
  )
}
