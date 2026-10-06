import type { InterfaceLanguage } from '@/lib/i18n/types'
import { contactEmail } from '@/lib/site'

export type PrivacySection = {
  title: string
  paragraphs: string[]
}

export type PrivacyPageContent = {
  title: string
  lastUpdatedLabel: string
  intro: string
  sections: PrivacySection[]
}

const privacyContent: Record<InterfaceLanguage, PrivacyPageContent> = {
  pt: {
    title: 'Política de Privacidade',
    lastUpdatedLabel: 'Última atualização: 6 de outubro de 2026',
    intro:
      'Como o danieldcs.com trata informações quando você navega ou entra em contato.',
    sections: [
      {
        title: 'Quais dados são coletados',
        paragraphs: [
          'Usamos PostHog (US Cloud) para medir uso do conteúdo e detectar problemas técnicos.',
          'Coletamos páginas visitadas (idioma da rota, sem parâmetros na URL), cliques em links externos e em ações do site que medimos, leitura concluída de posts, métricas de performance e erros. Cidade e país aproximados vêm do IP no envio; o IP não é armazenado.',
          'Não usamos cookies nem localStorage de analytics (só memória), não identificamos você entre visitas e não guardamos IP nem conteúdo de formulários. Não há newsletter nem downloads; se isso mudar, atualizamos esta página antes.',
          'Sem Google Analytics, Meta Pixel ou cookies de anúncios em Facebook, Instagram, Google ou YouTube. Tema claro ou escuro fica só no seu navegador (next-themes), não no servidor.',
        ],
      },
      {
        title: 'Como os dados são utilizados',
        paragraphs: [
          'PostHog processa os dados de analytics. Não vendemos nem compartilhamos seus dados com terceiros.',
          `Quando você envia um e-mail para ${contactEmail}, usamos o endereço somente para responder à sua mensagem.`,
        ],
      },
      {
        title: 'Remoção de dados',
        paragraphs: [
          `Se você entrou em contato por e-mail e deseja que a conversa seja apagada, envie um pedido para ${contactEmail}. Atenderemos o quanto antes.`,
        ],
      },
      {
        title: 'Ajuda',
        paragraphs: [
          `Se você não encontrou a informação que procura ou precisa relatar um problema, escreva para ${contactEmail}.`,
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdatedLabel: 'Last updated: October 6, 2026',
    intro:
      'How danieldcs.com handles information when you browse or get in touch.',
    sections: [
      {
        title: 'What data is collected',
        paragraphs: [
          'We use PostHog (US Cloud) to measure content use and detect technical issues.',
          'We collect pages visited (route language, no query strings in the URL), clicks on external links and on site actions we track, completed post reads, performance metrics, and errors. Approximate city and country come from your IP at send time; the IP is not stored.',
          'We do not use analytics cookies or localStorage (memory only), do not identify you across visits, and do not store IP addresses or form contents. There is no newsletter or downloads; if that changes, we update this page first.',
          'No Google Analytics, Meta Pixel, or ad cookies on Facebook, Instagram, Google, or YouTube. Light or dark theme stays only in your browser (next-themes), not on the server.',
        ],
      },
      {
        title: 'How data is used',
        paragraphs: [
          'PostHog processes analytics data. We do not sell or share your data with third parties.',
          `When you email ${contactEmail}, we use your address only to reply to your message.`,
        ],
      },
      {
        title: 'Data removal',
        paragraphs: [
          `If you contacted us by email and want the conversation deleted, send a request to ${contactEmail}. We will respond as soon as we can.`,
        ],
      },
      {
        title: 'Help',
        paragraphs: [
          `If you could not find what you need or want to report a problem, write to ${contactEmail}.`,
        ],
      },
    ],
  },
}

export function getPrivacyContent(
  language: InterfaceLanguage,
): PrivacyPageContent {
  return privacyContent[language]
}
