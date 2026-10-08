'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/arrow-right-icon'
import { type AboutCopy, getAboutCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { contactEmail, linkedInProfileUrl } from '@/lib/site'

const PORTRAIT_SRC = '/media/personal/daniel_castro_profile_2.jpg'

const sectionGridClassName =
  'grid items-start gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16'

const sectionYClassName = 'py-20 sm:py-24'

const indexClassName = 'text-eyebrow uppercase text-label'

const bandTitleClassName = 'font-display text-3xl font-medium'

const sectionTitleClassName = `mt-4 ${bandTitleClassName}`

const subtitleClassName = 'mt-4 text-sm leading-relaxed text-foreground/55'

const ctaLinkClassName = [
  'group mt-8 inline-flex items-center gap-2 text-base font-semibold text-accent',
  'rounded-sm hover:underline',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const contactCtaLinkClassName = [
  'group mt-8 inline-flex items-center gap-2 text-base font-normal text-accent',
  'rounded-sm hover:underline',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

function joinSectionClassName(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function splitOrg(org: string) {
  const separator = ' / '
  const index = org.indexOf(separator)
  if (index === -1) {
    return { name: org, meta: '' }
  }

  return {
    name: org.slice(0, index),
    meta: org.slice(index + separator.length),
  }
}

function SectionLabel({
  index,
  title,
  subtitle,
}: {
  index: string
  title: string
  subtitle?: string
}) {
  return (
    <div>
      <p className={indexClassName}>{index}</p>
      <h2 className={sectionTitleClassName}>{title}</h2>
      {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
    </div>
  )
}

function Intro({
  copy,
  language,
}: {
  copy: AboutCopy
  language: InterfaceLanguage
}) {
  return (
    <section className="grid items-start gap-inline md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-section">
      <figure className="group order-1 w-9/10 justify-self-center overflow-hidden rounded-lg bg-foreground/6 md:order-2 md:justify-self-end">
        <div className="relative aspect-3/4 overflow-hidden">
          <Image
            src={PORTRAIT_SRC}
            alt={copy.portraitAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 48rem) 24rem, 90vw"
            className="object-cover object-[center_30%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-106 motion-safe:group-hover:rotate-2"
          />
        </div>
      </figure>
      <div className="order-2 md:order-1">
        <p className={indexClassName}>{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">
          {copy.headline}
        </h1>
        <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-foreground/80">
          {copy.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link
          href={localizePath('/blog', language)}
          className={ctaLinkClassName}
        >
          {copy.blogCta}
          <ArrowRightIcon />
        </Link>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/55">
          {copy.pillars.map((pillar) => (
            <span key={pillar}>{pillar}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience({ copy }: { copy: AboutCopy }) {
  return (
    <section className="w-full border-y border-border">
      <Container
        width="page"
        className={joinSectionClassName(
          sectionYClassName,
          sectionGridClassName,
        )}
      >
        <SectionLabel
          index={copy.sectionExperienceIndex}
          title={copy.experienceTitle}
          subtitle={copy.experienceSubtitle}
        />
        <div>
          <ol className="relative list-none border-l border-border">
            {copy.timeline.map((entry) => {
              const org = splitOrg(entry.org)

              return (
                <li
                  key={entry.role}
                  className="relative pb-12 pl-8 last:pb-0 sm:pl-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-1.25 top-1.5 size-2.25 rounded-full bg-accent ring-4 ring-background"
                  />
                  <p className="text-xs font-medium uppercase text-foreground/45">
                    {entry.period}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium">
                    {entry.role}
                  </h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-semibold text-accent">
                      {org.name}
                    </span>
                    {org.meta ? (
                      <>
                        <span className="text-foreground/30" aria-hidden="true">
                          /
                        </span>
                        <span className="text-foreground/55">{org.meta}</span>
                      </>
                    ) : null}
                  </p>
                </li>
              )
            })}
          </ol>
          <a
            href={linkedInProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaLinkClassName}
            data-cta="linkedin_experience"
            data-cta-location="about"
          >
            {copy.linkedinCta}
            <ArrowRightIcon />
          </a>
        </div>
      </Container>
    </section>
  )
}

function Repertoire({ copy }: { copy: AboutCopy }) {
  return (
    <section className={sectionGridClassName}>
      <SectionLabel
        index={copy.sectionRepertoireIndex}
        title={copy.repertoireTitle}
        subtitle={copy.repertoireSubtitle}
      />
      <div>
        <ul className="grid list-none gap-x-12 gap-y-12 sm:grid-cols-2">
          {copy.repertoireGroups.map((group) => (
            <li key={group.title}>
              <h3 className="border-b border-border pb-4 font-display text-xl font-medium">
                {group.title}
              </h3>
              <p className="mt-4 text-sm font-normal leading-relaxed text-foreground/60">
                {group.description}
              </p>
              <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-2 text-xs font-light text-foreground/45">
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-14 border-t border-border pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-display text-xl font-medium">
              {copy.languagesLabel}
            </h3>
            <p className="text-sm text-foreground/60">{copy.languagesValue}</p>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-display text-xl font-medium">
            {copy.stackLabel}
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/60">
            {copy.stackValue}
          </p>
        </div>
      </div>
    </section>
  )
}

function Personal({ copy }: { copy: AboutCopy }) {
  return (
    <section className="w-full border-y border-border bg-foreground/4">
      <Container
        width="page"
        className={joinSectionClassName('py-14 sm:py-16', sectionGridClassName)}
      >
        <p className={indexClassName}>{copy.sectionPersonalIndex}</p>
        <div>
          <h2 className={bandTitleClassName}>{copy.personalTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/65">
            {copy.personalParagraph}
          </p>
        </div>
      </Container>
    </section>
  )
}

function Contact({ copy }: { copy: AboutCopy }) {
  const [lead, ...rest] = copy.contactParagraphs

  return (
    <section className={sectionGridClassName}>
      <p className={indexClassName}>{copy.sectionContactIndex}</p>
      <div>
        {lead ? <h2 className={bandTitleClassName}>{lead}</h2> : null}
        {rest.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/60"
          >
            {paragraph}
          </p>
        ))}
        <a
          href={`mailto:${contactEmail}`}
          className={contactCtaLinkClassName}
          data-cta="contact_email"
          data-cta-location="about"
        >
          {copy.contactCta}
          <ArrowRightIcon />
        </a>
      </div>
    </section>
  )
}

export function AboutView() {
  const { language } = useInterfaceLanguage()
  const copy = getAboutCopy(language)

  return (
    <main data-analytics-source="about">
      <Container width="page" className="pb-20 pt-8 sm:pb-28 sm:pt-12 md:pt-16">
        <Intro copy={copy} language={language} />
      </Container>
      <Experience copy={copy} />
      <Container width="page" className={sectionYClassName}>
        <Repertoire copy={copy} />
      </Container>
      <Personal copy={copy} />
      <Container width="page" className={sectionYClassName}>
        <Contact copy={copy} />
      </Container>
    </main>
  )
}
