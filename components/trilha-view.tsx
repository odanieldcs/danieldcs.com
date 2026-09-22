'use client'

import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { getTrilhaCopy } from '@/lib/i18n/pages'

/** Temporary placeholder until ENG-94 replaces this page. */
export function TrilhaView() {
  const { language } = useInterfaceLanguage()
  const copy = getTrilhaCopy(language)

  return (
    <Container as="main" width="page" className="py-section">
      <h1 className="text-h1 font-semibold">{copy.title}</h1>
      <p className="mt-content-gap max-w-content text-body text-muted">
        {copy.description}
      </p>
    </Container>
  )
}
