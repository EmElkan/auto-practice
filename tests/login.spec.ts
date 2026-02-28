import { test, expect } from '@playwright/test'

test.describe('Login/Logout Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/login')
  })

  test('displays login form when not authenticated', async ({ page }) => {
    await expect(page.getByRole('group', { name: 'Login' })).toBeVisible()
    await expect(page.getByLabel('Username:')).toBeVisible()
    await expect(page.getByLabel('Password:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('shows test credentials hint', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'testuser' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'password123' })).toBeVisible()
  })

  test('successful login with valid credentials', async ({ page }) => {
    await page.getByLabel('Username:').fill('testuser')
    await page.getByLabel('Password:').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()
    await expect(page.getByText('Welcome, testuser!')).toBeVisible()
  })

  test('shows error message with invalid credentials', async ({ page }) => {
    await page.getByLabel('Username:').fill('wronguser')
    await page.getByLabel('Password:').fill('wrongpass')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Invalid username or password')).toBeVisible()
  })

  test('logout functionality', async ({ page }) => {
    // Login first
    await page.getByLabel('Username:').fill('testuser')
    await page.getByLabel('Password:').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()

    // Now logout - use the logout button in the main content area
    await page.getByRole('main').getByRole('button', { name: 'Logout' }).click()

    // Should see login form again
    await expect(page.getByRole('group', { name: 'Login' })).toBeVisible()
  })

  test('shows loading state during login', async ({ page }) => {
    await page.getByLabel('Username:').fill('testuser')
    await page.getByLabel('Password:').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()

    // Loading state appears briefly (500ms delay in mock)
    await expect(page.getByText('Logging in...')).toBeVisible()

    // Then success
    await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()
  })

  test('nav logout button works when authenticated', async ({ page }) => {
    // Login
    await page.getByLabel('Username:').fill('testuser')
    await page.getByLabel('Password:').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()

    // Use nav logout button (in header)
    await page.getByRole('banner').getByRole('button', { name: 'Logout' }).click()

    // Should be logged out
    await expect(page.getByRole('group', { name: 'Login' })).toBeVisible()
  })
})
