'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { buildBlogListingHref, type BlogViewMode } from '@/lib/blog/pagination'
import { type BlogCopy, getBlogCopy } from '@/lib/i18n/pages'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export type BlogPostView = {
  slug: string
  title: string
  description: string
  /** ISO-8601 timestamp serialized on the server. */
  date: string
  /** Filename in public/media/posts/ when not an absolute path. */
  cover?: string
}

const COVER_WIDTH = 800
const COVER_HEIGHT = 450

const dateLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

function formatPostDate(isoDate: string, language: InterfaceLanguage): string {
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

function resolveCoverSrc(cover: string): string {
  if (cover.startsWith('/') && !cover.startsWith('//')) {
    return cover
  }

  return `/media/posts/${cover}`
}

const focusClassName = [
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const listLinkClassName = [
  'group block border-b border-border py-8 first:pt-0 last:border-b-0 last:pb-0',
  focusClassName,
].join(' ')

function ListItem({
  post,
  language,
}: {
  post: BlogPostView
  language: InterfaceLanguage
}) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className={listLinkClassName}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
          <p className="shrink-0 text-xs font-medium uppercase text-foreground/45">
            <time dateTime={post.date}>{formatPostDate(post.date, language)}</time>
          </p>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-medium transition-colors group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-2 line-clamp-1 text-sm text-foreground/60">
              {post.description}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}

function GridCard({
  post,
  language,
}: {
  post: BlogPostView
  language: InterfaceLanguage
}) {
  const coverSrc = post.cover ? resolveCoverSrc(post.cover) : undefined

  return (
    <li className="flex">
      <Link
        href={`/blog/${post.slug}`}
        className={[
          'group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border',
          'transition-colors hover:border-accent/40 hover:bg-foreground/5',
          focusClassName,
        ].join(' ')}
      >
        <div className="relative aspect-video w-full bg-foreground/[0.06]">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={post.title}
              width={COVER_WIDTH}
              height={COVER_HEIGHT}
              className="size-full object-cover"
              sizes="(min-width: 64rem) 20rem, (min-width: 40rem) 50vw, 100vw"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2 p-5">
          <p className="text-xs font-medium uppercase text-foreground/45">
            <time dateTime={post.date}>{formatPostDate(post.date, language)}</time>
          </p>
          <h2 className="font-display text-xl font-medium transition-colors group-hover:text-accent">
            {post.title}
          </h2>
        </div>
      </Link>
    </li>
  )
}

const viewIconProps = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  className: 'size-4',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function ListIcon() {
  return (
    <svg {...viewIconProps}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg {...viewIconProps}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  )
}

function ViewSwitch({
  copy,
  view,
  page,
}: {
  copy: BlogCopy
  view: BlogViewMode
  page: number
}) {
  const options: Array<{
    id: BlogViewMode
    label: string
    icon: ReactNode
  }> = [
    { id: 'list', label: copy.viewList, icon: <ListIcon /> },
    { id: 'grid', label: copy.viewGrid, icon: <GridIcon /> },
  ]

  return (
    <div
      role="group"
      aria-label={copy.viewLabel}
      className="inline-flex w-fit rounded-full border border-border bg-background p-0.5"
    >
      {options.map((option) => {
        const pressed = view === option.id
        const href = buildBlogListingHref({ page, view: option.id })

        return (
          <Link
            key={option.id}
            href={href}
            aria-pressed={pressed}
            aria-label={option.label}
            className={[
              'inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200',
              focusClassName,
              pressed
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground/45 hover:text-foreground',
            ].join(' ')}
          >
            {option.icon}
          </Link>
        )
      })}
    </div>
  )
}

function Pagination({
  copy,
  view,
  page,
  pageCount,
}: {
  copy: BlogCopy
  view: BlogViewMode
  page: number
  pageCount: number
}) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label={copy.paginationLabel}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={buildBlogListingHref({ page: page - 1, view })}
          className={[
            'rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent/40',
            focusClassName,
          ].join(' ')}
        >
          {copy.paginationPrevious}
        </Link>
      ) : null}
      <ul className="flex list-none flex-wrap items-center gap-1">
        {pages.map((pageNumber) => {
          const current = pageNumber === page

          return (
            <li key={pageNumber}>
              <Link
                href={buildBlogListingHref({ page: pageNumber, view })}
                aria-current={current ? 'page' : undefined}
                className={[
                  'inline-flex min-w-9 items-center justify-center rounded-md border px-2 py-1.5 text-sm transition-colors',
                  focusClassName,
                  current
                    ? 'border-foreground/20 bg-foreground/10 text-foreground'
                    : 'border-border hover:border-accent/40',
                ].join(' ')}
              >
                {pageNumber}
              </Link>
            </li>
          )
        })}
      </ul>
      {page < pageCount ? (
        <Link
          href={buildBlogListingHref({ page: page + 1, view })}
          className={[
            'rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent/40',
            focusClassName,
          ].join(' ')}
        >
          {copy.paginationNext}
        </Link>
      ) : null}
    </nav>
  )
}

export function BlogView({
  posts,
  view,
  page,
  pageCount,
}: {
  posts: BlogPostView[]
  view: BlogViewMode
  page: number
  pageCount: number
}) {
  const { language } = useInterfaceLanguage()
  const copy = getBlogCopy(language)
  const hasPosts = posts.length > 0

  return (
    <main>
      <Container width="page" className="pb-10 pt-10 sm:pb-12 sm:pt-16">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">{copy.title}</h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          {copy.intro}
        </p>
        {!hasPosts ? (
          <p className="mt-10 text-base text-foreground/60">{copy.empty}</p>
        ) : null}
      </Container>
      {hasPosts ? (
        <div className="relative border-t border-border">
          <Container width="page" className="h-0">
            <div className="relative h-0">
              <div className="absolute right-0 top-0 z-10 -translate-y-1/2">
                <ViewSwitch copy={copy} view={view} page={page} />
              </div>
            </div>
          </Container>
          <Container width="page" className="pb-16 pt-10 sm:pb-20 sm:pt-12">
            {view === 'list' ? (
              <ul className="list-none">
                {posts.map((post) => (
                  <ListItem key={post.slug} post={post} language={language} />
                ))}
              </ul>
            ) : (
              <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <GridCard key={post.slug} post={post} language={language} />
                ))}
              </ul>
            )}
            {pageCount > 1 ? (
              <Pagination
                copy={copy}
                view={view}
                page={page}
                pageCount={pageCount}
              />
            ) : null}
          </Container>
        </div>
      ) : null}
    </main>
  )
}
