import { z } from 'zod'

export const postFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string().min(1)).default([]),
  cover: z.string().optional(),
  language: z.enum(['pt', 'en']),
})

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>
