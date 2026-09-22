export const interfaceLanguages = ['pt', 'en'] as const

export type InterfaceLanguage = (typeof interfaceLanguages)[number]

export const DEFAULT_INTERFACE_LANGUAGE: InterfaceLanguage = 'pt'

export const INTERFACE_LANGUAGE_COOKIE_NAME = 'interface-language'

export function isInterfaceLanguage(
  value: unknown,
): value is InterfaceLanguage {
  return interfaceLanguages.some((language) => language === value)
}
