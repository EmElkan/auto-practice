import { test, expect, login } from './fixtures'

test.describe('Protected Route Challenge', () => {
  test('shows access denied when not logged in', async ({ page }) => {
    await page.goto('/challenges/protected')

    await expect(page.getByRole('heading', { name: 'Access Denied!' })).toBeVisible()
    await expect(page.getByText('You must be logged in')).toBeVisible()
  })

  test('provides link to login page', async ({ page }) => {
    await page.goto('/challenges/protected')

    await page.getByRole('link', { name: /Click here to login/ }).click()

    await expect(page).toHaveURL('/challenges/login')
  })

  // Tests using the authenticatedPage fixture - automatically logged in!
  test('shows protected content when authenticated', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('link', { name: 'Protected' }).click()

    await expect(authenticatedPage.getByRole('heading', { name: 'Welcome to the Secret Area!' })).toBeVisible()
    await expect(authenticatedPage.getByRole('main').getByText('Congratulations, testuser!')).toBeVisible()
  })

  test('displays secret data when authenticated', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('link', { name: 'Protected' }).click()

    await expect(authenticatedPage.getByText('ALPHA-BRAVO-CHARLIE')).toBeVisible()
    await expect(authenticatedPage.getByText('Level 5 - Full Access')).toBeVisible()
    await expect(authenticatedPage.getByRole('cell', { name: 'Active', exact: true })).toBeVisible()
  })

  test('loses access after logout', async ({ authenticatedPage }) => {
    // Navigate to protected page
    await authenticatedPage.getByRole('link', { name: 'Protected' }).click()
    await expect(authenticatedPage.getByRole('heading', { name: 'Welcome to the Secret Area!' })).toBeVisible()

    // Logout via header button
    await authenticatedPage.getByRole('banner').getByRole('button', { name: 'Logout' }).click()

    // Should now see access denied
    await expect(authenticatedPage.getByRole('heading', { name: 'Access Denied!' })).toBeVisible()
  })

  // Alternative: using login helper function directly (more control)
  test('can navigate directly via nav when authenticated', async ({ page }) => {
    // Using the helper function for login
    await login(page)

    // Use nav link
    await page.getByRole('link', { name: 'Protected' }).click()

    await expect(page).toHaveURL('/challenges/protected')
    await expect(page.getByRole('heading', { name: 'Welcome to the Secret Area!' })).toBeVisible()
  })
})
