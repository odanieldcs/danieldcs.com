'use client'

import Image from 'next/image'
import { buttonClassName } from '@/components/button'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { type AboutCopy, getAboutCopy } from '@/lib/i18n/pages'
import { contactEmail } from '@/lib/site'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_3.jpg'
const LINKEDIN_HREF = 'https://www.linkedin.com/in/odanieldcs'

const linkedinLinkClassName = [
  'group inline-flex items-center gap-2 text-sm font-semibold text-accent',
  'rounded-sm',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const plainListClassName =
  'flex list-none flex-wrap gap-x-inline gap-y-1 text-caption text-muted'

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

function SectionIntro({
  index,
  title,
  subtitle,
}: {
  index: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-inline">
      <p className="text-eyebrow uppercase text-label">{index}</p>
      <h2 className="font-display text-display-section">{title}</h2>
      {subtitle ? (
        <p className="max-w-xl text-body text-foreground/70">{subtitle}</p>
      ) : null}
    </div>
  )
}

function Intro({ copy }: { copy: AboutCopy }) {
  return (
    <section className="grid items-center gap-content-gap md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-section">
      <figure className="order-1 flex w-[90%] flex-col gap-inline justify-self-center md:order-2 md:justify-self-end">
        <div className="group relative aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={PORTRAIT_SRC}
            alt={copy.portraitAlt}
            fill
            priority
            sizes="(min-width: 48rem) 24rem, 90vw"
            className="object-cover object-[center_30%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.06]"
          />
        </div>
        <figcaption className="text-center text-caption text-muted italic">
          {copy.portraitCaption}
        </figcaption>
      </figure>
      <div className="order-2 flex min-w-0 flex-col gap-content-gap md:order-1">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="font-display text-display">{copy.headline}</h1>
        <div className="flex max-w-xl flex-col gap-inline">
          {copy.introParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-body text-foreground/70">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className={plainListClassName}>
          {copy.pillars.map((pillar) => (
            <li key={pillar}>{pillar}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Experience({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <SectionIntro
        index={copy.sectionExperienceIndex}
        title={copy.experienceTitle}
        subtitle={copy.experienceSubtitle}
      />
      <ol className="flex list-none flex-col">
        {copy.timeline.map((entry) => (
          <li
            key={entry.role}
            className="flex flex-col gap-inline border-l border-border py-6 pl-6"
          >
            <p className="text-eyebrow text-label">{entry.period}</p>
            <h3 className="font-display text-display-title">{entry.role}</h3>
            <p className="text-note text-foreground/65">{entry.org}</p>
          </li>
        ))}
      </ol>
      <a
        href={LINKEDIN_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={linkedinLinkClassName}
      >
        {copy.linkedinCta}
        <ArrowRightIcon />
      </a>
    </section>
  )
}

function Repertoire({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col gap-content-gap">
      <SectionIntro
        index={copy.sectionRepertoireIndex}
        title={copy.repertoireTitle}
        subtitle={copy.repertoireSubtitle}
      />
      <ul className="grid list-none gap-content-gap sm:grid-cols-2">
        {copy.repertoireGroups.map((group) => (
          <li key={group.title} className="flex flex-col gap-inline">
            <h3 className="font-display text-display-title">{group.title}</h3>
            <p className="text-note text-foreground/65">{group.description}</p>
            <ul className={plainListClassName}>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="text-caption text-muted">
        <span className="text-foreground">{copy.languagesLabel}:</span>{' '}
        {copy.languagesValue}
      </p>
    </section>
  )
}

function Personal({ copy }: { copy: AboutCopy }) {
  return (
    <section className="w-full bg-trail py-section text-trail-foreground">
      <Container width="page">
        <div className="flex max-w-2xl flex-col gap-content-gap">
          <p className="text-eyebrow uppercase text-trail-foreground/70">
            {copy.sectionPersonalIndex}
          </p>
          <h2 className="font-display text-display-band">{copy.personalTitle}</h2>
          <p className="max-w-xl text-lead text-trail-foreground/80">
            {copy.personalParagraph}
          </p>
        </div>
      </Container>
    </section>
  )
}

function Contact({ copy }: { copy: AboutCopy }) {
  return (
    <section className="flex flex-col items-start gap-content-gap">
      <SectionIntro
        index={copy.sectionContactIndex}
        title={copy.contactTitle}
      />
      <div className="flex max-w-xl flex-col gap-inline">
        {copy.contactParagraphs.map((paragraph) => (
          <p key={paragraph} className="text-body text-foreground/80">
            {paragraph}
          </p>
        ))}
      </div>
      <a
        href={`mailto:${contactEmail}`}
        className={buttonClassName({ shape: 'pill' })}
      >
        {copy.contactCta}
      </a>
    </section>
  )
}

export function AboutView() {
  const { language } = useInterfaceLanguage()
  const copy = getAboutCopy(language)

  return (
    <main className="flex w-full flex-col gap-section py-section">
      <Container width="page">
        <Intro copy={copy} />
      </Container>
      <Container width="page">
        <Experience copy={copy} />
      </Container>
      <Container width="page">
        <Repertoire copy={copy} />
      </Container>
      <Personal copy={copy} />
      <Container width="page">
        <Contact copy={copy} />
      </Container>
    </main>
  )
}
