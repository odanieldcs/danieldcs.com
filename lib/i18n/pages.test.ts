import { expect, test } from 'vitest'
import { getHomeCopy, getTrilhaCopy } from './pages'

test('pt and en home copy share the same key shape', () => {
  const pt = getHomeCopy('pt')
  const en = getHomeCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'headline',
    'intro',
    'highlights',
    'portraitAlt',
    'recentEyebrow',
    'recentTitle',
    'readArticle',
    'trilhaEyebrow',
    'trilhaHeading',
    'trilhaDescription',
    'trilhaCta',
  ])
  expect(pt.headline).toBe(
    'Construindo Produtos em Softwares e correndo longas distâncias.',
  )
  expect(en.headline).toBe(
    'Building software products and running long distances.',
  )
  expect(pt.eyebrow).toBe('Engenheiro · Builder · Corredor')
  expect(en.eyebrow).toBe('Engineer · Builder · Runner')
  expect(pt.highlights.map((item) => Object.keys(item))).toEqual([
    ['label', 'description'],
    ['label', 'description'],
    ['label', 'description'],
  ])
  expect(en.highlights.map((item) => Object.keys(item))).toEqual(
    pt.highlights.map((item) => Object.keys(item)),
  )
  expect(pt.highlights.map((item) => item.label)).toEqual([
    'Engenheiro Full-Stack',
    'Builder',
    'Corredor',
  ])
  expect(en.highlights.map((item) => item.label)).toEqual([
    'Full-Stack Engineer',
    'Builder',
    'Runner',
  ])
  expect(pt.portraitAlt).toBe('Retrato de Daniel Castro na Golden Gate')
  expect(en.portraitAlt).toBe(
    'Portrait of Daniel Castro at the Golden Gate Bridge',
  )
  expect(pt.recentTitle).toBe('Escrita recente')
  expect(en.recentTitle).toBe('Recent writing')
  expect(pt.readArticle).toBe('Ler artigo')
  expect(en.readArticle).toBe('Read article')
})

test('pt and en trilha placeholder copy share the same key shape', () => {
  const pt = getTrilhaCopy('pt')
  const en = getTrilhaCopy('en')

  expect(Object.keys(pt)).toEqual(['title', 'description'])
  expect(Object.keys(en)).toEqual(Object.keys(pt))
  expect(pt.title).toBe('Trilha')
  expect(en.title).toBe('Trilha')
})
