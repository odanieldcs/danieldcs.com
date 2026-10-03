import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: '/blog/o-que-uso-no-dia-a-dia',
        destination: '/blog/ferramentas-apps-e-setup',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
