import { contactEmail } from '@/lib/site'

export type PrivacySection = {
  title: string
  paragraphs: string[]
}

export const privacyPage = {
  title: 'Política de Privacidade',
  seoDescription:
    'Como o danieldcs.com trata dados pessoais, cookies e contato.',
  lastUpdated: '3 de outubro de 2026',
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
  ] as const satisfies PrivacySection[],
} as const
