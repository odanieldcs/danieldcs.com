'use client'

import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { getDictionary, type UiDictionary } from '@/lib/i18n/dictionary'
import type { InterfaceLanguage } from '@/lib/i18n/types'

type InterfaceLanguageContextValue = {
  language: InterfaceLanguage
}

const InterfaceLanguageContext =
  createContext<InterfaceLanguageContextValue | null>(null)

export function InterfaceLanguageProvider({
  language,
  children,
}: {
  language: InterfaceLanguage
  children: ReactNode
}) {
  const value = useMemo(() => ({ language }), [language])

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
