'use client'

import { type ReactNode, useRef, useState } from 'react'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import type { CommunityEntryType } from '@/lib/content/community-schema'
import { type CommunityCopy, getCommunityCopy } from '@/lib/i18n/pages'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export type CommunityEntryView = {
  slug: string
  title: string
  description: string
  /** ISO-8601 timestamp serialized on the server. */
  date: string
  type: CommunityEntryType
  language: 'pt' | 'en'
  eventName?: string
  link?: string
  /** Filename in public/media/personal/. */
  cover?: string
}

type CommunityViewMode = 'list' | 'grid'

const dateLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

function formatEntryDate(isoDate: string, language: InterfaceLanguage): string {
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

const sectionGridClassName =
  'grid items-start gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16'

const focusClassName = [
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

type YearGroup = {
  year: number
  entries: CommunityEntryView[]
}

function groupEntriesByUtcYear(entries: CommunityEntryView[]): YearGroup[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const groups: YearGroup[] = []

  for (const entry of sorted) {
    const year = new Date(entry.date).getUTCFullYear()
    const current = groups.at(-1)

    if (current && current.year === year) {
      current.entries.push(entry)
    } else {
      groups.push({ year, entries: [entry] })
    }
  }

  return groups
}

function EntryBody({
  entry,
  copy,
  language,
  titleClassName,
}: {
  entry: CommunityEntryView
  copy: CommunityCopy
  language: InterfaceLanguage
  titleClassName: string
}) {
  return (
    <>
      <p className="text-xs font-medium uppercase text-foreground/45">
        <time dateTime={entry.date}>{formatEntryDate(entry.date, language)}</time>
        <span aria-hidden="true"> · </span>
        <span>{copy.types[entry.type]}</span>
      </p>
      <h3 className={titleClassName}>{entry.title}</h3>
      {entry.eventName ? (
        <p className="mt-2 text-sm font-semibold text-accent">{entry.eventName}</p>
      ) : null}
    </>
  )
}

function EntryFrame({
  entry,
  className,
  children,
}: {
  entry: CommunityEntryView
  className: string
  children: ReactNode
}) {
  if (!entry.link) {
    return <div className={className}>{children}</div>
  }

  return (
    <a
      href={entry.link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

function ListItem({
  entry,
  copy,
  language,
}: {
  entry: CommunityEntryView
  copy: CommunityCopy
  language: InterfaceLanguage
}) {
  return (
    <li className="relative pb-12 pl-8 last:pb-0 sm:pl-10">
      <span
        aria-hidden="true"
        className="absolute -left-[5px] top-1.5 size-[9px] rounded-full bg-accent ring-4 ring-background"
      />
      <EntryFrame
        entry={entry}
        className={[
          'block rounded-sm',
          entry.link ? `group ${focusClassName}` : '',
        ].join(' ')}
      >
        <EntryBody
          entry={entry}
          copy={copy}
          language={language}
          titleClassName={[
            'mt-2 font-display text-2xl font-medium',
            entry.link ? 'transition-colors group-hover:text-accent' : '',
          ].join(' ')}
        />
      </EntryFrame>
    </li>
  )
}

function GridCard({
  entry,
  copy,
  language,
}: {
  entry: CommunityEntryView
  copy: CommunityCopy
  language: InterfaceLanguage
}) {
  return (
    <li className="flex">
      <EntryFrame
        entry={entry}
        className={[
          'flex h-full w-full flex-col rounded-lg border border-border p-6',
          entry.link
            ? `group transition-colors hover:border-accent/40 hover:bg-foreground/5 ${focusClassName}`
            : '',
        ].join(' ')}
      >
        <EntryBody
          entry={entry}
          copy={copy}
          language={language}
          titleClassName={[
            'mt-3 font-display text-xl font-medium',
            entry.link ? 'transition-colors group-hover:text-accent' : '',
          ].join(' ')}
        />
      </EntryFrame>
    </li>
  )
}

function YearSection({
  group,
  copy,
  language,
  view,
  animate,
}: {
  group: YearGroup
  copy: CommunityCopy
  language: InterfaceLanguage
  view: CommunityViewMode
  animate: boolean
}) {
  const headingId = `community-year-${group.year}`
  const motionClassName = animate ? 'motion-safe:animate-community-view-in' : ''

  return (
    <section aria-labelledby={headingId} className="border-b border-border">
      <Container
        width="page"
        className={`${sectionGridClassName} py-16 sm:py-20`}
      >
        <div>
          <p className="text-eyebrow uppercase text-label">{copy.yearLabel}</p>
          <h2 id={headingId} className="mt-4 font-display text-3xl font-medium">
            {group.year}
          </h2>
        </div>
        <div
          key={view}
          className={['min-w-0', motionClassName].filter(Boolean).join(' ')}
        >
          {view === 'list' ? (
            <ol className="relative list-none border-l border-border">
              {group.entries.map((entry) => (
                <ListItem
                  key={entry.slug}
                  entry={entry}
                  copy={copy}
                  language={language}
                />
              ))}
            </ol>
          ) : (
            <ul className="grid list-none gap-4 sm:grid-cols-2">
              {group.entries.map((entry) => (
                <GridCard
                  key={entry.slug}
                  entry={entry}
                  copy={copy}
                  language={language}
                />
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
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
  onChange,
}: {
  copy: CommunityCopy
  view: CommunityViewMode
  onChange: (view: CommunityViewMode) => void
}) {
  const options: Array<{
    id: CommunityViewMode
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

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={pressed}
            aria-label={option.label}
            onClick={() => onChange(option.id)}
            className={[
              'inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200',
              focusClassName,
              pressed
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground/45 hover:text-foreground',
            ].join(' ')}
          >
            {option.icon}
          </button>
        )
      })}
    </div>
  )
}

export function CommunityView({ entries }: { entries: CommunityEntryView[] }) {
  const { language } = useInterfaceLanguage()
  const copy = getCommunityCopy(language)
  const groups = groupEntriesByUtcYear(entries)
  const [view, setView] = useState<CommunityViewMode>('list')
  const animateView = useRef(false)

  function changeView(next: CommunityViewMode) {
    if (next === view) return
    animateView.current = true
    setView(next)
  }

  return (
    <main>
      <Container width="page" className="pb-10 pt-10 sm:pb-12 sm:pt-16">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">{copy.title}</h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          {copy.intro}
        </p>
        {groups.length === 0 ? (
          <p className="mt-10 text-base text-foreground/60">{copy.empty}</p>
        ) : null}
      </Container>
      {groups.length > 0 ? (
        <div className="relative border-t border-border">
          <Container width="page" className="h-0">
            <div className="relative h-0">
              <div className="absolute right-0 top-0 z-10 -translate-y-1/2">
                <ViewSwitch copy={copy} view={view} onChange={changeView} />
              </div>
            </div>
          </Container>
          {groups.map((group) => (
            <YearSection
              key={group.year}
              group={group}
              copy={copy}
              language={language}
              view={view}
              animate={animateView.current}
            />
          ))}
        </div>
      ) : null}
    </main>
  )
}
