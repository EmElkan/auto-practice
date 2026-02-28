import { test, expect } from '@playwright/test'

test.describe('Modals & Dialogs Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/modals')
  })

  test('opens and closes basic modal with X button', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).toBeVisible()

    await page.getByRole('button', { name: 'Close modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()
  })

  test('closes basic modal by clicking backdrop', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).toBeVisible()

    // Click on the backdrop (top-left corner, outside the modal)
    await page.getByTestId('basic-modal-backdrop').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()
  })

  test('closes basic modal with Escape key', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()
  })

  test('closes basic modal with OK button', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    await page.getByRole('dialog', { name: 'Basic Modal' }).getByRole('button', { name: 'OK' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()
  })

  test('confirmation dialog - confirm action', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Item' }).click()
    await expect(page.getByRole('dialog', { name: 'Confirm Delete' })).toBeVisible()

    await page.getByRole('button', { name: 'Yes, Delete' }).click()
    await expect(page.getByRole('dialog', { name: 'Confirm Delete' })).not.toBeVisible()
    await expect(page.getByText('Confirmed!')).toBeVisible()
  })

  test('confirmation dialog - cancel action', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Item' }).click()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('dialog', { name: 'Confirm Delete' })).not.toBeVisible()
    await expect(page.getByText('Cancelled')).toBeVisible()
  })

  test('form in modal - submit form', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New User' }).click()
    await expect(page.getByRole('dialog', { name: 'Add New User' })).toBeVisible()

    await page.getByLabel('Name:').fill('John Doe')
    await page.getByLabel('Email:').fill('john@example.com')
    await page.getByRole('button', { name: 'Add User' }).click()

    await expect(page.getByRole('dialog', { name: 'Add New User' })).not.toBeVisible()
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText('john@example.com')).toBeVisible()
  })

  test('form in modal - cancel closes without submitting', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New User' }).click()
    await page.getByLabel('Name:').fill('Test User')
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog', { name: 'Add New User' })).not.toBeVisible()
    // Form result should not be visible
    await expect(page.getByText('Test User')).not.toBeVisible()
  })

  test('nested modals - open inner from outer', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Outer Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Outer Modal' })).toBeVisible()

    await page.getByRole('button', { name: 'Open Inner Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Inner Modal' })).toBeVisible()
    // Outer modal should still be visible behind
    await expect(page.getByRole('dialog', { name: 'Outer Modal' })).toBeVisible()
  })

  test('nested modals - close inner returns to outer', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Outer Modal' }).click()
    await page.getByRole('button', { name: 'Open Inner Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Inner Modal' })).toBeVisible()

    await page.getByRole('button', { name: 'Close Inner' }).click()
    await expect(page.getByRole('dialog', { name: 'Inner Modal' })).not.toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Outer Modal' })).toBeVisible()
  })

  test('alert modal cannot be closed by backdrop click', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Alert' }).click()
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

    // Try clicking backdrop - modal should stay open
    await page.getByTestId('alert-modal-backdrop').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

    // Must use the button to close
    await page.getByRole('button', { name: 'I Understand' }).click()
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).not.toBeVisible()
  })

  test('alert modal cannot be closed by Escape key', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Alert' }).click()
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

    await page.keyboard.press('Escape')
    // Modal should still be visible
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

    await page.getByRole('button', { name: 'I Understand' }).click()
    await expect(page.getByRole('dialog', { name: 'Important Alert' })).not.toBeVisible()
  })

  test('modal traps focus within dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    const modal = page.getByRole('dialog', { name: 'Basic Modal' })
    await expect(modal).toBeVisible()

    // Focus should start inside the modal
    await expect(modal.locator(':focus')).toBeVisible()

    // Tab through all focusable elements — focus should stay inside the modal
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await expect(modal.locator(':focus')).toBeVisible()
    }

    // Shift+Tab should also keep focus inside
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Shift+Tab')
      await expect(modal.locator(':focus')).toBeVisible()
    }
  })

  test('nav link exists and works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Modals' }).click()
    await expect(page).toHaveURL('/challenges/modals')
    await expect(page.getByRole('heading', { name: 'Modals & Dialogs Challenge' })).toBeVisible()
  })

  test('challenge appears in home page catalog', async ({ page }) => {
    await page.goto('/')
    const table = page.getByRole('table')
    const modalsRow = table.getByRole('row').filter({ hasText: 'Modals & Dialogs' })
    await expect(modalsRow).toBeVisible()
  })
})
