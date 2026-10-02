import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { baseMetadata } from './metadata'

const rootLayouts = ['app/(pt)', 'app/(en)/en'] as const

function readPng(relativePath: string) {
  const bytes = readFileSync(path.join(process.cwd(), relativePath))
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  expect(bytes.subarray(12, 16).toString('ascii')).toBe('IHDR')
  return {
    bytes,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  }
}

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

test('has a Portuguese default description and leaves icons to the file convention', () => {
  expect(baseMetadata.description).toBe(
    'Daniel Castro, engenheiro de software. Artigos, palestras e aprendizados de Dev para Dev.',
  )
  expect('icons' in baseMetadata).toBe(false)
})

test('ships the same static icons and share image from both root layouts', () => {
  const [pt, en] = rootLayouts
  const icon = readPng(`${pt}/icon.png`)
  const apple = readPng(`${pt}/apple-icon.png`)
  const openGraph = readPng(`${pt}/opengraph-image.png`)
  const twitter = readPng(`${pt}/twitter-image.png`)

  expect(icon).toMatchObject({ width: 32, height: 32 })
  expect(apple).toMatchObject({ width: 180, height: 180 })
  expect(openGraph).toMatchObject({ width: 1200, height: 630 })
  expect(openGraph.bytes.length).toBeLessThan(300 * 1024)
  expect(twitter.bytes).toEqual(openGraph.bytes)

  for (const file of [
    'icon.png',
    'apple-icon.png',
    'opengraph-image.png',
    'twitter-image.png',
  ]) {
    expect(readFileSync(path.join(process.cwd(), en, file))).toEqual(
      readFileSync(path.join(process.cwd(), pt, file)),
    )
  }
})
