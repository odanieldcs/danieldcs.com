import { defineConfig, devices } from '@playwright/test'

const deployedBaseURL = process.env.PLAYWRIGHT_BASE_URL

const deployedTestMatch = [
  'redirects.spec.ts',
  'metadata.spec.ts',
  'seo-consistency.spec.ts',
  'feed.spec.ts',
  'not-found.spec.ts',
  'smoke.spec.ts',
]

export default defineConfig(
  deployedBaseURL
    ? {
        testDir: './e2e',
        fullyParallel: true,
        forbidOnly: !!process.env.CI,
        retries: process.env.CI ? 2 : 0,
        reporter: 'list',
        use: {
          baseURL: deployedBaseURL,
          trace: 'on-first-retry',
        },
        projects: [
          {
            name: 'deployed',
            use: { ...devices['Desktop Chrome'] },
            testMatch: deployedTestMatch,
          },
        ],
      }
    : {
        testDir: './e2e',
        fullyParallel: true,
        forbidOnly: !!process.env.CI,
        retries: process.env.CI ? 2 : 0,
        reporter: 'list',
        use: {
          baseURL: 'http://127.0.0.1:3000',
          trace: 'on-first-retry',
        },
        projects: [
          {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            grepInvert: /@mobile|@smoke/,
          },
          {
            name: 'mobile',
            use: { ...devices['Pixel 7'] },
            grep: /@mobile/,
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
            grep: /@smoke/,
          },
        ],
        webServer: {
          command: 'pnpm build && pnpm start',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: !process.env.CI,
        },
      },
)
