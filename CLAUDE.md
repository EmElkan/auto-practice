# Test Automation Practice

A React web app for practicing test automation with Playwright. Features a retro late-90s/early-2000s aesthetic but modern behavior.

## Features for Learners

- **Getting Started Guide** - Home page explains how to use Test Hints and recommends challenge order
- **Progress Tracking** - Visual progress counter (e.g., "5/10 challenges completed")
- **Test Hints** - Each challenge has toggleable Playwright code examples with copy buttons
- **Navigation Aids** - Active page highlighted in nav, "Back to Challenges" link on each page
- **Recommended Order** - Simple Form → Checkboxes → Login → Loading States → Modals → Data Tables

## Quick Start

```bash
npm run dev          # Start dev server at localhost:5173
npm run build        # Production build
npx playwright test  # Run all tests (all browsers)
npx playwright test --project=chromium  # Run on Chromium only
npx playwright test --ui  # Interactive test runner
```

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Routing:** React Router v7
- **Server State:** TanStack Query
- **Client State:** Zustand (auth, progress tracking)
- **Styling:** Tailwind CSS + custom retro CSS classes
- **Testing:** Playwright + axe-core (accessibility)

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx        # Main layout with nav (active link highlighting), back link, footer
│   └── TestHints.tsx     # Toggleable Playwright code examples with copy buttons
├── pages/
│   ├── Home.tsx          # Challenge catalog with getting started guide and progress tracking
│   ├── SimpleForm.tsx    # Form submission challenge
│   ├── CheckboxesRadios.tsx # Checkboxes & radio buttons challenge
│   ├── Login.tsx         # Auth challenge
│   ├── LoadingStates.tsx # Async/loading challenge
│   ├── ProtectedPage.tsx # Auth guard challenge
│   ├── DragDrop.tsx      # Drag and drop challenge
│   ├── DataTables.tsx    # Data tables challenge
│   ├── Modals.tsx        # Modal dialogs challenge
│   ├── NetworkMocking.tsx # Network mocking challenge
│   └── VisualTesting.tsx  # Visual regression testing challenge
├── store/
│   ├── authStore.ts      # Zustand auth state
│   └── progressStore.ts  # localStorage progress tracking
├── App.tsx               # Routes
├── main.tsx              # Providers (QueryClient, BrowserRouter)
└── index.css             # Tailwind + retro theme CSS
tests/
├── fixtures.ts           # Reusable test fixtures (login helper, etc.)
├── accessibility.spec.ts # Accessibility tests with axe-core
├── home.spec.ts
├── simple-form.spec.ts
├── checkboxes-radios.spec.ts
├── login.spec.ts
├── loading-states.spec.ts
├── protected.spec.ts
├── drag-drop.spec.ts
├── data-tables.spec.ts
├── modals.spec.ts
├── network-mocking.spec.ts
└── visual-testing.spec.ts
```

## Test Credentials

```
Username: testuser
Password: password123
```

## Playwright Best Practices (Implemented)

### 1. Locator Priority (User-Facing First)

**Always prefer user-facing locators** - they reflect how users interact with your app and are more resilient to implementation changes.

Tests use locators in this priority order:
1. `getByRole()` - **Preferred** for buttons, links, headings, dialogs, tables, rows
2. `getByLabel()` - **Preferred** for form inputs with labels
3. `getByText()` - Visible text content, useful for filtering
4. `getByTestId()` - **Fallback only** when semantic locators aren't possible

```typescript
// ✅ Recommended - user-facing locators
await page.getByLabel('Username:').fill('testuser')
await page.getByRole('button', { name: 'Login' }).click()
await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible()

// ✅ Filter elements by content
await page.getByRole('row').filter({ hasText: 'Product A' })
await page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Title' }) })

// ⚠️ Fallback - only when semantic locators aren't practical
await expect(page.getByTestId('session-id')).toBeVisible()
```

### 2. Reusable Fixtures

Common operations are extracted to `tests/fixtures.ts`:

```typescript
import { test, expect, login } from './fixtures'

// Using the authenticatedPage fixture (auto-login)
test('access protected page', async ({ authenticatedPage }) => {
  await authenticatedPage.getByRole('link', { name: 'Protected' }).click()
  await expect(authenticatedPage.getByText('Secret Area')).toBeVisible()
})

// Using the login helper function
test('custom login flow', async ({ page }) => {
  await login(page, 'customuser', 'custompass')
})
```

### 3. Multi-Browser Testing

Config supports Chromium, Firefox, and WebKit:
```bash
npx playwright test                    # All browsers
npx playwright test --project=chromium # Chromium only
npx playwright test --project=firefox  # Firefox only
```

### 4. Test Tags

Tests are tagged for filtering by testing *type*:
- `@slow` - Tests with intentional delays (useful to skip during development)
- `@visual` - Visual regression tests (often run separately in CI)
- `@a11y` - Accessibility tests (distinct tooling with axe-core)

```bash
npx playwright test --grep @visual       # Run visual tests only
npx playwright test --grep @a11y         # Run accessibility tests only
npx playwright test --grep-invert @slow  # Skip slow tests
```

### 5. Accessibility Testing

Uses axe-core for WCAG compliance:

```typescript
import AxeBuilder from '@axe-core/playwright'

test('page is accessible', async ({ page }) => {
  await page.goto('/challenges/login')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
```

### 6. Global Configuration

Timeouts and settings are in `playwright.config.ts`:
- Test timeout: 30s
- Assertion timeout: 5s
- Action timeout: 10s
- Screenshots on failure
- Video on failure
- Trace on first retry

## Retro CSS Classes

Defined in `src/index.css`:

- `.retro-button` - Beveled 3D button
- `.retro-input` - Sunken input field
- `.retro-textarea` - Sunken textarea field
- `.retro-panel` - Sunken panel
- `.retro-panel-raised` - Raised panel
- `.retro-window` / `.retro-window-title` - Window chrome
- `.retro-table` - Classic table styling
- `.retro-success` / `.retro-error` / `.retro-warning` - Status text
- `.blink` - Blinking text animation
- `.retro-loading` - Hourglass loading indicator
- `.retro-skeleton` - Skeleton loader with dither effect
- `.retro-marquee` / `.retro-marquee-content` - Scrolling text marquee
- `.under-construction` - Yellow/black striped banner
- `.odometer` / `.odometer-digit` - Red LED visitor counter
- `.award-badge` / `.award-badge.gold` / `.award-badge.blue` - Web award badges
- `.browser-badge.netscape` / `.browser-badge.ie` / `.browser-badge.freeserve` - Browser compatibility badges
- `.webring` / `.webring-title` / `.webring-nav` - Web ring navigation
- `.teletext-badge` - Teletext/Ceefax style badge
- `.union-jack-ribbon` - Corner ribbon with British flag styling
- `.lifeline-badge` - Who Wants to Be a Millionaire style badges

## Adding New Challenges

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add to challenge catalog in `src/pages/Home.tsx`
4. Add nav link in `src/components/Layout.tsx`
5. Create test file in `tests/`

## State Management

- **Auth:** Zustand store (`useAuthStore`) - in-memory, resets on refresh
- **Progress:** Zustand with persist middleware (`useProgressStore`) - saves to localStorage
- **Async data:** TanStack Query with mock fetch functions

## Design Principles

- Offline-first: All data is mocked client-side
- Configurable: Loading delays, error simulation can be toggled
- Testable: Stable selectors, deterministic behavior
- Expandable: Easy to add new challenges incrementally
