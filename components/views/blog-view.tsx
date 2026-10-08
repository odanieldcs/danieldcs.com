'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { Container } from '@/components/layout/container'
import {
  SlidingHighlight,
  useSlidingHighlight,
} from '@/components/layout/sliding-highlight'
import { GridViewIcon, ListViewIcon } from '@/components/views/view-mode-icons'
import { type BlogViewMode, buildBlogListingHref } from '@/lib/blog/pagination'
import { resolveCoverSrc } from '@/lib/content/cover'
import { formatDate } from '@/lib/i18n/format-date'
import { type BlogCopy, getBlogCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
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

const focusClassName = [
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const interactiveSurfaceClassName = [
  'rounded-lg border border-border',
  'transition-colors duration-200',
  'hover:border-accent/40 hover:bg-foreground/5',
].join(' ')

const viewSwitchTooltipClassName = [
  'pointer-events-none absolute top-full left-1/2 z-20 mt-1.5 -translate-x-1/2',
  'whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-caption text-foreground shadow-sm',
  'translate-y-0.5 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
  'group-hover/viewtip:translate-y-0 group-hover/viewtip:opacity-100',
  'group-focus-visible/viewtip:translate-y-0 group-focus-visible/viewtip:opacity-100',
].join(' ')

const highlightControlClassName = [
  'relative z-10 inline-flex items-center justify-center rounded-md',
  'transition-colors duration-200 hover:text-foreground',
  focusClassName,
].join(' ')

function highlightControlToneClassName(active: boolean) {
  return active ? 'text-foreground' : 'text-foreground/70'
}

const listLinkClassName = [
  'group flex items-baseline justify-between gap-4 p-4 sm:gap-6 sm:p-5',
  interactiveSurfaceClassName,
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
      <Link
        href={localizePath(`/blog/${post.slug}`, language)}
        className={listLinkClassName}
        data-cta="post_card"
        data-cta-location="blog"
        data-cta-target={post.slug}
      >
        <h2 className="min-w-0 font-display text-base font-medium transition-colors group-hover:text-accent sm:text-xl">
          {post.title}
        </h2>
        <time
          dateTime={post.date}
          className="shrink-0 text-xs font-medium uppercase tabular-nums text-foreground/45"
        >
          {formatDate(post.date, language, { style: 'monthYear' })}
        </time>
      </Link>
    </li>
  )
}

const postDateMetadataClassName = 'sr-only'

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
        href={localizePath(`/blog/${post.slug}`, language)}
        className={[
          'group flex h-full w-full flex-col overflow-hidden',
          interactiveSurfaceClassName,
          focusClassName,
        ].join(' ')}
        data-cta="post_card"
        data-cta-location="blog"
        data-cta-target={post.slug}
      >
        <div className="relative aspect-video w-full bg-foreground/6">
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
          <time dateTime={post.date} className={postDateMetadataClassName}>
            {post.date}
          </time>
          <h2 className="font-display text-base font-medium transition-colors group-hover:text-accent">
            {post.title}
          </h2>
        </div>
      </Link>
    </li>
  )
}

