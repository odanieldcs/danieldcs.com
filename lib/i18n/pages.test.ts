import { expect, test } from 'vitest'
import {
  getAboutCopy,
  getBlogCopy,
  getCommunityCopy,
  getHomeCopy,
  getTrilhaCopy,
} from './pages'

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
    'introParagraphs',
    'pillars',
    'portraitAlt',
    'portraitCaption',
    'sectionExperienceIndex',
    'experienceTitle',
    'experienceSubtitle',
    'timeline',
    'linkedinCta',
    'sectionRepertoireIndex',
    'repertoireTitle',
    'repertoireSubtitle',
    'repertoireGroups',
    'languagesLabel',
    'languagesValue',
    'sectionPersonalIndex',
    'personalTitle',
    'personalParagraph',
    'sectionContactIndex',
    'contactTitle',
    'contactParagraphs',
    'contactCta',
  ])
  expect(pt.headline).toBe('Construindo e compartilhando, de Dev para Dev.')
  expect(en.headline).toBe('Building and sharing, from dev to dev.')
  expect(pt.portraitAlt).toBe(
    'Daniel Castro palestrando no palco do TDC Floripa em 2026, com microfone',
  )
  expect(en.portraitAlt).toBe(
    'Daniel Castro speaking on stage at TDC Floripa in 2026, holding a microphone',
  )
  expect(pt.experienceSubtitle).toBe(
    'Alguns dos contextos em que venho entregando software.',
  )
  expect(en.experienceSubtitle).toBe(
    'Some of the contexts where I have been delivering software.',
  )
  expect(pt.pillars).toEqual([
    'Software Engineering',
    'IA aplicada',
    'Liderança técnica',
    'Ensino',
  ])
  expect(en.pillars).toEqual([
    'Software engineering',
    'Applied AI',
    'Technical leadership',
    'Teaching',
  ])
  expect(pt.timeline.map((item) => Object.keys(item))).toEqual([
    ['period', 'role', 'org'],
    ['period', 'role', 'org'],
    ['period', 'role', 'org'],
    ['period', 'role', 'org'],
  ])
  expect(en.timeline.map((item) => Object.keys(item))).toEqual(
    pt.timeline.map((item) => Object.keys(item)),
  )
  expect(pt.timeline.map((item) => item.role)).toEqual([
    'Staff Software Engineer',
    'Frontend Team Lead & Architect',
    'Software Engineer Consultant & Educator',
    'Senior Full Stack Developer',
  ])
  expect(en.timeline.map((item) => item.role)).toEqual(
    pt.timeline.map((item) => item.role),
  )
  expect(pt.timeline.map((item) => item.org)).toEqual([
    'Curebase / Estados Unidos · remoto',
    'Grupo ITSS / Brasil · contrato',
    'DDEVs / Brasil · meio período',
    'Bayer / Estados Unidos e Alemanha · contrato',
  ])
  expect(en.timeline.map((item) => item.org)).toEqual([
    'Curebase / United States · remote',
    'Grupo ITSS / Brazil · contract',
    'DDEVs / Brazil · part-time',
    'Bayer / United States and Germany · contract',
  ])
  expect(pt.repertoireGroups.map((group) => Object.keys(group))).toEqual([
    ['title', 'description', 'skills'],
    ['title', 'description', 'skills'],
    ['title', 'description', 'skills'],
    ['title', 'description', 'skills'],
  ])
  expect(en.repertoireGroups.map((group) => group.title)).toEqual(
    pt.repertoireGroups.map((group) => group.title),
  )
  expect(pt.repertoireGroups.map((group) => group.title)).toEqual([
    'Software Engineering',
    'Product & AI',
    'Teaching & Community',
    'Leadership',
  ])
  expect(pt.repertoireGroups[0]?.skills).toEqual([
    'TypeScript',
    'React & Next.js',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Arquitetura de software',
  ])
  expect(en.repertoireGroups[0]?.skills[5]).toBe('Software architecture')
  expect(pt.repertoireGroups[1]?.skills).toContain('Descoberta')
  expect(en.repertoireGroups[1]?.skills).toContain('Discovery')
  expect(pt.languagesValue).toBe('Português · Inglês')
  expect(en.languagesValue).toBe('Portuguese · English')
  expect(pt.contactCta).toBe('Entre em contato')
  expect(en.contactCta).toBe('Get in touch')
  expect(pt.contactParagraphs).toHaveLength(2)
  expect(en.contactParagraphs).toHaveLength(2)
})

