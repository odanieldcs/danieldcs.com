import { expect, test } from 'vitest'
import { z } from 'zod'
import {
  certificateNameSchema,
  certificatePageSchema,
} from './certificates-schema'

const description = ['Descrição do grupo.']

test.each(['Leonardo', 'João Vitor', 'Higor Monteiro', 'Jaci Bruno'])(
  'accepts %s',
  (name) => {
    expect(certificateNameSchema.parse(name)).toBe(name)
  },
)

test('rejects a third name token', () => {
  const result = certificateNameSchema.safeParse('Jaci Bruno Santana')

  expect(result.success).toBe(false)
})

test.each([
  'Leandro da',
  'Marcio dos',
  'Gustavo de',
  'Edinilson do',
  'Ana das',
])('rejects the particle in %s', (name) => {
  const result = certificateNameSchema.safeParse(name)

  expect(result.success).toBe(false)
})

test('rejects a duplicate certificate number', () => {
  const result = certificatePageSchema.safeParse({
    title: 'Alunos',
    intro: 'Introdução.',
    groups: [
      {
        id: 'one',
        title: 'Um',
        description,
        listLabel: 'Lista:',
        certificates: [
          { number: '1.1', name: 'Ana' },
          { number: '1.1', name: 'Bia' },
        ],
      },
    ],
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error).toBeInstanceOf(z.ZodError)
  }
})
