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
  intro: string[]
  aboutCta: string
  highlights: HomeHighlight[]
  portraitAlt: string
  portraitCaption: string
  recentEyebrow: string
  recentTitle: string
  readArticle: string
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
const homeCopy: Record<InterfaceLanguage, HomeCopy> = {
  pt: {
    eyebrow: 'Engenheiro · Builder · Corredor',
    headline: 'Criando e compartilhando, de Dev para Dev.',
    intro: [
      'Olá, me chamo Daniel, sou um desenvolvedor full-stack.',
      'Planejo, crio e torno softwares mais acessíveis no dia a dia. Acredito que a tecnologia pode e deve ser usada para melhorar a vida das pessoas. Quando não estou codando, estou em movimento.',
    ],
    aboutCta: 'Saber mais',
    highlights: [
      {
        label: 'Engenheiro Full-Stack',
        description:
          'Sistemas de ponta a ponta, com clareza técnica, arquitetura modular, segurança e foco em UX.',
      },
      {
        label: 'Builder',
        description:
          'Do conceito ao deploy, priorizando o que gera valor e aprendizado mais cedo. Sempre orientado por métricas.',
      },
      {
        label: 'Corredor',
        description:
          'Apaixonado por corrida. Treino e constância fora da tela. A disciplina que levo para vida.',
      },
    ],
    portraitAlt:
      'Daniel Castro palestrando no palco do TDC Floripa em 2026, com microfone',
    portraitCaption: 'Tecnologia, aprendizado e troca.',
    recentEyebrow: 'Notas de engenharia',
    recentTitle: 'Escrita recente',
    readArticle: 'Ler artigo',
  },
  en: {
    eyebrow: 'Engineer · Builder · Runner',
    headline: 'Creating and sharing, from dev to dev.',
    intro: [
      "Hi, I'm Daniel, a full-stack developer.",
      "I plan, build, and make software more accessible in everyday life. I believe technology can and should be used to improve people's lives. When I'm not coding, I'm out moving.",
    ],
    aboutCta: 'Learn more',
    highlights: [
      {
        label: 'Full-Stack Engineer',
        description:
          'End-to-end systems, with technical clarity, modular architecture, security, and a focus on UX.',
      },
      {
        label: 'Builder',
        description:
          'From concept to deploy, prioritizing what creates value and learning sooner. Always guided by metrics.',
      },
      {
        label: 'Runner',
        description:
          'Passionate about running. Training and consistency away from the screen. The discipline I carry into life.',
      },
    ],
    portraitAlt:
      'Daniel Castro speaking on stage at TDC Floripa in 2026, holding a microphone',
    portraitCaption: 'Technology, learning, and exchange.',
    recentEyebrow: 'Engineering notes',
    recentTitle: 'Recent writing',
    readArticle: 'Read article',
  },
}