test('pt and en community copy share the same key shape', () => {
  const pt = getCommunityCopy('pt')
  const en = getCommunityCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'title',
    'intro',
    'empty',
    'yearLabel',
    'viewLabel',
    'viewList',
    'viewGrid',
    'types',
  ])
  expect(pt.title).toBe('Palestras, workshops e encontros.')
  expect(en.title).toBe('Talks, workshops, and gatherings.')
  expect(pt.viewList).toBe('Lista')
  expect(en.viewList).toBe('List')
  expect(pt.viewGrid).toBe('Grade')
  expect(en.viewGrid).toBe('Grid')
  expect(pt.yearLabel).toBe('Ano')
  expect(en.yearLabel).toBe('Year')
  expect(pt.types).toEqual({
    talk: 'Palestra',
    workshop: 'Workshop',
    event: 'Evento',
    other: 'Outro',
  })
  expect(en.types).toEqual({
    talk: 'Talk',
    workshop: 'Workshop',
    event: 'Event',
    other: 'Other',
  })
  expect(pt.empty.length).toBeGreaterThan(0)
  expect(en.empty.length).toBeGreaterThan(0)
})

test('pt and en blog copy share the same key shape', () => {
  const pt = getBlogCopy('pt')
  const en = getBlogCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'title',
    'intro',
    'empty',
    'viewLabel',
    'viewList',
    'viewGrid',
    'paginationLabel',
    'paginationPrevious',
    'paginationNext',
  ])
  expect(pt.title).toBe('Artigos e notas de engenharia.')
  expect(en.title).toBe('Articles and engineering notes.')
  expect(pt.paginationPrevious).toBe('Anterior')
  expect(en.paginationPrevious).toBe('Previous')
  expect(pt.paginationNext).toBe('Próxima')
  expect(en.paginationNext).toBe('Next')
})

test('pt and en trilha copy share the same key shape', () => {
  const pt = getTrilhaCopy('pt')
  const en = getTrilhaCopy('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt)).toEqual([
    'eyebrow',
    'title',
    'paragraph',
    'pillars',
    'building',
    'cta',
  ])
  expect(Object.keys(pt.pillars)).toEqual(Object.keys(en.pillars))
  expect(Object.keys(pt.building)).toEqual(Object.keys(en.building))
  expect(Object.keys(pt.cta)).toEqual(Object.keys(en.cta))
  expect(pt.pillars.items.map((item) => Object.keys(item))).toEqual(
    en.pillars.items.map((item) => Object.keys(item)),
  )
  expect(pt.title).toBe('Guiado por quem aplica no dia a dia.')
  expect(en.title).toBe('Guided by someone who applies it every day.')
  expect(pt.pillars.items.map((item) => item.title)).toEqual([
    'Engenharia Front-end',
    'Backend e Sistemas Distribuídos',
    'Cloud e Qualidade de Software',
    'IA aplicada ao desenvolvimento',
  ])
  expect(en.pillars.items.map((item) => item.title)).toEqual([
    'Frontend Engineering',
    'Backend and Distributed Systems',
    'Cloud and Software Quality',
    'AI applied to development',
  ])
  expect(pt.cta.whatsappMessage).toBe(
    'Olá, Daniel. Quero saber mais sobre a Trilha.',
  )
  expect(en.cta.whatsappMessage).toBe(
    "Hi, Daniel. I'd like to know more about Trilha.",
  )
})
