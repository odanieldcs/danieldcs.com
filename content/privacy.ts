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
          'Usamos o PostHog para medir o uso do conteúdo e detectar problemas técnicos.',
          'Quando você navega, registramos páginas visitadas (incluindo endereço completo e parâmetros na URL, quando presentes), página de origem, idioma da rota, cliques em links externos e em ações do site que medimos, leitura concluída de posts, métricas de performance e erros. O PostHog também recebe dados técnicos padrão do navegador, como sistema operacional, tipo de dispositivo e tamanho da tela. Cidade e país aproximados vêm do IP no momento do envio; o IP não é armazenado.',
          'Não usamos cookies nem localStorage de analytics (apenas memória), não identificamos você entre visitas, não armazenamos IP nem o que você digita em formulários.',
          'Não há newsletter nem downloads no site; se isso mudar, atualizamos esta página antes.',
          'Não usamos Google Analytics, Meta Pixel nem cookies de anúncios em Facebook, Instagram, Google ou YouTube.',
          'A preferência de tema claro ou escuro fica só no seu navegador, não nos nossos servidores.',
        ],
      },
      {
        title: 'Como os dados são utilizados',
        paragraphs: [
          'Usamos os dados de analytics para entender como o conteúdo é usado e para detectar problemas técnicos. O PostHog processa esses dados em servidores nos Estados Unidos, como prestador de serviço. Não vendemos seus dados nem os compartilhamos com outros terceiros.',
          `Quando você envia um e-mail para ${contactEmail}, usamos o endereço somente para responder à sua mensagem.`,
        ],
      },
      {
        title: 'Remoção de dados',
        paragraphs: [
          'Não conseguimos apagar registros de analytics de uma visita específica, porque não guardamos dados que permitam identificar você entre visitas.',
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
          'We use PostHog to measure content use and detect technical issues.',
          'When you browse, we record pages visited (including the full address and any query parameters), referring page, route language, clicks on external links and on the site\u2019s actions we track, completed post reads, performance metrics, and errors. PostHog also receives default technical data from your browser, such as operating system, device type, and screen size. Approximate city and country come from your IP at send time; the IP is not stored.',
          'We do not use analytics cookies or localStorage (memory only), do not identify you across visits, and do not store IP addresses or what you type into forms.',
          'There is no newsletter or downloads on the site; if that changes, we update this page first.',
          'We do not use Google Analytics, Meta Pixel, or ad cookies on Facebook, Instagram, Google, or YouTube.',
          'Light or dark theme preference stays only in your browser, not on our servers.',
        ],
      },
      {
        title: 'How data is used',
        paragraphs: [
          'We use analytics data to understand how content is used and to detect technical issues. PostHog processes this data on servers in the United States as our service provider. We do not sell your data or share it with any other third parties.',
          `When you email ${contactEmail}, we use your address only to reply to your message.`,
        ],
      },
      {
        title: 'Data removal',
        paragraphs: [
          'We cannot delete analytics records for a specific visit because we do not store data that identifies you across visits.',
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
