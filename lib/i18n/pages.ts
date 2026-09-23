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
}

export type AboutRepertoireGroup = {
  title: string
  description: string
  skills: string[]
}

export type AboutCopy = {
  eyebrow: string
  headline: string
  introParagraphs: string[]
  pillars: string[]
  portraitAlt: string
  portraitCaption: string
  sectionExperienceIndex: string
  experienceTitle: string
  experienceSubtitle: string
  timeline: AboutTimelineEntry[]
  linkedinCta: string
  sectionRepertoireIndex: string
  repertoireTitle: string
  repertoireSubtitle: string
  repertoireGroups: AboutRepertoireGroup[]
  languagesLabel: string
  languagesValue: string
  sectionPersonalIndex: string
  personalTitle: string
  personalParagraph: string
  sectionContactIndex: string
  contactTitle: string
  contactParagraphs: string[]
  contactCta: string
}

// Real copy, aligned with the about reference. Swap the strings here when the text changes.
const aboutCopy: Record<InterfaceLanguage, AboutCopy> = {
  pt: {
    eyebrow: 'Sobre mim',
    headline: 'Entre sistemas e pessoas, construo caminhos mais simples.',
    introParagraphs: [
      'Sou engenheiro de software e gosto de construir sistemas que tornam problemas complexos mais simples. Ao longo da minha carreira, trabalhei entre engenharia, arquitetura, produto e pessoas.',
      'Hoje atuo como Staff Software Engineer na Curebase, construindo software e explorando novas formas de unir engenharia, produto e tecnologia.',
    ],
    pillars: [
      'Software engineering',
      'IA aplicada',
      'Liderança técnica',
      'Ensino',
    ],
    portraitAlt: 'Daniel Castro palestrando no palco, com microfone',
    portraitCaption: 'Tecnologia, aprendizado e troca.',
    sectionExperienceIndex: '01 / Experiência',
    experienceTitle: 'Experiência',
    experienceSubtitle:
      'Alguns dos contextos em que venho construindo software e formando equipes.',
    timeline: [
      {
        period: 'out. 2025 — atual',
        role: 'Staff Software Engineer',
        org: 'Curebase / Estados Unidos · remoto',
      },
      {
        period: 'abr. 2024 — out. 2025',
        role: 'Frontend Team Lead & Architect',
        org: 'Grupo ITSS / Brasil · contrato',
      },
      {
        period: 'abr. 2020 — atual',
        role: 'Software Engineer Consultant & Educator',
        org: 'DDEVs / Brasil · meio período',
      },
      {
        period: 'fev. 2022 — jul. 2023',
        role: 'Senior Full Stack Developer',
        org: 'Bayer / Estados Unidos e Alemanha · contrato',
      },
    ],
    linkedinCta: 'Ver trajetória completa no LinkedIn',
    sectionRepertoireIndex: '02 / Repertório',
    repertoireTitle: 'Como contribuo',
    repertoireSubtitle: 'Uma visão resumida das áreas que conecto no trabalho.',
    repertoireGroups: [
      {
        title: 'Software Engineering',
        description:
          'Software de ponta a ponta, com arquitetura, aplicações escaláveis e sistemas distribuídos.',
        skills: [
          'TypeScript',
          'React & Next.js',
          'Node.js',
          'PostgreSQL',
          'AWS',
          'Arquitetura de software',
        ],
      },
      {
        title: 'Product & AI',
        description:
          'Construção de produtos da ideia à produção, conectando descoberta, engenharia, arquitetura e evolução do produto.',
        skills: [
          'Product thinking',
          'LLM integrations',
          'RAG',
          'AI-assisted development',
          'Descoberta',
          'Engenharia & produto',
        ],
      },
      {
        title: 'Teaching & Community',
        description:
          'Conhecimento compartilhado por meio de aulas, conteúdo e conversas técnicas.',
        skills: [
          'Cursos',
          'Palestras',
          'Mentoria',
          'Conteúdo técnico',
          'Comunidade',
        ],
      },
      {
        title: 'Leadership',
        description:
          'Direção técnica e desenvolvimento de pessoas sem perder a proximidade com o código.',
        skills: [
          'Liderança técnica',
          'Roadmap',
          'Contratação',
          'Mentoria',
          'Planejamento de entregas',
        ],
      },
    ],
    languagesLabel: 'Idiomas',
    languagesValue: 'Português · Inglês',
    sectionPersonalIndex: '03 / Fora da tela',
    personalTitle: 'Corrida como parte da rotina.',
    personalParagraph:
      'Sou corredor amador e treino com regularidade para provas de 10 km e 21 km. É um espaço simples de constância, movimento e cabeça no lugar.',
    sectionContactIndex: '04 / Contato',
    contactTitle: 'Vamos conversar.',
    contactParagraphs: [
      'Posso ajudar em desafios de engenharia, liderança técnica e desenvolvimento de equipes.',
      'Estou aberto a boas conversas, novas oportunidades e colaborações em que minha experiência possa ser útil.',
    ],
    contactCta: 'Entre em contato',
  },
  en: {
    eyebrow: 'About me',
    headline: 'Between systems and people, I build simpler paths.',
    introParagraphs: [
      "I'm a software engineer, and I like building systems that make complex problems simpler. Throughout my career, I've worked across engineering, architecture, product, and people.",
      'Today I work as a Staff Software Engineer at Curebase, building software and exploring new ways to bring engineering, product, and technology together.',
    ],
    pillars: [
      'Software engineering',
      'Applied AI',
      'Technical leadership',
      'Teaching',
    ],
    portraitAlt: 'Daniel Castro speaking on stage, holding a microphone',
    portraitCaption: 'Technology, learning, and exchange.',
    sectionExperienceIndex: '01 / Experience',
    experienceTitle: 'Experience',
    experienceSubtitle:
      'Some of the contexts where I have been building software and growing teams.',
    timeline: [
      {
        period: 'Oct. 2025 — present',
        role: 'Staff Software Engineer',
        org: 'Curebase / United States · remote',
      },
      {
        period: 'Apr. 2024 — Oct. 2025',
        role: 'Frontend Team Lead & Architect',
        org: 'Grupo ITSS / Brazil · contract',
      },
      {
        period: 'Apr. 2020 — present',
        role: 'Software Engineer Consultant & Educator',
        org: 'DDEVs / Brazil · part-time',
      },
      {
        period: 'Feb. 2022 — Jul. 2023',
        role: 'Senior Full Stack Developer',
        org: 'Bayer / United States and Germany · contract',
      },
    ],
    linkedinCta: 'See the full path on LinkedIn',
    sectionRepertoireIndex: '02 / Repertoire',
    repertoireTitle: 'How I contribute',
    repertoireSubtitle: 'A short view of the areas I connect at work.',
    repertoireGroups: [
      {
        title: 'Software Engineering',
        description:
          'End-to-end software, with architecture, scalable applications, and distributed systems.',
        skills: [
          'TypeScript',
          'React & Next.js',
          'Node.js',
          'PostgreSQL',
          'AWS',
          'Software architecture',
        ],
      },
      {
        title: 'Product & AI',
        description:
          'Building products from idea to production, connecting discovery, engineering, architecture, and product evolution.',
        skills: [
          'Product thinking',
          'LLM integrations',
          'RAG',
          'AI-assisted development',
          'Discovery',
          'Engineering & product',
        ],
      },
      {
        title: 'Teaching & Community',
        description:
          'Knowledge shared through classes, content, and technical conversations.',
        skills: [
          'Courses',
          'Talks',
          'Mentoring',
          'Technical content',
          'Community',
        ],
      },
      {
        title: 'Leadership',
        description:
          'Technical direction and people development without losing proximity to the code.',
        skills: [
          'Technical leadership',
          'Roadmap',
          'Hiring',
          'Mentoring',
          'Delivery planning',
        ],
      },
    ],
    languagesLabel: 'Languages',
    languagesValue: 'Portuguese · English',
    sectionPersonalIndex: '03 / Off the screen',
    personalTitle: 'Running as part of the routine.',
    personalParagraph:
      "I'm an amateur runner and I train regularly for 10K and 21K races. It's a simple space for consistency, movement, and a clear head.",
    sectionContactIndex: '04 / Contact',
    contactTitle: "Let's talk.",
    contactParagraphs: [
      'I can help with engineering challenges, technical leadership, and team development.',
      "I'm open to good conversations, new opportunities, and collaborations where my experience can be useful.",
    ],
    contactCta: 'Get in touch',
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
