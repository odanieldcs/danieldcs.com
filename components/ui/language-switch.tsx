'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { ButtonLink } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { getLanguageSwitchHref } from '@/lib/i18n/alternates'
import { getDictionary } from '@/lib/i18n/dictionary'
import type { InterfaceLanguage } from '@/lib/i18n/types'

function nextLanguage(language: InterfaceLanguage): InterfaceLanguage {
  return language === 'pt' ? 'en' : 'pt'
}

function languageSwitchLabel(language: InterfaceLanguage): string {
  const destination = nextLanguage(language)
  const copy = getDictionary(destination).language

  return destination === 'en' ? copy.switchToEn : copy.switchToPt
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9z" />
    </svg>
  )
}

function LanguageSwitchLink({ search }: { search: string }) {
  const { language } = useInterfaceLanguage()
  const pathname = usePathname()
  const label = languageSwitchLabel(language)
  const path = getLanguageSwitchHref(pathname, nextLanguage(language))

  return (
    <Tooltip label={label} align="end">
      {(tooltipId) => (
        <ButtonLink
          variant="ghost"
          className="peer min-w-11 px-0"
          href={search ? `${path}?${search}` : path}
          prefetch={false}
          aria-describedby={tooltipId}
          aria-label={label}
          data-cta="language_switch"
          data-cta-location="header"
          data-cta-target={nextLanguage(language)}
        >
          <GlobeIcon />
        </ButtonLink>
      )}
    </Tooltip>
  )
}

function LanguageSwitchWithSearch() {
  return <LanguageSwitchLink search={useSearchParams().toString()} />
}

export function LanguageSwitch() {
  // useSearchParams() opts out of prerendering up to the nearest Suspense
  // boundary; the fallback keeps the link in the static HTML.
  return (
    <Suspense fallback={<LanguageSwitchLink search="" />}>
      <LanguageSwitchWithSearch />
    </Suspense>
  )
}
