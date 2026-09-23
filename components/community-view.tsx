'use client'

import Image from 'next/image'
import { ArrowRightIcon } from '@/components/arrow-right-icon'
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

const linkClassName = [
  'group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent',
  'rounded-sm hover:underline',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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

function EntryItem({
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
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-foreground/45">
            <time dateTime={entry.date}>
              {formatEntryDate(entry.date, language)}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{copy.types[entry.type]}</span>
          </p>
          <h3 className="mt-2 font-display text-2xl font-medium">{entry.title}</h3>
          {entry.eventName ? (
            <p className="mt-2 text-sm font-semibold text-accent">
              {entry.eventName}
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-relaxed text-foreground/60">
            {entry.description}
          </p>
          {entry.link ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {copy.openLink}
              <ArrowRightIcon />
            </a>
          ) : null}
        </div>
        {entry.cover ? (
          <Image
            src={`/media/personal/${entry.cover}`}
            alt=""
            width={80}
            height={80}
            className="size-16 shrink-0 rounded-md object-cover sm:size-20"
          />
        ) : null}
      </div>
    </li>
  )
}

function YearSection({
  group,
  copy,
  language,
}: {
  group: YearGroup
  copy: CommunityCopy
  language: InterfaceLanguage
}) {
  const headingId = `community-year-${group.year}`

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
        <ol className="relative list-none border-l border-border">
          {group.entries.map((entry) => (
            <EntryItem
              key={entry.slug}
              entry={entry}
              copy={copy}
              language={language}
            />
          ))}
        </ol>
      </Container>
    </section>
  )
}

export function CommunityView({ entries }: { entries: CommunityEntryView[] }) {
  const { language } = useInterfaceLanguage()
  const copy = getCommunityCopy(language)
  const groups = groupEntriesByUtcYear(entries)

  return (
    <main>
      <Container width="page" className="pb-16 pt-10 sm:pb-20 sm:pt-16">
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
        <div className="border-t border-border">
          {groups.map((group) => (
            <YearSection
              key={group.year}
              group={group}
              copy={copy}
              language={language}
            />
          ))}
        </div>
      ) : null}
    </main>
  )
}
