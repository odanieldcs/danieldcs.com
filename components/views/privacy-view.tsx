import { Container } from '@/components/layout/container'
import { getPrivacyContent } from '@/content/privacy'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { linkClassName } from '@/lib/link-styles'
import { contactEmail } from '@/lib/site'

function PrivacyParagraph({ text }: { text: string }) {
  if (!text.includes(contactEmail)) {
    return <p>{text}</p>
  }

  const [before, after = ''] = text.split(contactEmail)

  return (
    <p>
      {before}
      <a href={`mailto:${contactEmail}`} className={linkClassName}>
        {contactEmail}
      </a>
      {after}
    </p>
  )
}

export function PrivacyView({ language }: { language: InterfaceLanguage }) {
  const privacyPage = getPrivacyContent(language)

  return (
    <main>
      <Container width="page" className="pb-10 pt-10 sm:pb-12 sm:pt-16">
        <p className="text-eyebrow uppercase text-label">Legal</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">
          {privacyPage.title}
        </h1>
        <p className="mt-4 text-sm text-foreground/55">
          {privacyPage.lastUpdatedLabel}
        </p>
        <p className="mt-4 text-base text-foreground/60">{privacyPage.intro}</p>

        <div className="mt-16 space-y-14">
          {privacyPage.sections.map((section) => (
            <section
              key={section.title}
              aria-labelledby={`privacy-${section.title}`}
              className="grid items-start gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16"
            >
              <h2
                id={`privacy-${section.title}`}
                className="font-display text-2xl font-medium"
              >
                {section.title}
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
                {section.paragraphs.map((paragraph) => (
                  <PrivacyParagraph key={paragraph} text={paragraph} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
