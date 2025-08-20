import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s.object({
    title: s.string().max(99), 
    publishedAt: s.isodate(),
    cover: s.string().optional(),
    coverCaption: s.string().optional(),
    metadata: s.metadata(),
    language: s.string().max(2).optional(),
    
    slug: s.slug('post'),
    content: s.mdx()
  })
  .transform(data => ({ ...data, permalink: `/blog/${data.slug}`}))
})

const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s.object({
    title: s.string().max(99),
    description: s.string().max(255).optional(),
    publishedAt: s.isodate(),
    metadata: s.metadata().optional(),
    slug: s.slug('global'),
    body: s.mdx(),
  })
  .transform(data => ({ ...data, permalink: `/${data.slug}`}))
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: true,
  },
  collections: { posts, pages },
})