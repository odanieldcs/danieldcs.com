import Link from 'next/link'
import { ArrowRightIcon } from '@/components/arrow-right-icon'
import { Container } from '@/components/container'
import { textLinkCtaClassName } from '@/components/text-link-cta'
import { getNotFoundCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export function NotFoundView({ language }: { language: InterfaceLanguage }) {
  const copy = getNotFoundCopy(language)

  return (
    <main>
      <Container width="page" className="py-section">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">{copy.title}</h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          {copy.paragraph}
        </p>
        <Link
          href={localizePath('/', language)}
          className={`mt-8 ${textLinkCtaClassName}`}
        >
          {copy.homeCta}
          <ArrowRightIcon />
        </Link>
      </Container>
    </main>
  )
}
