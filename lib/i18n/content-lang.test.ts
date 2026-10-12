import { expect, test } from 'vitest'
import { htmlLang } from '@/lib/i18n/types'
import { contentLang } from './content-lang'

test('returns the content language tag when it differs from the interface', () => {
  expect(contentLang('pt', 'en')).toBe(htmlLang.pt)
  expect(contentLang('en', 'pt')).toBe(htmlLang.en)
})

test('omits the attribute when content and interface languages match', () => {
  expect(contentLang('pt', 'pt')).toBeUndefined()
  expect(contentLang('en', 'en')).toBeUndefined()
})
