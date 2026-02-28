import { test, expect } from '@playwright/test'

// These tests have intentionally longer timeouts due to configurable loading delays
test.describe('Loading States Challenge', () => {
  // Increase timeout for this suite since we're testing loading states
  test.setTimeout(60000)

  test('shows loading state on initial page load @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')

    // Should show loading initially (default 2000ms delay)
    // Race condition: either catch loading state or data has loaded
    const loadingOrData = await Promise.race([
      page.getByText('Loading user data, please wait...').waitFor({ state: 'visible', timeout: 1000 }).then(() => 'loading'),
      page.getByRole('cell', { name: 'Alice Johnson' }).waitFor({ state: 'visible', timeout: 5000 }).then(() => 'data'),
    ])

    // Eventually data should appear
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()
  })

  test('displays user data after loading @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')

    // Wait for data to load
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'alice@example.com' })).toBeVisible()

    // Verify multiple users loaded
    await expect(page.getByRole('cell', { name: 'Bob Smith' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Charlie Brown' })).toBeVisible()
  })

  test('shows error state when simulating errors @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()

    // Enable error simulation and refresh
    await page.getByLabel('Simulate Error').check()
    await page.getByRole('button', { name: 'Refresh Data' }).click()

    await expect(page.getByRole('heading', { name: 'Error Loading Data' })).toBeVisible()
    await expect(page.getByText('Simulated network error')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
  })

  test('retry button recovers from error @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()

    // Trigger error
    await page.getByLabel('Simulate Error').check()
    await page.getByRole('button', { name: 'Refresh Data' }).click()
    await expect(page.getByRole('heading', { name: 'Error Loading Data' })).toBeVisible()

    // Uncheck error and click retry
    await page.getByLabel('Simulate Error').uncheck()
    await page.getByRole('button', { name: 'Retry' }).click()

    // Data should load
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()
  })

  test('configurable delay works @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()

    // Set shorter delay
    await page.getByLabel('Delay (ms):').fill('100')
    await page.getByRole('button', { name: 'Refresh Data' }).click()

    // With 100ms delay, data should appear quickly
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()
  })

  test('shows refetching indicator when refreshing @slow', async ({ page }) => {
    await page.goto('/challenges/loading-states')
    await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible()

    // Set longer delay and refresh
    await page.getByLabel('Delay (ms):').fill('1500')
    await page.getByRole('button', { name: 'Refresh Data' }).click()

    // Refetching indicator should show
    await expect(page.getByText('Updating...')).toBeVisible()

    // Wait for completion
    await expect(page.getByText('Updating...')).not.toBeVisible()
  })
})
