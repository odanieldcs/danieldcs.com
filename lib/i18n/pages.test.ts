import { expect, test } from 'vitest'
import { getHomeCopy, getTrilhaCopy } from './pages'

test('pt and en home copy share the same key shape', () => {
  const pt = getHomeCopy('pt')
  const en = getHomeCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'intro',
    'recentTitle',
    'trilhaHeading',
    'trilhaDescription',
    'trilhaCta',
  ])
  expect(pt.eyebrow).toBe('Software Engineer & Builder')
  expect(en.eyebrow).toBe('Software Engineer & Builder')
  expect(pt.recentTitle).toBe('Escrita recente')
  expect(en.recentTitle).toBe('Recent writing')
})

test('pt and en trilha placeholder copy share the same key shape', () => {
  const pt = getTrilhaCopy('pt')
  const en = getTrilhaCopy('en')

  expect(Object.keys(pt)).toEqual(['title', 'description'])
  expect(Object.keys(en)).toEqual(Object.keys(pt))
  expect(pt.title).toBe('Trilha')
  expect(en.title).toBe('Trilha')
})
