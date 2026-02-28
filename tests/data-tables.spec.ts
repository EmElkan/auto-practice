import { test, expect } from '@playwright/test'

test.describe('Data Tables Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/data-tables')
  })

  test('displays table with products', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    // First page should have 5 items (sorted by name ascending by default)
    const rows = page.getByRole('table').locator('tbody tr')
    await expect(rows).toHaveCount(5)
    await expect(page.getByText(/Showing 1-5 of 12/)).toBeVisible()
  })

  test('can sort by column ascending and descending', async ({ page }) => {
    // Helper to extract prices from visible rows
    const getPrices = async () => {
      const rows = page.getByRole('table').locator('tbody tr')
      const count = await rows.count()
      const prices: number[] = []
      for (let i = 0; i < count; i++) {
        const cells = await rows.nth(i).getByRole('cell').allTextContents()
        const priceCell = cells.find(c => c.startsWith('$'))
        if (priceCell) prices.push(parseFloat(priceCell.replace('$', '')))
      }
      return prices
    }

    // Click price header to sort ascending
    await page.getByRole('columnheader', { name: /Price/ }).click()
    await expect(page.getByRole('columnheader', { name: /Price/ })).toContainText('▲')

    const ascPrices = await getPrices()
    for (let i = 1; i < ascPrices.length; i++) {
      expect(ascPrices[i]).toBeGreaterThanOrEqual(ascPrices[i - 1]!)
    }

    // Click again to sort descending
    await page.getByRole('columnheader', { name: /Price/ }).click()
    await expect(page.getByRole('columnheader', { name: /Price/ })).toContainText('▼')

    const descPrices = await getPrices()
    for (let i = 1; i < descPrices.length; i++) {
      expect(descPrices[i]).toBeLessThanOrEqual(descPrices[i - 1]!)
    }
  })

  test('can filter by text search', async ({ page }) => {
    await page.getByLabel('Search:').fill('keyboard')

    // Should show only the keyboard item
    await expect(page.getByRole('cell', { name: 'Mechanical Keyboard' })).toBeVisible()

    // Other items should not be visible
    await expect(page.getByRole('cell', { name: 'Wireless Mouse' })).not.toBeVisible()
  })

  test('can filter by category', async ({ page }) => {
    await page.getByLabel('Category:').selectOption('Furniture')

    // Should only show furniture items
    await expect(page.getByRole('cell', { name: 'Monitor Stand' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Desk Lamp' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Office Chair' })).toBeVisible()

    // Electronics should not be visible
    await expect(page.getByRole('cell', { name: 'Wireless Mouse' })).not.toBeVisible()
  })

  test('shows no results message when filter matches nothing', async ({ page }) => {
    await page.getByLabel('Search:').fill('xyznonexistent')

    await expect(page.getByText('No products found matching your criteria.')).toBeVisible()
  })

  test('pagination works correctly', async ({ page }) => {
    // Should show first 5 items
    await expect(page.getByText(/Showing 1-5 of 12/)).toBeVisible()

    // Click next page
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText(/Showing 6-10 of 12/)).toBeVisible()

    // Click page 3
    await page.getByRole('button', { name: '3', exact: true }).click()
    await expect(page.getByText(/Showing 11-12 of 12/)).toBeVisible()

    // Previous button
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByText(/Showing 6-10 of 12/)).toBeVisible()
  })

  test('can select individual rows', async ({ page }) => {
    // Get checkboxes from visible rows (first page)
    const checkboxes = page.getByRole('table').locator('tbody').getByRole('checkbox')

    // Select first row
    await checkboxes.first().check()
    await expect(page.getByText(/1 item\(s\) selected/)).toBeVisible()

    // Select second row
    await checkboxes.nth(1).check()
    await expect(page.getByText(/2 item\(s\) selected/)).toBeVisible()

    // Deselect first row
    await checkboxes.first().uncheck()
    await expect(page.getByText(/1 item\(s\) selected/)).toBeVisible()
  })

  test('select all checkbox works', async ({ page }) => {
    // Select all on page - the checkbox is in the table header
    const selectAllCheckbox = page.getByRole('table').locator('thead').getByRole('checkbox')
    await selectAllCheckbox.check()
    await expect(page.getByText(/5 item\(s\) selected/)).toBeVisible()

    // Deselect all
    await selectAllCheckbox.uncheck()
    await expect(page.getByText(/item\(s\) selected/)).not.toBeVisible()
  })

  test('clear selection button works', async ({ page }) => {
    const checkboxes = page.getByRole('table').locator('tbody').getByRole('checkbox')
    await checkboxes.first().check()
    await checkboxes.nth(1).check()
    await expect(page.getByText(/2 item\(s\) selected/)).toBeVisible()

    await page.getByRole('button', { name: 'Clear Selection' }).click()
    await expect(page.getByText(/item\(s\) selected/)).not.toBeVisible()
  })

  test('reset button clears all filters and selection', async ({ page }) => {
    // Apply filters
    await page.getByLabel('Search:').fill('test')
    await page.getByLabel('Category:').selectOption('Electronics')
    await page.getByRole('columnheader', { name: /Price/ }).click()

    // Reset
    await page.getByRole('button', { name: 'Reset All' }).click()

    // Verify reset
    await expect(page.getByLabel('Search:')).toHaveValue('')
    await expect(page.getByLabel('Category:')).toHaveValue('all')
    await expect(page.getByRole('columnheader', { name: /Name/ })).toContainText('▲') // Default sort
  })

  test('nav link exists and works', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Data Tables' }).click()

    await expect(page).toHaveURL('/challenges/data-tables')
    await expect(page.getByRole('heading', { name: 'Data Tables Challenge' })).toBeVisible()
  })

  test('challenge appears in home page catalog', async ({ page }) => {
    await page.goto('/')

    // Use table row locator to find the challenge
    const table = page.getByRole('table')
    const dataTablesRow = table.getByRole('row').filter({ hasText: 'Data Tables' })
    await expect(dataTablesRow).toBeVisible()
    await expect(dataTablesRow.getByRole('cell', { name: 'Data', exact: true })).toBeVisible()
  })
})
