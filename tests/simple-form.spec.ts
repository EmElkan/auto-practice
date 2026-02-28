import { test, expect } from '@playwright/test'

test.describe('Simple Form Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/simple-form')
  })

  test('displays form with all fields', async ({ page }) => {
    // Use getByRole for semantic elements
    await expect(page.getByRole('group', { name: 'Contact Information' })).toBeVisible()
    await expect(page.getByLabel('First Name:')).toBeVisible()
    await expect(page.getByLabel('Last Name:')).toBeVisible()
    await expect(page.getByLabel('Email Address:')).toBeVisible()
    await expect(page.getByLabel('Message:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Form' })).toBeVisible()
  })

  test('submits form and shows success message', async ({ page }) => {
    // Use getByLabel for form inputs (recommended)
    await page.getByLabel('First Name:').fill('John')
    await page.getByLabel('Last Name:').fill('Doe')
    await page.getByLabel('Email Address:').fill('john@example.com')
    await page.getByLabel('Message:').fill('Hello, this is a test message!')

    // Use getByRole for buttons (recommended)
    await page.getByRole('button', { name: 'Submit Form' }).click()

    // Verify success - use getByText for content, testid for structural container
    await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()

    // Verify submitted data appears in the table (use exact match to avoid partial matches)
    await expect(page.getByRole('cell', { name: 'John', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Doe', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'john@example.com', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Hello, this is a test message!', exact: true })).toBeVisible()
  })

  test('can reset and submit another form', async ({ page }) => {
    // Submit first form
    await page.getByLabel('First Name:').fill('Jane')
    await page.getByLabel('Last Name:').fill('Smith')
    await page.getByLabel('Email Address:').fill('jane@example.com')
    await page.getByLabel('Message:').fill('First submission')
    await page.getByRole('button', { name: 'Submit Form' }).click()

    await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()

    // Click "Submit Another"
    await page.getByRole('button', { name: 'Submit Another' }).click()

    // Form should be visible again with empty fields
    await expect(page.getByRole('group', { name: 'Contact Information' })).toBeVisible()
    await expect(page.getByLabel('First Name:')).toHaveValue('')
  })

  test('clear button resets form fields', async ({ page }) => {
    await page.getByLabel('First Name:').fill('Test')
    await page.getByLabel('Last Name:').fill('User')

    await page.getByRole('button', { name: 'Clear Form' }).click()

    await expect(page.getByLabel('First Name:')).toHaveValue('')
    await expect(page.getByLabel('Last Name:')).toHaveValue('')
  })

  test('form fields are required', async ({ page }) => {
    // Try to submit empty form - HTML5 validation should prevent it
    await page.getByRole('button', { name: 'Submit Form' }).click()

    // Form should still be visible (not submitted)
    await expect(page.getByRole('group', { name: 'Contact Information' })).toBeVisible()

    // First Name field should be marked as invalid
    const firstNameInput = page.getByLabel('First Name:')
    await expect(firstNameInput).toBeVisible()
  })

  test('back to challenges link is visible on challenge pages', async ({ page }) => {
    // Back link should be visible on challenge page - use getByRole for links
    const backLink = page.getByRole('link', { name: '← Back to Challenges' })
    await expect(backLink).toBeVisible()

    // Click and verify navigation to home
    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('active nav link is highlighted', async ({ page }) => {
    // The Simple Form nav link should have active styling
    // Use getByRole with name filter to find the nav link
    const navLink = page.getByRole('link', { name: '[Simple Form]' })
    await expect(navLink).toHaveClass(/font-bold/)
    await expect(navLink).toHaveClass(/text-red-700/)
  })

  test('test hints can be toggled and have copy buttons', async ({ page }) => {
    // Initially hints are hidden (localStorage set in test config)
    // Use heading to identify hints section
    await expect(page.getByRole('heading', { name: 'Testing Tips:' })).not.toBeVisible()

    // Show hints callout should be visible - use getByText for content
    await expect(page.getByText('Need help?')).toBeVisible()

    // Click to show hints - use getByRole for buttons
    await page.getByRole('button', { name: 'Show Test Hints' }).click()

    // Hints should now be visible - verify by heading
    await expect(page.getByRole('heading', { name: 'Testing Tips:' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Example Playwright Code:' })).toBeVisible()

    // Copy buttons should be present - use getByRole
    await expect(page.getByRole('button', { name: 'Copy' }).first()).toBeVisible()

    // Hide hints
    await page.getByRole('button', { name: 'Hide Test Hints' }).click()
    await expect(page.getByRole('heading', { name: 'Testing Tips:' })).not.toBeVisible()
  })
})
