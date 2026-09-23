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

export type AboutTimelineEntry = {
  period: string
  role: string
  org: string
  description: string
}

export type AboutFact = {
  label: string
  value: string
}

export type AboutCollabChannel = {
  title: string
  description: string
  /** Subject pre-filled on the mailto link. */
  mailSubject: string
}

export type AboutCopy = {
  eyebrow: string
  headline: string
  intro: string
  portraitAlt: string
  pillars: string[]
  timelineTitle: string
  timeline: AboutTimelineEntry[]
  skillsTitle: string
  hardSkillsLabel: string
  hardSkills: string[]
  softSkillsLabel: string
  softSkills: string[]
  personalTitle: string
  personalIntro: string
  personalFacts: AboutFact[]
  collabTitle: string
  collabIntro: string
  collabCta: string
  collabSocialNote: string
  collabChannels: AboutCollabChannel[]
}

// Provisional copy. Timeline orgs/descriptions marked [placeholder], the skill
// lists, and unspecified personal facts are structured stand-ins until Content
// Migration. Swap the strings here when the final text exists.
const aboutCopy: Record<InterfaceLanguage, AboutCopy> = {
  pt: {
    eyebrow: 'Sobre',
    headline: 'Trajetória, ofício e colaboração.',
    intro:
      'Sou Daniel, engenheiro full-stack. Esta página junta a trajetória profissional, o que eu levo para o trabalho e os caminhos para construir algo juntos.',
    portraitAlt: 'Daniel Castro palestrando no palco, com microfone',
    pillars: [
      'Engenheiro de software',
      'Builder',
      'Educador',
      'Palestrante',
      'Corredor',
    ],
    timelineTitle: 'Trajetória profissional',
    timeline: [
      {
        period: 'Atual',
        role: 'Engenheiro de software',
        org: '[placeholder]',
        description:
          '[placeholder] Produtos digitais de ponta a ponta, da ideia ao que está no ar.',
      },
      {
        period: '[placeholder]',
        role: 'Educador',
        org: '[placeholder]',
        description:
          '[placeholder] Ensino, turmas e acompanhamento de quem está aprendendo.',
      },
      {
        period: '[placeholder]',
        role: 'Palestrante',
        org: '[placeholder]',
        description:
          '[placeholder] Palestras em eventos e conversas com times.',
      },
      {
        period: '[placeholder]',
        role: 'Builder',
        org: '[placeholder]',
        description: '[placeholder] Projetos independentes e experimentos.',
      },
    ],
    skillsTitle: 'Habilidades',
    hardSkillsLabel: 'Habilidades técnicas',
    hardSkills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Engenharia de produto',
    ],
    softSkillsLabel: 'Habilidades interpessoais',
    softSkills: [
      'Comunicação',
      'Mentoria',
      'Didática',
      'Colaboração',
      'Constância',
    ],
    personalTitle: 'Pessoal',
    personalIntro:
      'O trabalho não é o retrato inteiro. Correr longas distâncias é parte de como eu sustento constância — o resto desta seção ainda está em aberto.',
    personalFacts: [
      { label: 'Base', value: 'Gravataí, Brasil' },
      { label: 'Corrida', value: 'Longas distâncias' },
      { label: 'Interesses', value: '[placeholder]' },
    ],
    collabTitle: 'Colaboração',
    collabIntro: 'Escolha um caminho. O assunto do e-mail já vem preenchido.',
    collabCta: 'Escrever',
    collabSocialNote:
      'Se preferir as redes, LinkedIn, GitHub, YouTube e Instagram estão no rodapé.',
    collabChannels: [
      {
        title: 'Consultoria',
        description: 'Apoio pontual em produto, arquitetura e entrega.',
        mailSubject: 'Consultoria',
      },
      {
        title: 'Mentoria',
        description:
          'Acompanhamento para quem está construindo carreira ou produto.',
        mailSubject: 'Mentoria',
      },
      {
        title: 'Palestras',
        description: 'Conversas para times, comunidades e eventos.',
        mailSubject: 'Palestra',
      },
      {
        title: 'Workshops',
        description: 'Sessões práticas, com mão na massa.',
        mailSubject: 'Workshop',
      },
      {
        title: 'Colaborações',
        description: 'Projetos, conteúdo e parcerias.',
        mailSubject: 'Colaboração',
      },
      {
        title: 'Oportunidades profissionais',
        description: 'Vagas e convites para trabalhar juntos.',
        mailSubject: 'Oportunidade profissional',
      },
    ],
  },
  en: {
    eyebrow: 'About',
    headline: 'Path, craft, and collaboration.',
    intro:
      "I'm Daniel, a full-stack engineer. This page gathers the professional path, what I bring to the work, and the ways to build something together.",
    portraitAlt: 'Daniel Castro speaking on stage, holding a microphone',
    pillars: ['Software Engineer', 'Builder', 'Educator', 'Speaker', 'Runner'],
    timelineTitle: 'Professional path',
    timeline: [
      {
        period: 'Now',
        role: 'Software engineer',
        org: '[placeholder]',
        description:
          '[placeholder] Digital products end to end, from the idea to what is live.',
      },
      {
        period: '[placeholder]',
        role: 'Educator',
        org: '[placeholder]',
        description:
          '[placeholder] Teaching, cohorts, and support for people who are learning.',
      },
      {
        period: '[placeholder]',
        role: 'Speaker',
        org: '[placeholder]',
        description:
          '[placeholder] Talks at events and conversations with teams.',
      },
      {
        period: '[placeholder]',
        role: 'Builder',
        org: '[placeholder]',
        description: '[placeholder] Independent projects and experiments.',
      },
    ],
    skillsTitle: 'Skills',
    hardSkillsLabel: 'Hard skills',
    hardSkills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Product engineering',
    ],
    softSkillsLabel: 'Soft skills',
    softSkills: [
      'Communication',
      'Mentoring',
      'Teaching',
      'Collaboration',
      'Consistency',
    ],
    personalTitle: 'Personal',
    personalIntro:
      'The work is not the whole picture. Running long distances is part of how I keep consistency — the rest of this section is still open.',
    personalFacts: [
      { label: 'Based in', value: 'Gravataí, Brazil' },
      { label: 'Running', value: 'Long distances' },
      { label: 'Interests', value: '[placeholder]' },
    ],
    collabTitle: 'Collaboration',
    collabIntro: 'Pick a path. The email subject is already filled in.',
    collabCta: 'Write',
    collabSocialNote:
      'If you prefer social channels, LinkedIn, GitHub, YouTube, and Instagram are in the footer.',
    collabChannels: [
      {
        title: 'Consulting',
        description: 'Focused help on product, architecture, and delivery.',
        mailSubject: 'Consulting',
      },
      {
        title: 'Mentoring',
        description: 'Guidance for people building a career or a product.',
        mailSubject: 'Mentoring',
      },
      {
        title: 'Talks',
        description: 'Conversations for teams, communities, and events.',
        mailSubject: 'Talk',
      },
      {
        title: 'Workshops',
        description: 'Hands-on sessions with room to practice.',
        mailSubject: 'Workshop',
      },
      {
        title: 'Collaborations',
        description: 'Projects, writing, and partnerships.',
        mailSubject: 'Collaboration',
      },
      {
        title: 'Professional opportunities',
        description: 'Roles and invitations to work together.',
        mailSubject: 'Professional opportunity',
      },
    ],
  },
}

export function getHomeCopy(lang: InterfaceLanguage): HomeCopy {
  return homeCopy[lang]
}

export function getAboutCopy(lang: InterfaceLanguage): AboutCopy {
  return aboutCopy[lang]
}

export function getTrilhaCopy(lang: InterfaceLanguage): TrilhaCopy {
  return trilhaCopy[lang]
}
