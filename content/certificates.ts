import type { CertificatePageData } from '@/lib/content/certificates-schema'

// First name, plus a second token when that token is not da/de/do/dos/das.

const frontexpertUrl = 'https://frontexpert.danieldcs.com/'
const webFullStackUrl =
  'https://www.luiztools.com.br/curso-fullstack?utm_source=danieldcs&utm_medium=link&utm_campaign=alunos'

function certificate(number: string, name: string) {
  return { number, name }
}

export const certificatePageData = {
  title: 'Alunos',
  intro:
    'Nesta página você encontra o número do certificado e aluno que tenha de algum dos meus treinamentos, bootcamp ou evento que eu tenha promovido.',
  groups: [
    {
      id: 'workshop-rag-node',
      title: 'Workshop RAG com Node.js',
      description: [
        'Workshop ao vivo sobre como criar APIs inteligentes com RAG e Node.js.',
      ],
      listLabel: 'Turma 1:',
      certificates: [
        certificate('2.0500.001', 'Higor Monteiro'),
        certificate('2.0500.002', 'Wallace Silva'),
        certificate('2.0500.003', 'Bruna Fraga'),
        certificate('2.0500.004', 'Eduardo Garcia'),
        certificate('2.0500.005', 'Marcelo Sator'),
        certificate('2.0500.006', 'Marcelo Soares'),
        certificate('2.0500.007', 'Maik Broisler'),
        certificate('2.0500.008', 'Hebert Costa'),
        certificate('2.0500.009', 'Marco Ollivier'),
        certificate('2.0500.010', 'Leonardo'),
      ],
    },
    {
      id: 'imersao-frontexpert-2022',
      title: 'Imersão FrontExpert Edição 04/2022',
      description: [
        'Evento realizado em 04/2022 abordando técnicas para desenvolvimento Frontend usando Next.js, React.js, TailwindCSS, CSS, HTML, JavaScript, HeadlessUI e publicação na Vercel.',
      ],
      listLabel: 'Alunos que solicitaram o certificado:',
      certificates: [
        certificate('2.0422.001', 'Felipe Queiroz'),
        certificate('2.0422.002', 'Leandro'),
        certificate('2.0422.003', 'João Vitor'),
        certificate('2.0422.004', 'Filipe Rodrigues'),
        certificate('2.0422.005', 'Jason Antonio'),
        certificate('2.0422.006', 'Ronald Douglas'),
        certificate('2.0422.007', 'Gabriel Bruzadim'),
        certificate('2.0422.008', 'Gustavo'),
        certificate('2.0422.009', 'João Vitor'),
        certificate('2.0422.010', 'Weverson Dias'),
        certificate('2.0422.011', 'André Quintino'),
        certificate('2.0422.012', 'Matheus Leite'),
        certificate('2.0422.013', 'Allison Vinicius'),
        certificate('2.0422.014', 'Gabriel Vitor'),
        certificate('2.0422.015', 'Macsuel Dias'),
      ],
    },
    {
      id: 'frontexpert',
      title: 'FrontExpert',
      description: [
        'Treinamento de especialização em desenvolvimento Frontend, a ementa deste curso pode ser verificada ',
        { label: 'nesta página oficial', href: frontexpertUrl },
        '.',
      ],
      emptyMessage: 'Nenhum aluno concluíu o treinamento até o momento.',
      certificates: [],
    },
    {
      id: 'web-full-stack',
      title: 'Web Full Stack JavaScript',
      description: [
        'Treinamento de desenvolvimento Fullstack com Node.js, React.js, TypeScript, AWS e muitos outros tópicos. A ementa pode ser verificada ',
        { label: 'nesta página oficial', href: webFullStackUrl },
        '. Neste treinamento sou co-autor e responsável por aulas de Frontend e Serverless.',
      ],
      listLabel: 'Alunos que concluíram o curso até este momento:',
      certificates: [
        certificate('1.9.2105.91', 'Lucas Rodrigues'),
        certificate('1.9.2105.130', 'José Luiz'),
        certificate('1.9.2105.203', 'Heitor Gilberti'),
        certificate('1.9.2105.213', 'Edinilson'),
        certificate('1.9.2105.379', 'Arlei Ferreira'),
        certificate('1.9.2105.393', 'Gilberto Junior'),
        certificate('1.9.2105.398', 'Tiago Alves'),
        certificate('1.9.2105.424', 'Yuri Serrano'),
        certificate('1.9.2105.425', 'Augusto Cesar'),
        certificate('1.9.2105.435', 'Sergio Ramalho'),
        certificate('1.9.2105.450', 'Gisele Lapa'),
        certificate('1.9.2105.497', 'Jane Montin'),
        certificate('1.9.2105.519', 'Élder Francisco'),
        certificate('1.9.2105.546', 'Maycon Silva'),
        certificate('1.9.2105.551', 'Hugo Leonardo'),
        certificate('1.9.2105.553', 'Renato Maziero'),
        certificate('1.9.2105.641', 'André Cordeiro'),
        certificate('1.9.2105.649', 'Felipe Dias'),
        certificate('1.9.2105.650', 'Alexandre Delvisio'),
        certificate('1.9.2105.661', 'Eduardo Souza'),
        certificate('1.9.2105.670', 'Jaci Bruno'),
        certificate('1.9.2105.686', 'Mario Salvatierra'),
        certificate('1.9.2105.749', 'Diogo Boegershausen'),
        certificate('1.9.2105.750', 'Thiago Pereira'),
        certificate('1.9.2105.751', 'Wanderson Elias'),
        certificate('1.9.2105.752', 'Marcelo Soares'),
        certificate('1.9.2105.753', 'Clovis'),
        certificate('1.9.2105.754', 'Marcio'),
        certificate('1.9.2105.755', 'Eduardo Carneiro'),
        certificate('1.9.2105.756', 'Rene Ventura'),
        certificate('1.9.2105.757', 'Priscila Cobra'),
        certificate('1.9.2105.758', 'Tiago Marinho'),
        certificate('1.9.2105.759', 'Jorge Paulo'),
        certificate('1.9.2105.760', 'Oteniel Pinto'),
        certificate('1.9.2105.761', 'Carlos Neves'),
        certificate('1.9.2105.762', 'Jose Dias'),
        certificate('1.9.2105.763', 'Estevao Augusto'),
        certificate('1.9.2107.810', 'Guilherme Fausto'),
        certificate('1.9.2111.879', 'Cleano Ferreira'),
      ],
    },
    {
      id: 'react-native-firebase',
      title: 'React Native e Firebase',
      description: [
        'Treinamento de desenvolvimento mobile abordando o uso de React Native CLI com Firebase.',
      ],
      listLabel: 'Alunos que concluíram o curso até este momento:',
      certificates: [
        certificate('4.20.09.001', 'Gilberto Silveira'),
        certificate('4.20.09.002', 'Adriano Arruda'),
        certificate('4.20.09.003', 'Hebert Luiz'),
        certificate('4.20.09.004', 'João Luis'),
        certificate('4.20.09.005', 'Marcelo Soares'),
        certificate('4.20.09.006', 'Marco Hermel'),
        certificate('4.20.09.007', 'Priscila Costa'),
        certificate('4.20.09.008', 'Reginaldo Bernardo'),
        certificate('4.20.09.009', 'Tiago Marinho'),
        certificate('4.20.09.010', 'Carlos Toscano'),
        certificate('1.12.2111.880', 'Paulo Henrique'),
      ],
    },
  ],
} satisfies CertificatePageData
