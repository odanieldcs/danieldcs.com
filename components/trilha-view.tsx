'use client'

import { buttonClassName } from '@/components/button'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { type TrilhaCopy, getTrilhaCopy } from '@/lib/i18n/pages'
import { trilhaWhatsAppUrl } from '@/lib/site'

const sectionGridClassName =
  'grid items-start gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16'

const sectionYClassName = 'py-20 sm:py-24'

const whatsappClassName = buttonClassName({
  shape: 'pill',
  className: [
    'h-12 px-6! text-sm! font-semibold!',
    'bg-trail-foreground! text-trail!',
    'hover:bg-trail-foreground/90!',
    'focus-visible:ring-offset-trail',
  ].join(' '),
})

function Hero({ copy }: { copy: TrilhaCopy }) {
  return (
    <section className="w-full bg-trail py-section text-trail-foreground">
      <Container width="page">
        <div className="grid items-end gap-content-gap md:grid-cols-2 md:gap-section">
          <div className="flex flex-col gap-content-gap">
            <p className="text-eyebrow uppercase text-trail-foreground/70">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-display">{copy.title}</h1>
          </div>
          <p className="max-w-xl text-lead text-trail-foreground/80">
            {copy.paragraph}
          </p>
        </div>
      </Container>
    </section>
  )
}

function Pillars({ copy }: { copy: TrilhaCopy }) {
  return (
    <section className="w-full">
      <Container width="page" className={sectionYClassName}>
        <div className={sectionGridClassName}>
          <p className="text-eyebrow uppercase text-label">{copy.pillars.index}</p>
          <div>
            <h2 className="font-display text-display-section">
              {copy.pillars.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
              {copy.pillars.intro}
            </p>
          </div>
        </div>
        <ul className="mt-16 grid list-none md:grid-cols-4">
          {copy.pillars.items.map((item, index) => {
            const isLast = index === copy.pillars.items.length - 1

            return (
              <li
                key={item.index}
                className={[
                  'flex flex-col gap-inline border-border py-8',
                  index > 0 ? 'md:pl-6' : '',
                  !isLast ? 'border-b pr-0 md:border-r md:border-b-0 md:pr-6' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="font-display text-sm text-label">{item.index}</span>
                <h3 className="font-display text-display-title">{item.title}</h3>
                <p className="text-note text-foreground/65">{item.description}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}

function Building({ copy }: { copy: TrilhaCopy }) {
  return (
    <section className="w-full bg-foreground/[0.03]">
      <Container
        width="page"
        className={`${sectionYClassName} ${sectionGridClassName}`}
      >
        <p className="text-eyebrow uppercase text-label">{copy.building.label}</p>
        <div className="flex max-w-2xl flex-col gap-4">
          <h2 className="font-display text-display-section">{copy.building.title}</h2>
          <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
            {copy.building.body}
          </p>
          <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
            {copy.building.personalization}
          </p>
        </div>
      </Container>
    </section>
  )
}

function Interest({ copy }: { copy: TrilhaCopy }) {
  return (
    <section className="w-full bg-trail py-section text-trail-foreground">
      <Container
        width="page"
        className="grid items-center gap-content-gap md:grid-cols-[minmax(0,1fr)_auto] md:gap-section"
      >
        <div className="flex max-w-xl flex-col gap-content-gap">
          <p className="text-eyebrow uppercase text-trail-foreground/70">
            {copy.cta.eyebrow}
          </p>
          <h2 className="font-display text-display-band">{copy.cta.title}</h2>
          <p className="text-lead text-trail-foreground/80">{copy.cta.line}</p>
        </div>
        <a
          href={trilhaWhatsAppUrl(copy.cta.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={whatsappClassName}
        >
          {copy.cta.button}
        </a>
      </Container>
    </section>
  )
}

export function TrilhaView() {
  const { language } = useInterfaceLanguage()
  const copy = getTrilhaCopy(language)

  return (
    <main className="flex w-full flex-col">
      <Hero copy={copy} />
      <Pillars copy={copy} />
      <Building copy={copy} />
      <Interest copy={copy} />
    </main>
  )
}
