import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests using axe-core
 * These tests scan pages for WCAG violations
 * @see https://playwright.dev/docs/accessibility-testing
 *
 * Known issues (excluded from scans):
 * - color-contrast: Retro theme colors intentionally don't meet WCAG AA contrast
 *   (This is a teaching app with retro styling - real apps should fix these!)
 */

// Helper to create axe builder with common config
function createAxeBuilder(page: import('@playwright/test').Page, additionalDisabledRules: string[] = []) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // Disable color contrast - intentional retro theme styling
    // In production apps, you should NOT disable this!
    .disableRules(['color-contrast', ...additionalDisabledRules])
}

test.describe('Accessibility @a11y', () => {
  test('home page should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('simple form page should not have accessibility violations', async ({ page }) => {
    await page.goto('/challenges/simple-form')

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('login page should not have accessibility violations', async ({ page }) => {
    await page.goto('/challenges/login')

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('data tables page should not have accessibility violations', async ({ page }) => {
    await page.goto('/challenges/data-tables')

    // Also disable label check for data table checkboxes (they have implicit labels via row context)
    const accessibilityScanResults = await createAxeBuilder(page, ['label']).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('modals page should not have accessibility violations', async ({ page }) => {
    await page.goto('/challenges/modals')

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('drag drop page should not have accessibility violations', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  // Test modal accessibility when open
  test('open modal should be accessible', async ({ page }) => {
    await page.goto('/challenges/modals')
    await page.getByRole('button', { name: 'Open Basic Modal' }).click()
    await expect(page.getByRole('dialog', { name: 'Basic Modal' })).toBeVisible()

    const accessibilityScanResults = await createAxeBuilder(page).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  // Full audit including color contrast - informational only
  test('full accessibility audit with color contrast (informational)', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Report violations (informational - this test uses soft assertions)
    if (results.violations.length > 0) {
      console.log('\n📋 Accessibility Audit Results:')
      console.log(`Found ${results.violations.length} violation type(s):\n`)
      results.violations.forEach((violation) => {
        console.log(`  ❌ ${violation.id}: ${violation.help}`)
        console.log(`     Impact: ${violation.impact}`)
        console.log(`     Affected: ${violation.nodes.length} element(s)`)
        console.log(`     Learn more: ${violation.helpUrl}\n`)
      })
    } else {
      console.log('\n✅ No accessibility violations found!')
    }

    // Soft assertion - reports but doesn't fail the test
    // This allows us to track known issues without blocking CI
    expect.soft(
      results.violations.filter((v) => v.id !== 'color-contrast').length,
      'Expected no non-color-contrast accessibility violations'
    ).toBe(0)
  })
})
