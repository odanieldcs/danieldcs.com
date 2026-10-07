'use client'

import { useEffect } from 'react'
import '@/app/globals.css'
import { ArrowRightIcon } from '@/components/arrow-right-icon'
import { Container } from '@/components/container'
import {
  textLinkCtaClassName,
  textLinkRetryButtonClassName,
} from '@/components/text-link-cta'
import { captureError } from '@/lib/analytics'
import { getErrorCopy } from '@/lib/i18n/pages'
import { htmlLang } from '@/lib/i18n/types'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = getErrorCopy('pt')

  useEffect(() => {
    captureError(error, { boundary: 'global', digest: error.digest })
  }, [error])

  return (
    <html lang={htmlLang.pt}>
      <body className="bg-background text-foreground antialiased">
        <main>
          <Container width="page" className="py-section">
            <p className="text-eyebrow uppercase text-label">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl font-display text-display">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
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
              <a href="/" className={textLinkCtaClassName}>
                {copy.homeCta}
                <ArrowRightIcon />
              </a>
            </div>
          </Container>
        </main>
      </body>
    </html>
  )
}
