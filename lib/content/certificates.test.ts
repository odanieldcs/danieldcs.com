import { expect, test } from 'vitest'
import { certificatePageData } from '@/content/certificates'
import { getAlternates, localizedPages } from '@/lib/i18n/alternates'
import { certificatePage } from './certificates'

const nameParticles = ['da', 'de', 'do', 'dos', 'das']

const issuedCertificates = [
  ['2.0500.001', 'Higor Monteiro'],
  ['2.0500.002', 'Wallace Silva'],
  ['2.0500.003', 'Bruna Fraga'],
  ['2.0500.004', 'Eduardo Garcia'],
  ['2.0500.005', 'Marcelo Sator'],
  ['2.0500.006', 'Marcelo Soares'],
  ['2.0500.007', 'Maik Broisler'],
  ['2.0500.008', 'Hebert Costa'],
  ['2.0500.009', 'Marco Ollivier'],
  ['2.0500.010', 'Leonardo'],
  ['2.0422.001', 'Felipe Queiroz'],
  ['2.0422.002', 'Leandro'],
  ['2.0422.003', 'João Vitor'],
  ['2.0422.004', 'Filipe Rodrigues'],
  ['2.0422.005', 'Jason Antonio'],
  ['2.0422.006', 'Ronald Douglas'],
  ['2.0422.007', 'Gabriel Bruzadim'],
  ['2.0422.008', 'Gustavo'],
  ['2.0422.009', 'João Vitor'],
  ['2.0422.010', 'Weverson Dias'],
  ['2.0422.011', 'André Quintino'],
  ['2.0422.012', 'Matheus Leite'],
  ['2.0422.013', 'Allison Vinicius'],
  ['2.0422.014', 'Gabriel Vitor'],
  ['2.0422.015', 'Macsuel Dias'],
  ['1.9.2105.91', 'Lucas Rodrigues'],
  ['1.9.2105.130', 'José Luiz'],
  ['1.9.2105.203', 'Heitor Gilberti'],
  ['1.9.2105.213', 'Edinilson'],
  ['1.9.2105.379', 'Arlei Ferreira'],
  ['1.9.2105.393', 'Gilberto Junior'],
  ['1.9.2105.398', 'Tiago Alves'],
  ['1.9.2105.424', 'Yuri Serrano'],
  ['1.9.2105.425', 'Augusto Cesar'],
  ['1.9.2105.435', 'Sergio Ramalho'],
  ['1.9.2105.450', 'Gisele Lapa'],
  ['1.9.2105.497', 'Jane Montin'],
  ['1.9.2105.519', 'Élder Francisco'],
  ['1.9.2105.546', 'Maycon Silva'],
  ['1.9.2105.551', 'Hugo Leonardo'],
  ['1.9.2105.553', 'Renato Maziero'],
  ['1.9.2105.641', 'André Cordeiro'],
  ['1.9.2105.649', 'Felipe Dias'],
  ['1.9.2105.650', 'Alexandre Delvisio'],
  ['1.9.2105.661', 'Eduardo Souza'],
  ['1.9.2105.670', 'Jaci Bruno'],
  ['1.9.2105.686', 'Mario Salvatierra'],
  ['1.9.2105.749', 'Diogo Boegershausen'],
  ['1.9.2105.750', 'Thiago Pereira'],
  ['1.9.2105.751', 'Wanderson Elias'],
  ['1.9.2105.752', 'Marcelo Soares'],
  ['1.9.2105.753', 'Clovis'],
  ['1.9.2105.754', 'Marcio'],
  ['1.9.2105.755', 'Eduardo Carneiro'],
  ['1.9.2105.756', 'Rene Ventura'],
  ['1.9.2105.757', 'Priscila Cobra'],
  ['1.9.2105.758', 'Tiago Marinho'],
  ['1.9.2105.759', 'Jorge Paulo'],
  ['1.9.2105.760', 'Oteniel Pinto'],
  ['1.9.2105.761', 'Carlos Neves'],
  ['1.9.2105.762', 'Jose Dias'],
  ['1.9.2105.763', 'Estevao Augusto'],
  ['1.9.2107.810', 'Guilherme Fausto'],
  ['1.9.2111.879', 'Cleano Ferreira'],
  ['4.20.09.001', 'Gilberto Silveira'],
  ['4.20.09.002', 'Adriano Arruda'],
  ['4.20.09.003', 'Hebert Luiz'],
  ['4.20.09.004', 'João Luis'],
  ['4.20.09.005', 'Marcelo Soares'],
  ['4.20.09.006', 'Marco Hermel'],
  ['4.20.09.007', 'Priscila Costa'],
  ['4.20.09.008', 'Reginaldo Bernardo'],
  ['4.20.09.009', 'Tiago Marinho'],
  ['4.20.09.010', 'Carlos Toscano'],
  ['1.12.2111.880', 'Paulo Henrique'],
] as const

test('keeps every numbered certificate and the published name', () => {
  const published = certificatePage.groups.flatMap((group) =>
    group.certificates.map(
      (certificate) => [certificate.number, certificate.name] as const,
    ),
  )

  expect(published).toEqual([...issuedCertificates])
  expect(published).toHaveLength(75)
})

test('stores at most two name tokens and no particle', () => {
  for (const group of certificatePage.groups) {
    for (const certificate of group.certificates) {
      const tokens = certificate.name.split(' ')

      expect(tokens.length).toBeLessThanOrEqual(2)
      expect(nameParticles).not.toContain(tokens[1]?.toLocaleLowerCase('pt-BR'))
    }
  }
})

test('omits the certificate without a number and dropped surnames', () => {
  const serialized = JSON.stringify(certificatePageData)

  expect(serialized).not.toContain('André Quintino Pereira')
  expect(serialized).not.toContain('Santana')
  expect(serialized).not.toContain('Lira')
  expect(serialized).not.toContain('Leandro da')
  expect(serialized).toContain('André Quintino')
  expect(serialized).toContain('Jaci Bruno')
  expect(serialized).toContain('Jose Dias')
})

test('keeps the current groups, including the empty FrontExpert list', () => {
  expect(certificatePage.groups.map((group) => group.title)).toEqual([
    'Workshop RAG com Node.js',
    'Imersão FrontExpert Edição 04/2022',
    'FrontExpert',
    'Web Full Stack JavaScript',
    'React Native e Firebase',
  ])

  const frontexpert = certificatePage.groups[2]
  expect(frontexpert?.certificates).toEqual([])
  expect(frontexpert && 'emptyMessage' in frontexpert).toBe(true)
  if (frontexpert && 'emptyMessage' in frontexpert) {
    expect(frontexpert.emptyMessage).toBe(
      'Nenhum aluno concluíu o treinamento até o momento.',
    )
  }

  const description = JSON.stringify(
    certificatePage.groups.map((group) => group.description),
  )
  expect(description).toContain('https://frontexpert.danieldcs.com/')
  expect(description).toContain(
    'https://www.luiztools.com.br/curso-fullstack?utm_source=danieldcs&utm_medium=link&utm_campaign=alunos',
  )
})

test('stays outside localized pages so it does not gain hreflang', () => {
  const paths: string[] = localizedPages.flatMap((page) => [page.pt, page.en])

  expect(paths).not.toContain('/alunos')
  expect(getAlternates('/alunos')).toEqual({ canonical: '/alunos' })
})
