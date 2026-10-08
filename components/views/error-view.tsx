'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/arrow-right-icon'
import {
  textLinkCtaClassName,
  textLinkRetryButtonClassName,
} from '@/components/ui/text-link-cta'
import { getErrorCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export function ErrorView({
  language,
  reset,
}: {
  language: InterfaceLanguage
  reset: () => void
}) {
  const copy = getErrorCopy(language)

  return (
    <main>
      <Container width="page" className="py-section">
        <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display">
          {copy.title}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
          {copy.paragraph}
        </p>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="button"
            onClick={reset}
            className={textLinkRetryButtonClassName}
          >
            {copy.retryCta}
            <ArrowRightIcon />
          </button>
          <Link
            href={localizePath('/', language)}
            className={textLinkCtaClassName}
          >
            {copy.homeCta}
            <ArrowRightIcon />
          </Link>
        </div>
      </Container>
    </main>
  )
}
