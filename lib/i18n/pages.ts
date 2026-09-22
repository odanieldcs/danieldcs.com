import type { InterfaceLanguage } from './types'

export type HomeHighlight = {
  label: string
  description: string
}

export type HomeCopy = {
  /** Three roles, above the headline. */
  eyebrow: string
  /** Provisional positioning. Swap the string here when the line is final. */
  headline: string
  intro: string
  highlights: HomeHighlight[]
  portraitAlt: string
  recentEyebrow: string
  recentTitle: string
  readArticle: string
  trilhaEyebrow: string
  trilhaHeading: string
  trilhaDescription: string
  trilhaCta: string
}

export type TrilhaCopy = {
  title: string
  description: string
}

// Provisional copy. The headline can change without touching the layout.
// ENG-94 replaces the Trilha placeholder page; this band does not claim it is ready.
const homeCopy: Record<InterfaceLanguage, HomeCopy> = {
  pt: {
    eyebrow: 'Engenheiro · Builder · Corredor',
    headline: 'Construindo Produtos em Softwares e correndo longas distâncias.',
    intro:
      'Sou Daniel, engenheiro full-stack. Desenho, construo e faço crescer produtos digitais — e quando não estou codando, estou em movimento.',
    highlights: [
      {
        label: 'Engenheiro Full-Stack',
        description:
          'Produtos e sistemas de ponta a ponta, com clareza técnica e atenção aos detalhes.',
      },
      {
        label: 'Builder',
        description:
          'Da ideia ao que está no ar, priorizando o que gera valor e aprendizado mais cedo.',
      },
      {
        label: 'Corredor',
        description:
          'Treino e constância fora da tela — disciplina que também levo para o trabalho.',
      },
    ],
    portraitAlt: 'Retrato de Daniel Castro na Golden Gate',
    recentEyebrow: 'Notas de engenharia',
    recentTitle: 'Escrita recente',
    readArticle: 'Ler artigo',
    trilhaEyebrow: 'A Trilha',
    trilhaHeading: 'Um caminho de estudo e prática.',
    trilhaDescription:
      'Acompanho e organizo o que estudo, construo e descubro pelo caminho — com método, constância e espaço para experimentar.',
    trilhaCta: 'Ver a Trilha',
  },
  en: {
    eyebrow: 'Engineer · Builder · Runner',
    headline: 'Building software products and running long distances.',
    intro:
      "I'm Daniel, a full-stack engineer. I design, build, and grow digital products — and when I'm not coding, I'm out moving.",
    highlights: [
      {
        label: 'Full-Stack Engineer',
        description:
          'Products and systems end to end, with technical clarity and attention to detail.',
      },
      {
        label: 'Builder',
        description:
          'From the idea to what is live, prioritizing what creates value and learning sooner.',
      },
      {
        label: 'Runner',
        description:
          'Training and consistency away from the screen — discipline I carry into the work.',
      },
    ],
    portraitAlt: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    recentEyebrow: 'Engineering notes',
    recentTitle: 'Recent writing',
    readArticle: 'Read article',
    trilhaEyebrow: 'The Trilha',
    trilhaHeading: 'A path of study and practice.',
    trilhaDescription:
      'I keep track of what I study, build, and find along the way — with method, consistency, and room to experiment.',
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
