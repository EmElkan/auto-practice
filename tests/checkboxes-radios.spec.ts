import { test, expect } from '@playwright/test'

test.describe('Checkboxes & Radio Buttons Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/checkboxes-radios')
  })

  test('displays form with all fieldsets', async ({ page }) => {
    await expect(page.getByRole('group', { name: 'Preferred Beverage' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Favourite Biscuits' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Additional Options' })).toBeVisible()
  })

  test('radio buttons are mutually exclusive', async ({ page }) => {
    // Select Tea
    await page.getByLabel('Tea').check()
    await expect(page.getByLabel('Tea')).toBeChecked()
    await expect(page.getByLabel('Coffee')).not.toBeChecked()
    await expect(page.getByLabel('Water')).not.toBeChecked()

    // Select Coffee - Tea should be deselected
    await page.getByLabel('Coffee').check()
    await expect(page.getByLabel('Coffee')).toBeChecked()
    await expect(page.getByLabel('Tea')).not.toBeChecked()
    await expect(page.getByLabel('Water')).not.toBeChecked()
  })

  test('can check multiple checkboxes', async ({ page }) => {
    // Check multiple biscuits
    await page.getByLabel('Digestive').check()
    await page.getByLabel('Hobnob').check()
    await page.getByLabel('Jaffa Cake').check()

    // Verify all are checked
    await expect(page.getByLabel('Digestive')).toBeChecked()
    await expect(page.getByLabel('Hobnob')).toBeChecked()
    await expect(page.getByLabel('Jaffa Cake')).toBeChecked()

    // Verify others are not checked
    await expect(page.getByLabel('Custard Cream')).not.toBeChecked()
    await expect(page.getByLabel('Bourbon')).not.toBeChecked()
  })

  test('can uncheck checkboxes', async ({ page }) => {
    // Check then uncheck
    await page.getByLabel('Digestive').check()
    await expect(page.getByLabel('Digestive')).toBeChecked()

    await page.getByLabel('Digestive').uncheck()
    await expect(page.getByLabel('Digestive')).not.toBeChecked()
  })

  test('submits form and shows success message', async ({ page }) => {
    // Fill out the form
    await page.getByLabel('Tea').check()
    await page.getByLabel('Hobnob').check()
    await page.getByLabel('Jaffa Cake').check()
    await page.getByLabel('Subscribe to our newsletter').check()
    await page.getByLabel('I accept the terms and conditions').check()

    // Submit
    await page.getByRole('button', { name: 'Save Preferences' }).click()

    // Verify success - use row filtering to locate submitted values
    await expect(page.getByRole('heading', { name: 'Preferences Saved!' })).toBeVisible()
    await expect(page.getByRole('row').filter({ hasText: 'Preferred Beverage' }).getByRole('cell').nth(1)).toHaveText('tea')
    const biscuitsCell = page.getByRole('row').filter({ hasText: 'Favourite Biscuits' }).getByRole('cell').nth(1)
    await expect(biscuitsCell).toContainText('Hobnob')
    await expect(biscuitsCell).toContainText('Jaffa Cake')
    await expect(page.getByRole('row').filter({ hasText: 'Newsletter' }).getByRole('cell').nth(1)).toHaveText('Yes, sign me up!')
  })

  test('requires terms acceptance to submit', async ({ page }) => {
    // Fill form but don't accept terms
    await page.getByLabel('Tea').check()

    // Try to submit
    await page.getByRole('button', { name: 'Save Preferences' }).click()

    // Form should still be visible (not submitted)
    await expect(page.getByRole('group', { name: 'Preferred Beverage' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preferences Saved!' })).not.toBeVisible()
  })

  test('clear button resets all selections', async ({ page }) => {
    // Make selections
    await page.getByLabel('Coffee').check()
    await page.getByLabel('Digestive').check()
    await page.getByLabel('Subscribe to our newsletter').check()

    // Clear
    await page.getByRole('button', { name: 'Clear All' }).click()

    // Verify all are unchecked
    await expect(page.getByLabel('Coffee')).not.toBeChecked()
    await expect(page.getByLabel('Tea')).not.toBeChecked()
    await expect(page.getByLabel('Digestive')).not.toBeChecked()
    await expect(page.getByLabel('Subscribe to our newsletter')).not.toBeChecked()
  })

  test('can start over after submission', async ({ page }) => {
    // Submit form
    await page.getByLabel('Water').check()
    await page.getByLabel('I accept the terms and conditions').check()
    await page.getByRole('button', { name: 'Save Preferences' }).click()

    await expect(page.getByRole('heading', { name: 'Preferences Saved!' })).toBeVisible()

    // Start over
    await page.getByRole('button', { name: 'Start Over' }).click()

    // Form should be visible again with nothing selected
    await expect(page.getByRole('group', { name: 'Preferred Beverage' })).toBeVisible()
    await expect(page.getByLabel('Water')).not.toBeChecked()
    await expect(page.getByLabel('I accept the terms and conditions')).not.toBeChecked()
  })

  test('newsletter subscription is optional', async ({ page }) => {
    // Submit without newsletter
    await page.getByLabel('Tea').check()
    await page.getByLabel('I accept the terms and conditions').check()
    await page.getByRole('button', { name: 'Save Preferences' }).click()

    await expect(page.getByRole('row').filter({ hasText: 'Newsletter' }).getByRole('cell').nth(1)).toHaveText('No thanks')
  })
})
