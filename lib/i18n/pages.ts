import type { CommunityEntryType } from '@/lib/content/community-schema'
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

export type TrilhaPillar = {
  index: string
  title: string
  description: string
}

export type TrilhaCopy = {
  eyebrow: string
  title: string
  paragraph: string
  pillars: {
    index: string
    title: string
    intro: string
    items: TrilhaPillar[]
  }
  building: {
    label: string
    title: string
    body: string
    personalization: string
  }
  cta: {
    eyebrow: string
    title: string
    line: string
    button: string
    whatsappMessage: string
  }
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
    eyebrow: 'A Trilha · Em construção',
    title: 'Aprendizado guiado por quem aplica no dia a dia.',
    paragraph:
      'Um único espaço para reunir anos de aprendizados e organizar diferentes caminhos de aprendizagem em engenharia de software.',
    pillars: {
      index: '01 / Conteúdo',
      title: 'Pilares da Trilha.',
      intro:
        'Uma base que conecta fundamentos, decisões de engenharia e prática — do desenvolvimento de interfaces à construção de sistemas.',
      items: [
        {
          index: '01',
          title: 'Engenharia Front-end',
          description:
            'Funcionamentos web, TypeScript, React e Next.js, arquitetura de interfaces, estado, dados, testes, acessibilidade, SEO e performance.',
        },
        {
          index: '02',
          title: 'Backend e Sistemas Distribuídos',
          description:
            'Node.js, APIs, SQL, cache, microsserviços, DDD, Clean Architecture, padrões de projeto e comunicação entre serviços.',
        },
        {
          index: '03',
          title: 'Cloud e Qualidade de Software',
          description:
            'Testes automatizados, Docker, integração e entrega contínuas, AWS, segurança e observabilidade.',
        },
        {
          index: '04',
          title: 'IA aplicada ao desenvolvimento',
          description:
            'LLM integrations, RAG, processamento de documentos, embeddings, bancos vetoriais, busca semântica, APIs com contexto, harness e AI-Driven Development.',
        },
      ],
    },
    building: {
      label: 'Em construção',
      title: 'Menos conteúdo solto. Mais clareza para avançar com propósito.',
      body: 'Quatro cursos e anos de experiência reunidos em uma única Trilha guiada, do fundamento aos desafios mais avançados.',
      personalization:
        'O caminho poderá ser explorado de acordo com o interesse e o nível de senioridade de cada pessoa.',
    },
    cta: {
      eyebrow: 'Quero acompanhar',
      title: 'Saiba quando a Trilha estiver pronta.',
      line: 'Deixe uma mensagem para receber as próximas novidades sobre a Trilha.',
      button: 'Falar no WhatsApp',
      whatsappMessage: 'Olá, Daniel. Quero saber mais sobre a Trilha.',
    },
  },
  en: {
    eyebrow: 'The Trilha · In progress',
    title: 'Learning guided by someone who applies it every day.',
    paragraph:
      'One place to gather years of learning and organize different paths for learning software engineering.',
    pillars: {
      index: '01 / Content',
      title: 'Pillars of the Trilha.',
      intro:
        'A foundation that connects fundamentals, engineering decisions, and practice — from building interfaces to building systems.',
      items: [
        {
          index: '01',
          title: 'Frontend Engineering',
          description:
            'How the web works, TypeScript, React and Next.js, interface architecture, state, data, testing, accessibility, SEO, and performance.',
        },
        {
          index: '02',
          title: 'Backend and Distributed Systems',
          description:
            'Node.js, APIs, SQL, caching, microservices, DDD, Clean Architecture, design patterns, and communication between services.',
        },
        {
          index: '03',
          title: 'Cloud and Software Quality',
          description:
            'Automated tests, Docker, continuous integration and delivery, AWS, security, and observability.',
        },
        {
          index: '04',
          title: 'AI applied to development',
          description:
            'LLM integrations, RAG, document processing, embeddings, vector databases, semantic search, context-aware APIs, harness, and AI-Driven Development.',
        },
      ],
    },
    building: {
      label: 'In progress',
      title: 'Less loose content. More clarity to move forward with purpose.',
      body: 'Four courses and years of experience gathered into one guided Trilha, from the fundamentals to the most advanced challenges.',
      personalization:
        "The path can be explored according to each person's interest and level of seniority.",
    },
    cta: {
      eyebrow: 'I want to follow along',
      title: 'Know when the Trilha is ready.',
      line: 'Leave a message to hear the next updates about the Trilha.',
      button: 'Message on WhatsApp',
      whatsappMessage: "Hi, Daniel. I'd like to know more about Trilha.",
    },
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
    headline: 'Construindo e compartilhando, de Dev para Dev.',
    introParagraphs: [
      'Sou engenheiro de software e gosto de construir sistemas que tornam problemas complexos mais simples. Ao longo da minha carreira, trabalhei entre engenharia, arquitetura, produto e pessoas.',
      'Hoje atuo como Staff Software Engineer na Curebase, construindo software e explorando novas formas de unir engenharia, produto e tecnologia.',
    ],
    pillars: [
      'Software Engineering',
      'IA aplicada',
      'Liderança técnica',
      'Ensino',
    ],
    portraitAlt:
      'Daniel Castro palestrando no palco do TDC Floripa em 2026, com microfone',
    portraitCaption: 'Tecnologia, aprendizado e troca.',
    sectionExperienceIndex: '01 / Experiência',
    experienceTitle: 'Experiência',
    experienceSubtitle:
      'Alguns dos contextos em que venho entregando software.',
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
    headline: 'Building and sharing, from dev to dev.',
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
    portraitAlt:
      'Daniel Castro speaking on stage at TDC Floripa in 2026, holding a microphone',
    portraitCaption: 'Technology, learning, and exchange.',
    sectionExperienceIndex: '01 / Experience',
    experienceTitle: 'Experience',
    experienceSubtitle:
      'Some of the contexts where I have been delivering software.',
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

export type CommunityCopy = {
  eyebrow: string
  title: string
  intro: string
  empty: string
  yearLabel: string
  viewLabel: string
  viewList: string
  viewGrid: string
  types: Record<CommunityEntryType, string>
}

const communityCopy: Record<InterfaceLanguage, CommunityCopy> = {
  pt: {
    eyebrow: 'Comunidade',
    title: 'Palestras, workshops e encontros.',
    intro: 'Um registro simples das participações, em ordem cronológica.',
    empty: 'Nenhuma participação publicada ainda.',
    yearLabel: 'Ano',
    viewLabel: 'Formato',
    viewList: 'Lista',
    viewGrid: 'Grade',
    types: {
      talk: 'Palestra',
      workshop: 'Workshop',
      event: 'Evento',
      other: 'Outro',
    },
  },
  en: {
    eyebrow: 'Community',
    title: 'Talks, workshops, and gatherings.',
    intro: 'A simple record of participations, in chronological order.',
    empty: 'No participations published yet.',
    yearLabel: 'Year',
    viewLabel: 'Layout',
    viewList: 'List',
    viewGrid: 'Grid',
    types: {
      talk: 'Talk',
      workshop: 'Workshop',
      event: 'Event',
      other: 'Other',
    },
  },
}

export function getHomeCopy(lang: InterfaceLanguage): HomeCopy {
  return homeCopy[lang]
}

export function getCommunityCopy(lang: InterfaceLanguage): CommunityCopy {
  return communityCopy[lang]
}

export type BlogCopy = {
  eyebrow: string
  title: string
  intro: string
  empty: string
  viewLabel: string
  viewList: string
  viewGrid: string
  paginationLabel: string
  paginationPrevious: string
  paginationNext: string
}

const blogCopy: Record<InterfaceLanguage, BlogCopy> = {
  pt: {
    eyebrow: 'Blog',
    title: 'Artigos e notas de engenharia.',
    intro: 'Textos sobre código, produto e o ofício de construir software.',
    empty: 'Nenhum artigo publicado ainda.',
    viewLabel: 'Formato',
    viewList: 'Lista',
    viewGrid: 'Grade',
    paginationLabel: 'Paginação',
    paginationPrevious: 'Anterior',
    paginationNext: 'Próxima',
  },
  en: {
    eyebrow: 'Writing',
    title: 'Articles and engineering notes.',
    intro: 'Essays on code, product, and the craft of building software.',
    empty: 'No articles published yet.',
    viewLabel: 'Layout',
    viewList: 'List',
    viewGrid: 'Grid',
    paginationLabel: 'Pagination',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
  },
}

export function getBlogCopy(lang: InterfaceLanguage): BlogCopy {
  return blogCopy[lang]
}

export function getAboutCopy(lang: InterfaceLanguage): AboutCopy {
  return aboutCopy[lang]
}

export function getTrilhaCopy(lang: InterfaceLanguage): TrilhaCopy {
  return trilhaCopy[lang]
}