const trilhaCopy: Record<InterfaceLanguage, TrilhaCopy> = {
  pt: {
    eyebrow: 'A Trilha · Em construção',
    title: 'Guiado por quem aplica no dia a dia.',
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
    title: 'Guided by someone who applies it every day.',
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
  blogCta: string
  pillars: string[]
  portraitAlt: string
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
  stackLabel: string
  stackValue: string
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
    headline: 'Entre código, produto e pessoas.',
    introParagraphs: [
      'Olá, me chamo Daniel Castro e sou engenheiro de software. Trabalho com programação desde 2005 e, ao longo desse tempo, passei por diferentes contextos entre engenharia, arquitetura, liderança técnica, produto e ensino.',
      'Sempre gostei de entender problemas complexos, encontrar formas de otimizar processos e criar soluções que facilitem a vida das pessoas com tecnologia.',
      'Atuar como Engenheiro de Software, desenvolvendo aplicações e sistemas para a web, explorando novas formas de aproximar engenharia, produto e métricas, agora com IA acelerando processos para melhorar a vida das pessoas é algo que tem feito minha jornada gratificante.',
      'Compartilhar também é parte do que sou. Ensinar, escrever, palestrar, participar de comunidades e orientar pessoas em diferentes momentos da carreira é algo que me faz feliz.',
      'Fora do código, sou casado com uma mulher incrível, pai de uma menina linda, pai de pets e corredor amador.',
      'Neste site reúno um pouco de tudo isso: textos, experiências, projetos e experimentos. Mais do que um portfólio, é um lugar para registrar o caminho enquanto continuo aprendendo e construindo.',
    ],
    blogCta: 'Ler o blog',
    pillars: [
      'Software Engineering',
      'AI-Assisted Development',
      'Liderança técnica',
      'Ensino',
    ],
    portraitAlt: 'Retrato de Daniel Castro na Golden Gate',
    sectionExperienceIndex: '01 / Experiência',
    experienceTitle: 'Experiência',
    experienceSubtitle:
      'Alguns dos contextos em que venho entregando software.',
    timeline: [
      {
        period: 'abr. 2020 — atual',
        role: 'Software Engineer Consultant & Educator',
        org: 'DDEVs / Brasil · meio período',
      },
      {
        period: 'out. 2025 — set. 2026',
        role: 'Staff Software Engineer',
        org: 'Curebase / Estados Unidos · remoto · contrato',
      },
      {
        period: 'abr. 2024 — out. 2025',
        role: 'Frontend Team Lead & Architect',
        org: 'Grupo ITSS / Brasil · remoto · contrato',
      },
      {
        period: 'fev. 2022 — jul. 2023',
        role: 'Senior Full Stack Developer',
        org: 'Bayer / Estados Unidos e Alemanha · remoto · contrato',
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
          'AWS & Vercel',
          'Arquitetura',
        ],
      },
      {
        title: 'AI Engineering',
        description:
          'Integração de IA ao software, conectando LLMs, dados, ferramentas e processos de desenvolvimento.',
        skills: [
          'LLM integrations',
          'RAG',
          'AI SDKs',
          'AI-assisted development',
          'Harness engineering',
        ],
      },
      {
        title: 'Product',
        description:
          'Da descoberta à entrega, conectando problemas, produto, engenharia e resultados.',
        skills: [
          'Discovery',
          'MVPs',
          'Métricas',
          'Roadmap',
          'Planejamento',
          'Product thinking',
        ],
      },
      {
        title: 'Teaching',
        description:
          'Conhecimento compartilhado por meio de conteúdo, aulas e conversas técnicas.',
        skills: ['Conteúdo', 'Palestras', 'Mentoria', 'Cursos'],
      },
    ],
    languagesLabel: 'Idiomas',
    languagesValue: 'Português · Inglês',
    stackLabel: 'Stack Principal',
    stackValue:
      'TypeScript · React · Next.js · Node.js · C# · Python · PostgreSQL · Drizzle/Prisma · GraphQL · AWS · Vercel · Docker',
    sectionPersonalIndex: '03 / Fora da tela',
    personalTitle: 'Corrida como parte da rotina.',
    personalParagraph:
      'Sou corredor amador que pegou o gosto por meia-maratonas. Entre treinos e provas, encontrei na corrida uma forma de cuidar da saúde, desenvolver disciplina e encontrar um pouco de equilíbrio no meio da rotina.',
    sectionContactIndex: '04 / Contato',
    contactTitle: 'Vamos conversar.',
    contactParagraphs: [
      'Ajudo em desafios de engenharia.',
      'Estou aberto a boas conversas e disposto a colaborar onde minha experiência possa ser útil, seja numa conversa, palestra, mentoria ou treinamento estruturado.',
    ],
    contactCta: 'Entre em contato',
  },
  en: {
    eyebrow: 'About me',
    headline: 'Between code, product and people.',
    introParagraphs: [
      "Hi, my name is Daniel Castro and I'm a software engineer. I've been programming since 2005 and, over that time, I've worked across engineering, architecture, technical leadership, product, and teaching.",
      "I've always liked understanding complex problems, finding ways to streamline processes, and creating solutions that make people's lives easier with technology.",
      "Working as a software engineer, building web applications and systems, exploring new ways to bring engineering, product, and metrics closer together, now with AI speeding up processes to improve people's lives, is something that has made my journey rewarding.",
      'Sharing is also part of who I am. Teaching, writing, speaking, taking part in communities, and guiding people at different moments in their careers is something that makes me happy.',
      "Away from the code, I'm married to an incredible woman, father of a beautiful girl, a pet dad, and an amateur runner.",
      "On this site I gather a bit of all of that: writing, experiences, projects, and experiments. More than a portfolio, it's a place to record the path while I keep learning and building.",
    ],
    blogCta: 'Read the blog',
    pillars: [
      'Software Engineering',
      'AI-Assisted Development',
      'Technical leadership',
      'Teaching',
    ],
    portraitAlt: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    sectionExperienceIndex: '01 / Experience',
    experienceTitle: 'Experience',
    experienceSubtitle:
      'Some of the contexts where I have been delivering software.',
    timeline: [
      {
        period: 'Apr. 2020 — present',
        role: 'Software Engineer Consultant & Educator',
        org: 'DDEVs / Brazil · part-time',
      },
      {
        period: 'Oct. 2025 — Sep. 2026',
        role: 'Staff Software Engineer',
        org: 'Curebase / United States · remote · contract',
      },
      {
        period: 'Apr. 2024 — Oct. 2025',
        role: 'Frontend Team Lead & Architect',
        org: 'Grupo ITSS / Brazil · remote · contract',
      },
      {
        period: 'Feb. 2022 — Jul. 2023',
        role: 'Senior Full Stack Developer',
        org: 'Bayer / United States and Germany · remote · contract',
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
          'AWS & Vercel',
          'Architecture',
        ],
      },
      {
        title: 'AI Engineering',
        description:
          'Bringing AI into software, connecting LLMs, data, tools, and development processes.',
        skills: [
          'LLM integrations',
          'RAG',
          'AI SDKs',
          'AI-assisted development',
          'Harness engineering',
        ],
      },
      {
        title: 'Product',
        description:
          'From discovery to delivery, connecting problems, product, engineering, and results.',
        skills: [
          'Discovery',
          'MVPs',
          'Metrics',
          'Roadmap',
          'Planning',
          'Product thinking',
        ],
      },
      {
        title: 'Teaching',
        description:
          'Knowledge shared through content, classes, and technical conversations.',
        skills: ['Content', 'Talks', 'Mentoring', 'Courses'],
      },
    ],
    languagesLabel: 'Languages',
    languagesValue: 'Portuguese · English',
    stackLabel: 'Main stack',
    stackValue:
      'TypeScript · React · Next.js · Node.js · C# · Python · PostgreSQL · Drizzle/Prisma · GraphQL · AWS · Vercel · Docker',
    sectionPersonalIndex: '03 / Off the screen',
    personalTitle: 'Running as part of the routine.',
    personalParagraph:
      "I'm an amateur runner who got a taste for half marathons. Between training and races, I found in running a way to look after my health, build discipline, and find a bit of balance in the routine.",
    sectionContactIndex: '04 / Contact',
    contactTitle: "Let's talk.",
    contactParagraphs: [
      'I help with engineering challenges.',
      "I'm open to good conversations and willing to collaborate where my experience can be useful, whether in a conversation, a talk, mentoring, or structured training.",
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
    intro:
      'Um breve registro das minhas contribuições nas comunidades. Experiências compartilhadas de Dev para Dev.',
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
    intro:
      'A short record of my contributions in communities. Experiences shared from dev to dev.',
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
    title: 'Aprendizados e ideias.',
    intro: 'Um espaço para registrar meus conteúdos técnicos ou não.',
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
    title: 'Learnings and ideas.',
    intro: 'A space to record my content, technical or not.',
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
