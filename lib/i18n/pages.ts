import type { InterfaceLanguage } from './types'

export type HomeHighlight = {
  label: string
  description: string
}

export type HomeCopy = {
  /** Role line under the name, beside the portrait. */
  eyebrow: string
  intro: string
  /** Provisional positioning, shown below the hero. */
  highlights: HomeHighlight[]
  portraitAlt: string
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
    highlights: [
      {
        label: 'Engenheiro Full-Stack',
        description: 'Produtos e sistemas de ponta a ponta.',
      },
      {
        label: 'Builder',
        description: 'Da ideia ao que está no ar.',
      },
      {
        label: 'Corredor',
        description: 'Treino e constância fora da tela.',
      },
    ],
    portraitAlt: 'Retrato de Daniel Castro na Golden Gate',
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
    highlights: [
      {
        label: 'Full-Stack Engineer',
        description: 'Products and systems end to end.',
      },
      {
        label: 'Builder',
        description: 'From the idea to what is in production.',
      },
      {
        label: 'Runner',
        description: 'Training and consistency away from the screen.',
      },
    ],
    portraitAlt: 'Portrait of Daniel Castro at the Golden Gate Bridge',
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
