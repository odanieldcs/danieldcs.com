'use client'

import { Button } from '@/components/button'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
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

export function LanguageSwitch() {
  const { language, setLanguage } = useInterfaceLanguage()

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => setLanguage(nextLanguage(language))}
    >
      {languageSwitchLabel(language)}
    </Button>
  )
}
