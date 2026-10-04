export type RedirectGroup = {
  to: string | null
  permanent: boolean
  note?: string
  from: readonly string[]
}

export type NextRedirect = {
  source: string
  destination: string
  permanent: boolean
}

export function flattenRedirects(
  groups: readonly RedirectGroup[],
): NextRedirect[] {
  const redirects: NextRedirect[] = []

  for (const group of groups) {
    if (group.to == null || group.to === '' || group.to === 'TODO') {
      continue
    }
    if (group.from.length === 0) {
      continue
    }
    for (const source of group.from) {
      redirects.push({
        source,
        destination: group.to,
        permanent: group.permanent,
      })
    }
  }

  return redirects
}

export const redirectGroups: readonly RedirectGroup[] = [
  // --- Posts (40 WordPress groups; old slugs in the same group) ---
  {
    to: '/blog/7-boas-praticas-para-logs-de-aplicacoes',
    permanent: true,
    from: ['/7-boas-praticas-para-logs-de-aplicacoes{/}?'],
  },
  {
    to: '/blog/consolidacao-e-crescimento-resumo-de-2024',
    permanent: true,
    from: ['/consolidacao-e-crescimento-resumo-de-2024{/}?'],
  },
  {
    to: '/blog/onde-encontrar-vagas-remota-no-exterior-usd-eur',
    permanent: true,
    from: [
      '/onde-encontrar-vagas-remota-no-exterior-usd-eur{/}?',
      '/onde-encontrar-vagas-remota-no-exterior-usd-%f0%9f%a4%91{/}?',
    ],
  },
  {
    to: '/blog/um-ano-de-mudancas-resumao-2023',
    permanent: true,
    from: ['/um-ano-de-mudancas-resumao-2023{/}?'],
  },
  {
    to: '/blog/postgresql-e-pgadmin-com-docker-compose',
    permanent: true,
    from: ['/postgresql-e-pgadmin-com-docker-compose{/}?'],
  },
  {
    to: '/blog/docker-introducao-e-primeiros-passos-para-devs',
    permanent: true,
    from: ['/docker-introducao-e-primeiros-passos-para-devs{/}?'],
  },
  {
    to: '/blog/o-resumo-do-meu-2022',
    permanent: true,
    from: ['/o-resumo-do-meu-2022{/}?'],
  },
  {
    to: '/blog/como-usar-pm2-com-node-js-em-producao',
    permanent: true,
    from: ['/como-usar-pm2-com-node-js-em-producao{/}?'],
  },
  {
    to: '/blog/reactjs-para-iniciantes',
    permanent: true,
    from: [
      '/reactjs-para-iniciantes{/}?',
      '/react-para-iniciantes-em-2022{/}?',
    ],
  },
  {
    to: '/blog/tags-html5-que-voce-precisa-conhecer',
    permanent: true,
    from: ['/tags-html5-que-voce-precisa-conhecer{/}?'],
  },
  {
    to: '/blog/melhores-extensoes-para-vs-code',
    permanent: true,
    from: ['/melhores-extensoes-para-vs-code{/}?'],
  },
  {
    to: '/blog/css-flexbox-guia-pratico',
    permanent: true,
    from: ['/css-flexbox-guia-pratico{/}?'],
  },
  {
    to: '/blog/16-livros-para-desenvolvedores-ler-em-2022',
    permanent: true,
    from: [
      '/16-livros-para-desenvolvedores-ler-em-2022{/}?',
      '/14-livros-para-desenvolvedores-ler-em-2022{/}?',
      '/15-livros-para-desenvolvedores-ler-em-2022{/}?',
    ],
  },
  {
    to: '/blog/perguntas-sobre-javascript-mais-comuns-em-entrevistas',
    permanent: true,
    from: ['/perguntas-sobre-javascript-mais-comuns-em-entrevistas{/}?'],
  },
  {
    to: '/blog/como-criar-um-aplicativo-com-react-native-e-expo',
    permanent: true,
    from: ['/como-criar-um-aplicativo-com-react-native-e-expo{/}?'],
  },
  {
    to: '/blog/introducao-e-como-usar-o-tailwind-css',
    permanent: true,
    from: ['/introducao-e-como-usar-o-tailwind-css{/}?'],
  },
  {
    to: '/blog/instalando-multiplas-versoes-do-nodejs-com-nvm',
    permanent: true,
    from: [
      '/instalando-multiplas-versoes-do-nodejs-com-nvm{/}?',
      '/nvm-instale-multiplas-versoes-do-nodejs{/}?',
      '/instalando-versoes-do-nodejs-com-nvm{/}?',
    ],
  },
  {
    to: '/blog/principais-comandos-git-para-dominar-parte-2',
    permanent: true,
    from: [
      '/principais-comandos-git-para-dominar-parte-2{/}?',
      '/principais-comandos-git-para-voce-dominar-parte-2{/}?',
    ],
  },
  {
    to: '/blog/principais-comandos-git-para-dominar-parte-1',
    permanent: true,
    from: [
      '/principais-comandos-git-para-dominar-parte-1{/}?',
      '/os-principais-comandos-git-para-voce-dominar-parte-1{/}?',
      '/osprincipais-comandos-git-para-voce-dominar-parte-1{/}?',
      '/principais-comandos-git-para-voce-dominar-parte-1{/}?',
    ],
  },
  {
    to: '/blog/eslint-prettier-e-githooks-com-husky-em-react-js',
    permanent: true,
    from: [
      '/eslint-prettier-e-githooks-com-husky-em-react-js{/}?',
      '/configurando-eslint-prettier-e-githooks-em-react-js{/}?',
    ],
  },
  {
    to: '/blog/metodos-para-manipular-arrays-em-javascript',
    permanent: true,
    from: ['/metodos-para-manipular-arrays-em-javascript{/}?'],
  },
  {
    to: '/blog/clean-code-com-javascript',
    permanent: true,
    from: [
      '/clean-code-com-javascript{/}?',
      '/clean-code-aplicado-em-javascript{/}?',
    ],
  },
  {
    to: '/blog/tratamento-de-erros-e-excecoes-em-javascript',
    permanent: true,
    from: ['/tratamento-de-erros-e-excecoes-em-javascript{/}?'],
  },
  {
    to: '/blog/desestruturacao-de-arrays-em-javascript',
    permanent: true,
    from: ['/desestruturacao-de-arrays-em-javascript{/}?'],
  },
  {
    to: '/blog/desestruturacao-de-objetos-em-javascript',
    permanent: true,
    from: ['/desestruturacao-de-objetos-em-javascript{/}?'],
  },
  {
    to: '/blog/simulando-aws-local-com-localstack-e-node-js',
    permanent: true,
    from: ['/simulando-aws-local-com-localstack-e-node-js{/}?'],
  },
  {
    to: '/blog/configurando-path-mapping-no-react-native-typescript',
    permanent: true,
    from: ['/configurando-path-mapping-no-react-native-typescript{/}?'],
  },
  {
    to: '/blog/configurando-node-js-com-typescript-nodemon-e-jest',
    permanent: true,
    from: ['/configurando-node-js-com-typescript-nodemon-e-jest{/}?'],
  },
  {
    to: '/blog/dicas-avancadas-de-typescript-que-voce-precisa-conhecer',
    permanent: true,
    from: ['/dicas-avancadas-de-typescript-que-voce-precisa-conhecer{/}?'],
  },
  {
    to: '/blog/motivos-para-usar-typescript-em-projetos-javascript',
    permanent: true,
    from: ['/motivos-para-usar-typescript-em-projetos-javascript{/}?'],
  },
  {
    to: '/blog/boas-praticas-para-api-em-node-js',
    permanent: true,
    from: [
      '/boas-praticas-para-api-em-node-js{/}?',
      '/boas-praticas-no-desenvolvimento-de-api-em-node-js{/}?',
    ],
  },
  {
    to: '/blog/como-usar-babeljs-em-producao',
    permanent: true,
    from: ['/como-usar-babeljs-em-producao{/}?'],
  },
  {
    to: '/blog/usando-variaveis-de-ambiente-em-nodejs',
    permanent: true,
    from: ['/usando-variaveis-de-ambiente-em-nodejs{/}?'],
  },
  {
    to: '/blog/como-enviar-sms-em-nodejs-com-sns-aws',
    permanent: true,
    from: [
      '/como-enviar-sms-em-nodejs-com-sns-aws{/}?',
      '/como-enviar-sms-com-nodejs-sns-aws{/}?',
    ],
  },
  {
    to: '/blog/aprenda-a-diferenca-entre-const-let-e-var-em-javascript',
    permanent: true,
    from: [
      '/aprenda-a-diferenca-entre-const-let-e-var-em-javascript{/}?',
      '/aprenda-a-diferenca-entre-const-let-e-var-em-nodejs{/}?',
    ],
  },
  {
    to: '/blog/construindo-um-web-scraping-em-nodejs',
    permanent: true,
    from: ['/construindo-um-web-scraping-em-nodejs{/}?'],
  },
  {
    to: '/blog/alterando-a-rota-encerrando-um-ciclo',
    permanent: true,
    from: [
      '/alterando-a-rota-encerrando-um-ciclo{/}?',
      '/alterando-a-rota-novos-rumos{/}?',
      '/alterando-a-rota-novos-rumos-na-carreira{/}?',
      '/alterando-a-rota-mudanca-na-carreira{/}?',
    ],
  },
  {
    to: '/blog/versionamento-de-software-na-pratica',
    permanent: true,
    from: ['/versionamento-de-software-na-pratica{/}?'],
  },
  {
    to: '/blog/proposito-de-uma-startup',
    permanent: true,
    from: ['/proposito-de-uma-startup{/}?', '/proposito-da-sua-startup{/}?'],
  },
  {
    to: '/blog/meu-blog-profissional',
    permanent: true,
    from: [
      '/meu-blog-profissional{/}?',
      '/ola-mundo{/}?',
      '/o-primeiro-passo{/}?',
      '/o-primeiro-post{/}?',
    ],
  },

  // --- Pages (308) ---
  {
    to: '/about',
    permanent: true,
    from: ['/sobre{/}?', '/contato{/}?'],
  },
  {
    to: '/blog/guia-desenvolvedor-frontend',
    permanent: true,
    from: ['/guia-desenvolvedor-frontend{/}?'],
  },
  {
    to: '/blog/livros-recomendados',
    permanent: true,
    from: ['/livros-recomendados{/}?'],
  },
  {
    to: '/blog/ferramentas-apps-e-setup',
    permanent: true,
    from: ['/setup{/}?'],
  },
  {
    to: '/privacy',
    permanent: true,
    from: ['/politica-de-privacidade{/}?'],
  },
  {
    to: '/alunos',
    permanent: true,
    from: ['/alunos/'],
  },

  // --- WordPress Files (308) ---
  {
    to: '/blog',
    permanent: true,
    from: ['/page/:n'],
  },
  {
    to: '/blog',
    permanent: true,
    from: ['/categoria/:path*'],
  },
  {
    to: '/blog',
    permanent: true,
    from: ['/tag/:path*'],
  },
  {
    to: '/about',
    permanent: true,
    from: ['/author/daniel/:path*'],
  },

  // --- Temporary (307) ---
  {
    to: '/about?origin=cursos',
    permanent: false,
    from: ['/cursos{/}?'],
  },
  {
    to: '/about?origin=webfs',
    permanent: false,
    from: ['/curso-comunidade-web-full-stack{/}?', '/webfs{/}?'],
  },
  {
    to: '/',
    permanent: false,
    note: 'eventos encerrados',
    from: ['/semana-ddev{/}?', '/odt24{/}?'],
  },

  // --- Short links (307) ---
  {
    to: 'https://www.youtube.com/c/odanieldcs',
    permanent: false,
    from: ['/youtube{/}?', '/live{/}?'],
  },
  {
    to: 'https://t.me/odanieldcs',
    permanent: false,
    from: ['/telegram{/}?'],
  },
  {
    to: 'https://discord.com/invite/gce4RSzhTC',
    permanent: false,
    from: ['/discord{/}?'],
  },
  {
    to: 'https://linktr.ee/danielcsrs',
    permanent: false,
    from: ['/links{/}?'],
  },
  {
    to: 'https://www.instagram.com/odanieldcs',
    permanent: false,
    note: 'pendente',
    from: ['/instagram{/}?'],
  },
  {
    to: 'https://www.tiktok.com/@odanieldcs',
    permanent: false,
    note: 'pendente',
    from: ['/tiktok{/}?'],
  },
  {
    to: 'https://www.linkedin.com/in/odanieldcs',
    permanent: false,
    note: 'pendente',
    from: ['/linkedin{/}?'],
  },

  // --- Pretty Links (307) --- add `to: null, permanent: false, from: ['/go/slug{/}?']` for new slugs ---
  {
    to: '/',
    permanent: false,
    from: [],
  },
]
