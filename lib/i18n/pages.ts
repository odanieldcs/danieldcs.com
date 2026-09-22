import type { InterfaceLanguage } from './types'

export type HomeCopy = {
  /** Provisional positioning, shown as the hero eyebrow. */
  eyebrow: string
  intro: string
  recentTitle: string
  trilhaHeading: string
  trilhaDescription: string
  trilhaCta: string
}

export type TrilhaCopy = {
  title: string
  description: string
}

// Provisional copy. Wording can evolve; ENG-94 replaces the Trilha placeholder.
const homeCopy: Record<InterfaceLanguage, HomeCopy> = {
  pt: {
    eyebrow: 'Software Engineer & Builder',
    intro:
      'Construo produtos e sistemas de software de ponta a ponta e escrevo sobre o que aprendo no caminho.',
    recentTitle: 'Escrita recente',
    trilhaHeading: 'Trilha',
    trilhaDescription:
      'Um caminho de estudo e prática. A página completa chega em seguida.',
    trilhaCta: 'Ver a Trilha',
  },
  en: {
    eyebrow: 'Software Engineer & Builder',
    intro:
      'I build software products and systems end to end, and write about what I learn along the way.',
    recentTitle: 'Recent writing',
    trilhaHeading: 'Trilha',
    trilhaDescription:
      'A path of study and practice. The full page is coming next.',
    trilhaCta: 'See the Trilha',
  },
}

const trilhaCopy: Record<InterfaceLanguage, TrilhaCopy> = {
  pt: {
    title: 'Trilha',
    description:
      'Esta página é provisória. O conteúdo da Trilha chega em breve.',
  },
  en: {
    title: 'Trilha',
    description:
      'This page is a placeholder. The Trilha content is coming soon.',
  },
}

export function getHomeCopy(lang: InterfaceLanguage): HomeCopy {
  return homeCopy[lang]
}

export function getTrilhaCopy(lang: InterfaceLanguage): TrilhaCopy {
  return trilhaCopy[lang]
}
