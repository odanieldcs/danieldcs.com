'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { writeInterfaceLanguageCookie } from '@/lib/i18n/cookie'
import { getDictionary, type UiDictionary } from '@/lib/i18n/dictionary'
import type { InterfaceLanguage } from '@/lib/i18n/types'

type InterfaceLanguageContextValue = {
  language: InterfaceLanguage
  setLanguage: (lang: InterfaceLanguage) => void
}

const InterfaceLanguageContext =
  createContext<InterfaceLanguageContextValue | null>(null)

export function InterfaceLanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: InterfaceLanguage
  children: ReactNode
}) {
  const [language, setLanguageState] = useState(initialLanguage)

  const setLanguage = useCallback((lang: InterfaceLanguage) => {
    setLanguageState(lang)
    writeInterfaceLanguageCookie(lang)
    document.documentElement.lang = lang
  }, [])

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  )

  return (
    <InterfaceLanguageContext.Provider value={value}>
      {children}
    </InterfaceLanguageContext.Provider>
  )
}

export function useInterfaceLanguage(): InterfaceLanguageContextValue {
  const context = useContext(InterfaceLanguageContext)

  if (!context) {
    throw new Error(
      'useInterfaceLanguage must be used within InterfaceLanguageProvider',
    )
  }

  return context
}

export function useUiDictionary(): UiDictionary {
  const { language } = useInterfaceLanguage()
  return getDictionary(language)
}