function ViewSwitch({
  copy,
  view,
  page,
  language,
}: {
  copy: BlogCopy
  view: BlogViewMode
  page: number
  language: InterfaceLanguage
}) {
  const [pendingView, setPendingView] = useState<BlogViewMode | null>(null)
  const [trackedView, setTrackedView] = useState(view)
  if (view !== trackedView) {
    setTrackedView(view)
    setPendingView(null)
  }

  const activeView = pendingView ?? view
  const { containerRef, box, instant } =
    useSlidingHighlight<HTMLDivElement>(activeView)
  const options: Array<{
    id: BlogViewMode
    label: string
    icon: ReactNode
  }> = [
    { id: 'list', label: copy.viewList, icon: <ListViewIcon /> },
    { id: 'grid', label: copy.viewGrid, icon: <GridViewIcon /> },
  ]

  return (
    // biome-ignore lint/a11y/useSemanticElements: list/grid toggle; fieldset would break the pill layout with links.
    <div
      role="group"
      aria-label={copy.viewLabel}
      className="inline-flex w-fit rounded-full border border-border bg-background p-0.5"
    >
      <div ref={containerRef} className="relative inline-flex">
        <SlidingHighlight
          box={box}
          instant={instant}
          radiusClassName="rounded-full"
        />
        {options.map((option) => {
          const pressed = view === option.id
          const highlighted = activeView === option.id
          const tooltipId = `blog-view-${option.id}`
          const href = buildBlogListingHref({
            page,
            view: option.id,
            language,
          })

          return (
            <Link
              key={option.id}
              href={href}
              aria-pressed={pressed}
              aria-label={option.label}
              aria-describedby={tooltipId}
              data-highlight-target={option.id}
              onPointerDown={() => setPendingView(option.id)}
              className={[
                'group/viewtip relative z-10 inline-flex size-8 items-center justify-center rounded-full',
                'transition-colors duration-200',
                focusClassName,
                highlightControlToneClassName(highlighted),
              ].join(' ')}
            >
              {option.icon}
              <span
                id={tooltipId}
                role="tooltip"
                className={viewSwitchTooltipClassName}
              >
                {option.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Pagination({
  copy,
  view,
  page,
  pageCount,
  language,
}: {
  copy: BlogCopy
  view: BlogViewMode
  page: number
  pageCount: number
  language: InterfaceLanguage
}) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)
  const { containerRef, box, instant } = useSlidingHighlight<HTMLUListElement>(
    String(hoveredPage ?? page),
  )
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  const pageHref = (target: number) =>
    buildBlogListingHref({ page: target, view, language })
  const paginationEdgeClassName = [
    highlightControlClassName,
    'px-3 py-2.5 text-sm text-foreground/70',
  ].join(' ')

  return (
    <nav
      aria-label={copy.paginationLabel}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className={paginationEdgeClassName}>
          {copy.paginationPrevious}
        </Link>
      ) : null}
      <ul
        ref={containerRef}
        className="relative flex list-none flex-wrap items-center gap-1"
        onMouseLeave={() => setHoveredPage(null)}
      >
        <SlidingHighlight box={box} instant={instant} />
        {pages.map((pageNumber) => {
          const current = pageNumber === page

          return (
            <li key={pageNumber}>
              <Link
                href={pageHref(pageNumber)}
                aria-current={current ? 'page' : undefined}
                aria-label={String(pageNumber)}
                data-highlight-target={String(pageNumber)}
                onMouseEnter={() => setHoveredPage(pageNumber)}
                className={[
                  'min-w-9 px-2 py-2.5 text-sm',
                  highlightControlClassName,
                  highlightControlToneClassName(current),
                ].join(' ')}
              >
                {pageNumber}
              </Link>
            </li>
          )
        })}
      </ul>
      {page < pageCount ? (
        <Link href={pageHref(page + 1)} className={paginationEdgeClassName}>
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
        <h1 className="mt-5 max-w-2xl font-display text-blog-display">
          {copy.title}
        </h1>
        <p className="mt-8 max-w-xl text-post-body leading-relaxed text-foreground/70">
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
                <ViewSwitch
                  copy={copy}
                  view={view}
                  page={page}
                  language={language}
                />
              </div>
            </div>
          </Container>
          <Container width="page" className="pb-16 pt-10 sm:pb-20 sm:pt-12">
            {view === 'list' ? (
              <ul className="flex list-none flex-col gap-2 sm:gap-3">
                {posts.map((post) => (
                  <ListItem key={post.slug} post={post} language={language} />
                ))}
              </ul>
            ) : (
              <ul className="grid list-none gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                language={language}
              />
            ) : null}
          </Container>
        </div>
      ) : null}
    </main>
  )
}
