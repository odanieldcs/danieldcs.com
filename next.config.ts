import type { NextConfig } from 'next'
import { flattenRedirects, redirectGroups } from './lib/redirects'

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return flattenRedirects(redirectGroups)
  },
}

export default nextConfig
