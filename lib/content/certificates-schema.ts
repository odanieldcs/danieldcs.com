import { z } from 'zod'

const nameParticles = new Set(['da', 'de', 'do', 'dos', 'das'])

/** First name, plus a second token when it is not a particle. */
export const certificateNameSchema = z
  .string()
  .trim()
  .min(1)
  .superRefine((name, ctx) => {
    const tokens = name.split(/\s+/)

    if (tokens.length > 2) {
      ctx.addIssue('use at most the first and second name')
    }

    const second = tokens[1]
    if (second && nameParticles.has(second.toLocaleLowerCase('pt-BR'))) {
      ctx.addIssue('a name particle is not a second name')
    }
  })

export const certificateNumberSchema = z
  .string()
  .regex(/^\d+(?:\.\d+)+$/, 'certificate number')

const descriptionLinkSchema = z.strictObject({
  label: z.string().min(1),
  href: z.httpUrl(),
})

export const certificateDescriptionSchema = z
  .array(z.union([z.string().min(1), descriptionLinkSchema]))
  .min(1)

const groupFields = {
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: certificateDescriptionSchema,
}

const certificateSchema = z.strictObject({
  number: certificateNumberSchema,
  name: certificateNameSchema,
})

const filledGroupSchema = z.strictObject({
  ...groupFields,
  listLabel: z.string().min(1),
  certificates: z.array(certificateSchema).min(1),
})

const emptyGroupSchema = z.strictObject({
  ...groupFields,
  emptyMessage: z.string().min(1),
  certificates: z.array(certificateSchema).length(0),
})

export const certificateGroupSchema = z.union([
  filledGroupSchema,
  emptyGroupSchema,
])

export const certificatePageSchema = z
  .strictObject({
    title: z.string().min(1),
    intro: z.string().min(1),
    groups: z.array(certificateGroupSchema).min(1),
  })
  .superRefine((page, ctx) => {
    const groupIds = new Set<string>()
    const numbers = new Set<string>()

    for (const group of page.groups) {
      if (groupIds.has(group.id)) {
        ctx.addIssue(`duplicate group id ${group.id}`)
      }
      groupIds.add(group.id)

      for (const certificate of group.certificates) {
        if (numbers.has(certificate.number)) {
          ctx.addIssue(`duplicate certificate number ${certificate.number}`)
        }
        numbers.add(certificate.number)
      }
    }
  })

export type CertificatePageData = z.input<typeof certificatePageSchema>
export type CertificatePage = z.output<typeof certificatePageSchema>
export type CertificateGroup = CertificatePage['groups'][number]
export type CertificateDescription = CertificateGroup['description']
