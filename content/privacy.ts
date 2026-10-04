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
    lastUpdatedLabel: 'Última atualização: 3 de outubro de 2026',
    intro:
      'Esta política descreve como o site danieldcs.com trata informações quando você navega ou entra em contato. Ela reflete o site publicado em outubro de 2026.',
    sections: [
      {
        title: 'Quais dados são coletados',
        paragraphs: [
          'O site novo não utiliza Google Analytics, Meta Pixel nem ferramentas equivalentes. Não coletamos páginas visitadas, tempo de permanência, cliques, tipo de navegador, localidade nem endereço IP para estatísticas.',
          'Não há formulários de newsletter, pesquisas ou downloads no site. Se alguma captura de e-mail, nome ou telefone voltar a existir, esta página será atualizada antes.',
          'Não usamos cookies de anúncios em Facebook, Instagram, Google ou YouTube. A preferência de tema claro ou escuro fica apenas no armazenamento local do seu navegador (via next-themes) e não é enviada ao servidor.',
        ],
      },
      {
        title: 'Como os dados são utilizados',
        paragraphs: [
          'Em nenhuma hipótese seus dados serão compartilhados ou vendidos a terceiros.',
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
    lastUpdatedLabel: 'Last updated: October 3, 2026',
    intro:
      'This policy describes how danieldcs.com handles information when you browse or get in touch. It reflects the site as published in October 2026.',
    sections: [
      {
        title: 'What data is collected',
        paragraphs: [
          'The new site does not use Google Analytics, Meta Pixel, or similar tools. We do not collect pages visited, time on site, clicks, browser type, location, or IP address for analytics.',
          'There are no newsletter forms, surveys, or downloads on the site. If email, name, or phone collection is added again, this page will be updated first.',
          'We do not use advertising cookies on Facebook, Instagram, Google, or YouTube. Light or dark theme preference stays only in your browser local storage (via next-themes) and is not sent to the server.',
        ],
      },
      {
        title: 'How data is used',
        paragraphs: [
          'Your data will never be shared with or sold to third parties.',
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
