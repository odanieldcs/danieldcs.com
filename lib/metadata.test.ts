import { expect, test } from 'vitest'
import { baseMetadata } from './metadata'

test('resolves absolute URLs against the production site URL', () => {
  expect(baseMetadata.metadataBase?.href).toBe('https://danieldcs.com/')
})

test('composes the title with a template and a default', () => {
  expect(baseMetadata.title).toEqual({
    default: 'Daniel Castro',
    template: '%s · Daniel Castro',
  })
})

test('defines the default Open Graph and Twitter metadata', () => {
  expect(baseMetadata.openGraph).toMatchObject({
    siteName: 'Daniel Castro',
    type: 'website',
    locale: 'pt_BR',
  })
  expect(baseMetadata.twitter).toMatchObject({ card: 'summary_large_image' })
})

test('has a Portuguese default description and the site icon', () => {
  expect(baseMetadata.description).toBe(
    'Daniel Castro, engenheiro de software. Artigos, palestras e aprendizados de Dev para Dev.',
  )
  expect(baseMetadata.icons).toEqual({ icon: '/media/icons/logo-ddev.png' })
})
