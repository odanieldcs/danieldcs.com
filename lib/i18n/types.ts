export const interfaceLanguages = ['pt', 'en'] as const

export type InterfaceLanguage = (typeof interfaceLanguages)[number]

export const DEFAULT_INTERFACE_LANGUAGE: InterfaceLanguage = 'pt'

/** Value for the `<html lang>` attribute of each interface language. */
export const htmlLang: Record<InterfaceLanguage, string> = {
  pt: 'pt-BR',
  en: 'en',
}

export function isInterfaceLanguage(
  value: unknown,
): value is InterfaceLanguage {
  return interfaceLanguages.some((language) => language === value)
}
