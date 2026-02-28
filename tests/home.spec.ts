import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('displays challenge catalog', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Welcome to Test Automation Practice/ })).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()

    // Verify challenges are listed using accessible patterns
    const table = page.getByRole('table')
    await expect(table.getByRole('row').filter({ hasText: 'Simple Form' })).toBeVisible()
    await expect(table.getByRole('row').filter({ hasText: 'Checkboxes & Radios' })).toBeVisible()
    await expect(table.getByRole('row').filter({ hasText: 'Login / Logout' })).toBeVisible()
    await expect(table.getByRole('row').filter({ hasText: 'Loading States' })).toBeVisible()
    await expect(table.getByRole('row').filter({ hasText: 'Protected Route' })).toBeVisible()
  })

  test('navigates to challenges via table buttons', async ({ page }) => {
    await page.goto('/')

    // Find the Simple Form row and click its Start button
    const simpleFormRow = page.getByRole('table').getByRole('row').filter({ hasText: 'Simple Form' })
    await simpleFormRow.getByRole('link', { name: /Start|Continue/ }).click()

    await expect(page).toHaveURL('/challenges/simple-form')
    await expect(page.getByRole('heading', { name: 'Simple Form Challenge' })).toBeVisible()
  })

  test('navigates via nav links', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Login' }).click()
    await expect(page).toHaveURL('/challenges/login')

    await page.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('visitor counter is displayed', async ({ page }) => {
    await page.goto('/')

    // The visitor counter should display a 6-digit number
    await expect(page.getByText(/You are visitor #/)).toBeVisible()
  })

  test('mark all complete button updates status badges', async ({ page }) => {
    await page.goto('/')

    // Click Mark All Complete
    await page.getByRole('button', { name: 'Mark All Complete' }).click()

    // Verify status badges show completed
    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })
    await expect(simpleFormRow.getByText('[COMPLETED]')).toBeVisible()

    const checkboxesRow = table.getByRole('row').filter({ hasText: 'Checkboxes & Radios' })
    await expect(checkboxesRow.getByText('[COMPLETED]')).toBeVisible()
  })

  test('reset progress button clears all status badges', async ({ page }) => {
    await page.goto('/')

    // First mark all complete
    await page.getByRole('button', { name: 'Mark All Complete' }).click()

    // Then reset
    await page.getByRole('button', { name: 'Reset All Progress' }).click()

    // Verify status badges show not started
    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })
    await expect(simpleFormRow.getByText('[NOT STARTED]')).toBeVisible()
  })

  test('challenge buttons show correct text based on status', async ({ page }) => {
    await page.goto('/')

    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })

    // Initially should show Start
    await expect(simpleFormRow.getByRole('link', { name: 'Start' })).toBeVisible()

    // Mark all complete
    await page.getByRole('button', { name: 'Mark All Complete' }).click()

    // Should now show Continue
    await expect(simpleFormRow.getByRole('link', { name: 'Continue' })).toBeVisible()
  })

  test('displays getting started guide', async ({ page }) => {
    await page.goto('/')

    // Verify getting started section is visible - use getByRole for headings
    await expect(page.getByRole('heading', { name: 'Getting Started' })).toBeVisible()

    // Use getByText for content verification
    await expect(page.getByText('Show Test Hints', { exact: false })).toBeVisible()
    await expect(page.getByText('Recommended order for beginners')).toBeVisible()
  })

  test('displays progress summary', async ({ page }) => {
    await page.goto('/')

    // Progress summary should show 0/10 - use getByText for content
    await expect(page.getByText('Progress:')).toBeVisible()
    await expect(page.getByText('0/10')).toBeVisible()
    await expect(page.getByText('challenges completed')).toBeVisible()

    // Mark all complete - use getByRole for buttons
    await page.getByRole('button', { name: 'Mark All Complete' }).click()

    // Progress should update
    await expect(page.getByText('10/10')).toBeVisible()
    await expect(page.getByText('All complete!')).toBeVisible()
  })

  test('completing a challenge updates progress on home page', async ({ page }) => {
    await page.goto('/')

    // Verify initial state: 0/10, NOT STARTED badge, Start button
    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })
    await expect(page.getByText('0/10')).toBeVisible()
    await expect(simpleFormRow.getByText('[NOT STARTED]')).toBeVisible()
    await expect(simpleFormRow.getByRole('link', { name: 'Start' })).toBeVisible()

    // Navigate to Simple Form and complete it
    await simpleFormRow.getByRole('link', { name: 'Start' }).click()
    await expect(page).toHaveURL('/challenges/simple-form')

    await page.getByLabel('First Name:').fill('Jane')
    await page.getByLabel('Last Name:').fill('Doe')
    await page.getByLabel('Email Address:').fill('jane@example.com')
    await page.getByLabel('Message:').fill('Hello from the test!')
    await page.getByRole('button', { name: 'Submit Form' }).click()

    // Verify form submission succeeded
    await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()

    // Navigate back to home via the "Back to Challenges" link
    await page.getByRole('link', { name: /Back to Challenges/ }).click()
    await expect(page).toHaveURL('/')

    // Verify progress updated: 1/10, COMPLETED badge, Continue button
    await expect(page.getByText('1/10')).toBeVisible()
    await expect(simpleFormRow.getByText('[COMPLETED]')).toBeVisible()
    await expect(simpleFormRow.getByRole('link', { name: 'Continue' })).toBeVisible()
  })

  test('starting a challenge shows in-progress status', async ({ page }) => {
    await page.goto('/')

    // Navigate to Simple Form
    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })
    await simpleFormRow.getByRole('link', { name: 'Start' }).click()

    // Type in one field to trigger in_progress status, but do NOT submit
    await page.getByLabel('First Name:').fill('Partial')

    // Navigate back to home
    await page.getByRole('link', { name: /Back to Challenges/ }).click()
    await expect(page).toHaveURL('/')

    // Verify: still 0/10 (not completed), but badge shows IN PROGRESS and button says Continue
    await expect(page.getByText('0/10')).toBeVisible()
    await expect(simpleFormRow.getByText('[IN PROGRESS]')).toBeVisible()
    await expect(simpleFormRow.getByRole('link', { name: 'Continue' })).toBeVisible()
  })

  test('progress persists after page reload', async ({ page }) => {
    await page.goto('/')

    // Navigate to Simple Form and complete it
    const table = page.getByRole('table')
    const simpleFormRow = table.getByRole('row').filter({ hasText: 'Simple Form' })
    await simpleFormRow.getByRole('link', { name: 'Start' }).click()

    await page.getByLabel('First Name:').fill('Jane')
    await page.getByLabel('Last Name:').fill('Doe')
    await page.getByLabel('Email Address:').fill('jane@example.com')
    await page.getByLabel('Message:').fill('Persistence test')
    await page.getByRole('button', { name: 'Submit Form' }).click()
    await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()

    // Navigate to home with a full page load (re-reads localStorage from scratch)
    await page.goto('/')

    // Verify progress survived the full page reload
    await expect(page.getByText('1/10')).toBeVisible()
    await expect(simpleFormRow.getByText('[COMPLETED]')).toBeVisible()
  })
})
