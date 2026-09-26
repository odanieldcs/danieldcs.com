import { getMainNavItem, getMainNavLabel } from '@/lib/navigation'
import type { InterfaceLanguage } from './types'

export type UiDictionary = {
  nav: {
    blog: string
    community: string
    about: string
  }
  theme: {
    toggle: string
    lightMode: string
    darkMode: string
  }
  language: {
    label: string
    switchToPt: string
    switchToEn: string
  }
  mobileMenu: {
    trigger: string
    navAriaLabel: string
  }
}

const uiCopy: Record<InterfaceLanguage, Omit<UiDictionary, 'nav'>> = {
  pt: {
    theme: {
      toggle: 'Tema',
      lightMode: 'Modo claro',
      darkMode: 'Modo escuro',
    },
    language: {
      label: 'Idioma',
      switchToPt: 'Mudar para português',
      switchToEn: 'Mudar para inglês',
    },
    mobileMenu: {
      trigger: 'Menu',
      navAriaLabel: 'Navegação principal',
    },
  },
  en: {
    theme: {
      toggle: 'Theme',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
    },
    language: {
      label: 'Language',
      switchToPt: 'Switch to Portuguese',
      switchToEn: 'Switch to English',
    },
    mobileMenu: {
      trigger: 'Menu',
      navAriaLabel: 'Main navigation',
    },
  },
}

export function getDictionary(lang: InterfaceLanguage): UiDictionary {
  return {
    nav: {
      blog: getMainNavLabel(getMainNavItem('/blog'), lang),
      community: getMainNavLabel(getMainNavItem('/community'), lang),
      about: getMainNavLabel(getMainNavItem('/about'), lang),
    },
    ...uiCopy[lang],
  }
}
