import { test as base, expect, Page } from '@playwright/test'

// Test credentials
export const TEST_USER = {
  username: 'testuser',
  password: 'password123',
}

// Helper function to clear localStorage for consistent test state
export async function clearStorage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('has-seen-hints', 'true') // Hide hints by default in tests
  })
}

// Helper function to login (can be used standalone)
export async function login(page: Page, username = TEST_USER.username, password = TEST_USER.password) {
  await clearStorage(page)
  await page.goto('/challenges/login')
  await page.getByLabel('Username:').fill(username)
  await page.getByLabel('Password:').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()
}

// Extended test with custom fixtures
export const test = base.extend<{
  authenticatedPage: Page
}>({
  // Fixture that provides a page already logged in
  authenticatedPage: async ({ page }, use) => {
    await login(page)
    await use(page)
  },
})

export { expect }
