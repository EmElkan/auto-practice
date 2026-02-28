import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration following best practices
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI for stability
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: process.env.CI ? 'github' : 'html',

  // Global timeout configuration (avoid hardcoded timeouts in tests)
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:5173',

    // Collect trace on first retry (helps debug failures)
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure (useful for debugging)
    video: 'retain-on-failure',

    // Action timeout (clicking, filling, etc.)
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 15000,

    // Set storage state to hide test hints by default for consistent tests
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            { name: 'has-seen-hints', value: 'true' },
          ],
        },
      ],
    },
  },

  // Configure projects for multiple browsers
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports (optional - uncomment to enable)
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start server
  },
})
