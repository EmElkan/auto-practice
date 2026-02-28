import { test, expect } from '@playwright/test'

/**
 * Visual Testing Challenge
 *
 * These tests demonstrate how to use Playwright's visual comparison features
 * and handle dynamic content that changes between test runs.
 *
 * Key concepts:
 * - toHaveScreenshot() for visual regression
 * - mask option to hide dynamic content
 * - animations: 'disabled' for consistent screenshots
 * - Element vs full page screenshots
 * - maxDiffPixels and threshold for tolerance
 *
 * LOCATOR PRIORITY (user-facing first):
 * 1. getByRole() - Buttons, links, headings, regions
 * 2. getByLabel() - Form inputs with labels
 * 3. getByText() - Visible text content
 * 4. getByTestId() - Only when semantic locators aren't possible
 */
test.describe('Visual Testing Challenge @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges/visual-testing')
  })

  // ============================================
  // RECOMMENDED: User-facing locators for masking
  // ============================================

  test('mask dynamic content using getByText (recommended)', async ({ page }) => {
    // Use getByText to mask elements by their visible label text
    // This is the most user-centric approach
    await expect(page).toHaveScreenshot('masked-by-text.png', {
      mask: [
        // Mask entire rows containing dynamic data by their label
        page.getByRole('row', { name: /Current Date/ }),
        page.getByRole('row', { name: /Current Time/ }),
        page.getByRole('row', { name: /Version/ }),
        page.getByRole('row', { name: /Session ID/ }),
        page.getByRole('row', { name: /Build Number/ }),
        // Mask the random quote blockquote
        page.getByRole('blockquote'),
        // Mask page footer with load timestamp
        page.getByText(/Page loaded at:/),
      ],
      animations: 'disabled',
    })
  })

  test('mask dynamic content using getByRole (recommended)', async ({ page }) => {
    // Use getByRole with filter for semantic element selection
    await expect(page).toHaveScreenshot('masked-by-role.png', {
      mask: [
        // Mask all table rows that contain "Current" text (date/time rows)
        page.getByRole('row').filter({ hasText: 'Current' }),
        // Mask rows with other dynamic identifiers
        page.getByRole('row').filter({ hasText: 'Version' }),
        page.getByRole('row').filter({ hasText: 'Session ID' }),
        page.getByRole('row').filter({ hasText: 'Build Number' }),
        // Mask the blockquote containing random quote
        page.getByRole('blockquote'),
        // Mask the footer paragraph
        page.getByText(/Page loaded at:/),
      ],
      animations: 'disabled',
    })
  })

  test('static section screenshot using heading locator', async ({ page }) => {
    // Locate sections by their window title - more maintainable than testids
    // Inner content windows have .mt-4 class, distinguishing from outer layout window
    const staticWindow = page.locator('.retro-window.mt-4').filter({
      has: page.locator('.retro-window-title', { hasText: 'Static Content' }),
    })
    await expect(staticWindow).toHaveScreenshot('static-section.png')
  })

  test('element screenshot - product card by heading', async ({ page }) => {
    // Locate card by its product heading - user-facing approach
    const productACard = page.locator('.retro-panel-raised').filter({
      has: page.getByRole('heading', { name: 'Product A' }),
    })
    await expect(productACard).toHaveScreenshot('product-card-a.png')
  })

  test('element screenshot - card grid by section heading', async ({ page }) => {
    // Locate the card grid section by its heading
    const cardSection = page.getByRole('heading', { name: 'Product Cards (Element Screenshots):' })
      .locator('..') // Parent container
    await expect(cardSection).toHaveScreenshot('card-grid-section.png')
  })

  test('animated section - disable animations for consistency', async ({ page }) => {
    // Locate animated section by its window title text
    // Inner content windows have .mt-4 class
    const animatedWindow = page.locator('.retro-window.mt-4').filter({
      has: page.locator('.retro-window-title', { hasText: 'Animated Content' }),
    })

    await expect(animatedWindow).toHaveScreenshot('animated-section.png', {
      animations: 'disabled',
    })
  })

  test('full page screenshot with user-facing masks', async ({ page }) => {
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
      mask: [
        // Mask dynamic section by its window title
        page.locator('.retro-window.mt-4').filter({
          has: page.locator('.retro-window-title', { hasText: 'Dynamic Content' }),
        }),
        // Mask random quote section by heading
        page.getByRole('heading', { name: 'Random Quote of the Day:' }).locator('..'),
        // Mask footer load timestamp
        page.getByText(/Page loaded at:/),
        // Mask visitor counter (in layout header)
        page.getByText(/You are visitor #/).locator('..'),
      ],
      animations: 'disabled',
    })
  })

  // ============================================
  // CSS selectors for class-based masking
  // ============================================

  test('mask animated elements by CSS class', async ({ page }) => {
    // CSS selectors are useful for masking all elements with a specific style
    await expect(page).toHaveScreenshot('masked-by-css-class.png', {
      mask: [
        page.locator('.blink'), // All blinking elements
        page.locator('.retro-marquee'), // All marquees
        page.locator('.retro-loading'), // Loading indicators
      ],
      animations: 'disabled',
    })
  })

  // ============================================
  // Tolerance settings for flaky tests
  // ============================================

  test('screenshot with pixel difference tolerance', async ({ page }) => {
    // Allow small differences (anti-aliasing, font rendering)
    const staticWindow = page.locator('.retro-window.mt-4').filter({
      has: page.locator('.retro-window-title', { hasText: 'Static Content' }),
    })

    await expect(staticWindow).toHaveScreenshot('static-with-tolerance.png', {
      maxDiffPixels: 100, // Allow up to 100 pixels to differ
    })
  })

  test('screenshot with percentage threshold', async ({ page }) => {
    // Alternative: use percentage-based threshold
    const staticWindow = page.locator('.retro-window.mt-4').filter({
      has: page.locator('.retro-window-title', { hasText: 'Static Content' }),
    })

    await expect(staticWindow).toHaveScreenshot('static-with-threshold.png', {
      threshold: 0.1, // Allow 10% pixel difference per pixel
    })
  })

  // ============================================
  // FALLBACK: data-testid when semantic locators aren't practical
  // ============================================

  test('mask using data-testid (fallback approach)', async ({ page }) => {
    // Use testids only when:
    // - Elements have no semantic meaning (generic containers)
    // - User-facing text might change frequently
    // - Multiple similar elements need individual targeting
    await expect(page).toHaveScreenshot('masked-by-testid.png', {
      mask: [
        page.getByTestId('current-date'),
        page.getByTestId('current-time'),
        page.getByTestId('version-number'),
        page.getByTestId('session-id'),
        page.getByTestId('build-number'),
        page.getByTestId('load-timestamp'),
        page.getByTestId('random-quote'),
      ],
    })
  })

  // ============================================
  // Navigation tests
  // ============================================

  test('nav link exists and works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Visual' }).click()
    await expect(page).toHaveURL('/challenges/visual-testing')
    await expect(page.getByRole('heading', { name: 'Visual Testing Challenge' })).toBeVisible()
  })

  test('challenge appears in home page catalog', async ({ page }) => {
    await page.goto('/')
    const table = page.getByRole('table')
    const visualRow = table.getByRole('row').filter({ hasText: 'Visual Testing' })
    await expect(visualRow).toBeVisible()
    await expect(visualRow.getByRole('cell', { name: 'Visual', exact: true })).toBeVisible()
  })
})
