import { z } from 'zod'

export const communityEntryTypes = [
  'talk',
  'workshop',
  'event',
  'other',
] as const

export type CommunityEntryType = (typeof communityEntryTypes)[number]

const coverFilename = z
  .string()
  .min(1)
  .refine((value) => !value.includes('/') && !value.includes('\\'), {
    message: 'cover must be a filename',
  })

export const communityFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  type: z.enum(communityEntryTypes),
  language: z.enum(['pt', 'en']),
  eventName: z.string().min(1).optional(),
  link: z.httpUrl().optional(),
  cover: coverFilename.optional(),
})

export type CommunityFrontmatter = z.infer<typeof communityFrontmatterSchema>
