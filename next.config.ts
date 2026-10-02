import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    globalNotFound: true,
  },
}

export default nextConfig
