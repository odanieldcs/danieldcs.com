import type { MetadataRoute } from 'next'
import { absoluteSiteUrl } from '@/lib/site'

export function buildRobots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'production') {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: absoluteSiteUrl('/sitemap.xml'),
    }
  }

  return { rules: { userAgent: '*', disallow: '/' } }
}
