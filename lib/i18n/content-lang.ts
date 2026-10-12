import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'

/**
 * BCP 47 tag for content written in a different language than the interface.
 * Matching languages return `undefined` so React omits the attribute.
 */
export function contentLang(
  contentLanguage: InterfaceLanguage,
  uiLanguage: InterfaceLanguage,
): string | undefined {
  if (contentLanguage === uiLanguage) {
    return undefined
  }

  return htmlLang[contentLanguage]
}
