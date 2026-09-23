import { expect, test } from 'vitest'
import { getAboutCopy, getHomeCopy, getTrilhaCopy } from './pages'

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

test('pt and en about copy share the same key shape', () => {
  const pt = getAboutCopy('pt')
  const en = getAboutCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'headline',
    'intro',
    'portraitAlt',
    'pillars',
    'timelineTitle',
    'timeline',
    'skillsTitle',
    'hardSkillsLabel',
    'hardSkills',
    'softSkillsLabel',
    'softSkills',
    'personalTitle',
    'personalIntro',
    'personalFacts',
    'collabTitle',
    'collabIntro',
    'collabCta',
    'collabSocialNote',
    'collabChannels',
  ])
  expect(pt.headline).toBe('Trajetória, ofício e colaboração.')
  expect(en.headline).toBe('Path, craft, and collaboration.')
  expect(pt.pillars).toEqual([
    'Engenheiro de software',
    'Builder',
    'Educador',
    'Palestrante',
    'Corredor',
  ])
  expect(en.pillars).toEqual([
    'Software Engineer',
    'Builder',
    'Educator',
    'Speaker',
    'Runner',
  ])
  expect(pt.timeline.map((item) => Object.keys(item))).toEqual([
    ['period', 'role', 'org', 'description'],
    ['period', 'role', 'org', 'description'],
    ['period', 'role', 'org', 'description'],
    ['period', 'role', 'org', 'description'],
  ])
  expect(en.timeline.map((item) => Object.keys(item))).toEqual(
    pt.timeline.map((item) => Object.keys(item)),
  )
  expect(pt.timeline.map((item) => item.role)).toEqual([
    'Engenheiro de software',
    'Educador',
    'Palestrante',
    'Builder',
  ])
  expect(pt.timeline.every((item) => item.org === '[placeholder]')).toBe(true)
  expect(pt.hardSkills.slice(0, 4)).toEqual([
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
  ])
  expect(en.hardSkills.slice(0, 4)).toEqual(pt.hardSkills.slice(0, 4))
  expect(pt.softSkills).toHaveLength(en.softSkills.length)
  expect(pt.personalFacts.map((item) => Object.keys(item))).toEqual([
    ['label', 'value'],
    ['label', 'value'],
    ['label', 'value'],
  ])
  expect(pt.personalFacts[0]?.value).toBe('Gravataí, Brasil')
  expect(en.personalFacts[0]?.value).toBe('Gravataí, Brazil')
  expect(pt.collabChannels.map((item) => item.title)).toEqual([
    'Consultoria',
    'Mentoria',
    'Palestras',
    'Workshops',
    'Colaborações',
    'Oportunidades profissionais',
  ])
  expect(en.collabChannels.map((item) => item.mailSubject)).toEqual([
    'Consulting',
    'Mentoring',
    'Talk',
    'Workshop',
    'Collaboration',
    'Professional opportunity',
  ])
  expect(pt.collabChannels.map((item) => Object.keys(item))).toEqual(
    en.collabChannels.map((item) => Object.keys(item)),
  )
})

test('pt and en trilha placeholder copy share the same key shape', () => {
  const pt = getTrilhaCopy('pt')
  const en = getTrilhaCopy('en')

  expect(Object.keys(pt)).toEqual(['title', 'description'])
  expect(Object.keys(en)).toEqual(Object.keys(pt))
  expect(pt.title).toBe('Trilha')
  expect(en.title).toBe('Trilha')
})
