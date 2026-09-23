'use client'

import Image from 'next/image'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import {
  type AboutCollabChannel,
  type AboutCopy,
  getAboutCopy,
} from '@/lib/i18n/pages'
import { linkClassName } from '@/lib/link-styles'
import { contactEmail } from '@/lib/site'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_1.png'

const collabCardClassName = [
  'group flex h-full w-full flex-col rounded-lg border border-border p-7',
  'transition-colors hover:border-accent/40 hover:bg-foreground/5',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const chipClassName = 'rounded-full border border-border px-3 py-1 text-sm'

function collaborationHref(subject: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function Intro({ copy }: { copy: AboutCopy }) {
  return (
    <section className="grid items-center gap-content-gap md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-section">
      <figure className="group relative order-1 aspect-[3/4] w-[90%] justify-self-center overflow-hidden rounded-lg md:order-2 md:justify-self-end">
        <Image
          src={PORTRAIT_SRC}
          alt={copy.portraitAlt}
          fill
          priority
          sizes="(min-width: 48rem) 24rem, 90vw"
          className="object-cover object-[center_25%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.06]"
        />
      </figure>
      <div className="order-2 flex min-w-0 flex-col gap-content-gap md:order-1">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="font-display text-display">{copy.headline}</h1>
        <p className="max-w-xl text-body text-foreground/70">{copy.intro}</p>
        <ul className="flex list-none flex-wrap gap-2">
          {copy.pillars.map((pillar) => (
            <li key={pillar} className={chipClassName}>
              {pillar}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Timeline({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <h2 className="font-display text-display-section">{copy.timelineTitle}</h2>
      <ol className="flex list-none flex-col">
        {copy.timeline.map((entry) => (
          <li
            key={`${entry.role}-${entry.period}`}
            className="flex flex-col gap-inline border-l border-border py-6 pl-6"
          >
            <p className="text-eyebrow text-label">{entry.period}</p>
            <h3 className="font-display text-display-title">{entry.role}</h3>
            <p className="text-note text-foreground/65">{entry.org}</p>
            <p className="max-w-xl text-body text-foreground/80">
              {entry.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div className="flex flex-col gap-inline">
      <h3 className="text-eyebrow uppercase text-label">{label}</h3>
      <ul className="flex list-none flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className={chipClassName}>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Skills({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <h2 className="font-display text-display-section">{copy.skillsTitle}</h2>
      <div className="flex flex-col gap-content-gap">
        <SkillGroup label={copy.hardSkillsLabel} skills={copy.hardSkills} />
        <SkillGroup label={copy.softSkillsLabel} skills={copy.softSkills} />
      </div>
    </section>
  )
}

function Personal({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <h2 className="font-display text-display-section">{copy.personalTitle}</h2>
      <p className="max-w-xl text-body text-foreground/80">{copy.personalIntro}</p>
      <dl className="grid gap-content-gap md:grid-cols-2">
        {copy.personalFacts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-inline border-t border-border pt-4"
          >
            <dt className="text-eyebrow uppercase text-label">{fact.label}</dt>
            <dd className="text-body">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function CollabCard({
  channel,
  cta,
}: {
  channel: AboutCollabChannel
  cta: string
}) {
  return (
    <a href={collaborationHref(channel.mailSubject)} className={collabCardClassName}>
      <h3 className="font-display text-display-title transition-colors group-hover:text-accent">
        {channel.title}
      </h3>
      <p className="mt-3 text-note text-foreground/65">{channel.description}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent">
        {cta}
        <ArrowRightIcon />
      </span>
    </a>
  )
}

function Collaboration({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <div className="flex flex-col gap-inline">
        <h2 className="font-display text-display-section">{copy.collabTitle}</h2>
        <p className="max-w-xl text-body text-foreground/80">{copy.collabIntro}</p>
        <p>
          <a href={`mailto:${contactEmail}`} className={linkClassName}>
            {contactEmail}
          </a>
        </p>
      </div>
      <ul className="grid list-none gap-content-gap md:grid-cols-2">
        {copy.collabChannels.map((channel) => (
          <li key={channel.mailSubject} className="flex">
            <CollabCard channel={channel} cta={copy.collabCta} />
          </li>
        ))}
      </ul>
      <p className="text-note text-foreground/65">{copy.collabSocialNote}</p>
    </section>
  )
}

export function AboutView() {
  const { language } = useInterfaceLanguage()
  const copy = getAboutCopy(language)

  return (
    <Container
      as="main"
      width="page"
      className="flex flex-col gap-section py-section"
    >
      <Intro copy={copy} />
      <Timeline copy={copy} />
      <Skills copy={copy} />
      <Personal copy={copy} />
      <Collaboration copy={copy} />
    </Container>
  )
}
