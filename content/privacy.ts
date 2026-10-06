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
      'Esta política descreve como o site danieldcs.com trata informações quando você navega ou entra em contato. Ela reflete o site publicado em outubro de 2026.',
    sections: [
      {
        title: 'Quais dados são coletados',
        paragraphs: [
          'Em produção, quando a chave de analytics está configurada, usamos o PostHog (US Cloud) para entender o uso do conteúdo e detectar problemas técnicos. O analytics só roda quando o ambiente é produção e a chave existe; em desenvolvimento, preview e uso local não há coleta.',
          'Coletamos: páginas visitadas (idioma da rota, sem URL completa com parâmetros); cliques em links externos e em botões ou links catalogados do site; leitura até o fim de posts do blog; e métricas de performance e erros técnicos conforme a configuração do PostHog. A localização aproximada (cidade e país) é inferida do endereço IP no momento da coleta; o IP não é armazenado (descarte configurado no projeto US Cloud).',
          'Não coletamos: cookies ou localStorage de analytics (persistência apenas em memória); identificação entre visitas ou perfil persistente; armazenamento do endereço IP; texto digitado em campos ou conteúdo de formulários. Não há newsletter, pesquisas ou downloads no site; se captura de e-mail, nome ou telefone voltar a existir, esta página será atualizada antes.',
          'Não utilizamos Google Analytics, Meta Pixel nem ferramentas equivalentes de anúncios. Não usamos cookies de anúncios em Facebook, Instagram, Google ou YouTube. A preferência de tema claro ou escuro fica apenas no armazenamento local do seu navegador (via next-themes) e não é enviada ao servidor.',
        ],
      },
      {
        title: 'Como os dados são utilizados',
        paragraphs: [
          'Os dados de analytics são processados pelo PostHog para as finalidades descritas acima. Em nenhuma hipótese seus dados serão compartilhados ou vendidos a terceiros.',
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
      'This policy describes how danieldcs.com handles information when you browse or get in touch. It reflects the site as published in October 2026.',
    sections: [
      {
        title: 'What data is collected',
        paragraphs: [
          'In production, when the analytics key is configured, we use PostHog (US Cloud) to understand how content is used and to detect technical issues. Analytics runs only in production when the key is set; there is no collection in development, preview, or local use.',
          'We collect: pages visited (route language, not full URLs with query strings); clicks on external links and on catalogued site buttons or links; read-to-end on blog posts; and performance metrics and technical errors as configured in PostHog. Approximate location (city and country) is inferred from your IP address at collection time; the IP is not stored (discard configured on the US Cloud project).',
          'We do not collect: analytics cookies or localStorage (persistence is memory-only); cross-visit identity or a persistent profile; stored IP addresses; text typed in fields or form contents. There are no newsletter forms, surveys, or downloads on the site; if email, name, or phone collection is added again, this page will be updated first.',
          'We do not use Google Analytics, Meta Pixel, or similar ad tools. We do not use advertising cookies on Facebook, Instagram, Google, or YouTube. Light or dark theme preference stays only in your browser local storage (via next-themes) and is not sent to the server.',
        ],
      },
      {
        title: 'How data is used',
        paragraphs: [
          'Analytics data is processed by PostHog for the purposes above. Your data will never be shared with or sold to third parties.',
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
