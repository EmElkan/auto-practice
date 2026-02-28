# Test Automation Practice

A beginner-friendly web app for learning test automation with [Playwright](https://playwright.dev). Practice writing real tests against interactive challenges - forms, authentication, drag & drop, data tables, and more.

Features a retro 90s/2000s aesthetic (think Geocities meets Windows 95) but with modern React behavior.


## Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the App

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. You should see the retro-styled home page with a list of challenges.

### Step 3: Install Playwright (if you haven't already)

```bash
npx playwright install
```

This downloads the browsers Playwright needs to run tests.

### Step 4: Run Your First Test

```bash
npx playwright test tests/simple-form.spec.ts
```

You should see output showing the tests passing.

### Step 5: Watch Tests Run in the Browser

```bash
npx playwright test tests/simple-form.spec.ts --headed
```

The `--headed` flag opens a real browser so you can watch the test run.

### Step 6: Use the Interactive UI

```bash
npx playwright test --ui
```

This opens Playwright's visual test runner where you can run tests, see screenshots, and debug failures.


## Available Challenges

| Challenge | Difficulty | What You'll Practice |
|-----------|------------|---------------------|
| [Simple Form](/challenges/simple-form) | Beginner | Form inputs, labels, submit buttons, success messages |
| [Checkboxes & Radios](/challenges/checkboxes-radios) | Beginner | `check()`, `uncheck()`, `toBeChecked()`, radio exclusivity |
| [Login](/challenges/login) | Beginner | Authentication, error handling, logout |
| [Loading States](/challenges/loading-states) | Intermediate | Async waits, loading spinners, error states, retry |
| [Drag & Drop](/challenges/drag-drop) | Intermediate | `dragAndDrop()`, sortable lists, kanban boards |
| [Data Tables](/challenges/data-tables) | Intermediate | Sorting, filtering, pagination, row selection |
| [Modals](/challenges/modals) | Intermediate | Open/close modals, confirmations, forms in modals |
| [Visual Testing](/challenges/visual-testing) | Intermediate | `toHaveScreenshot()`, mask dynamic content, animations |
| [Protected Page](/challenges/protected) | Advanced | Auth guards, redirects, session state |
| [Network Mocking](/challenges/network-mocking) | Advanced | `page.route()`, mock APIs, simulate errors |


## Writing Your First Test

Create a new file `tests/my-first-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('fill out the simple form', async ({ page }) => {
  // 1. Go to the challenge page
  await page.goto('/challenges/simple-form')

  // 2. Fill in the form fields
  await page.getByLabel('First Name:').fill('Jane')
  await page.getByLabel('Last Name:').fill('Doe')
  await page.getByLabel('Email Address:').fill('jane@example.com')
  await page.getByLabel('Message:').fill('Hello, world!')

  // 3. Click submit
  await page.getByRole('button', { name: 'Submit Form' }).click()

  // 4. Verify success message appears
  await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Jane', exact: true })).toBeVisible()
})
```

Run it:

```bash
npx playwright test tests/my-first-test.spec.ts --headed
```


## Test Credentials

For the Login and Protected Page challenges:

```
Username: testuser
Password: password123
```

## Useful Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the app at localhost:5173 |
| `npm run build` | Build for production |
| `npx playwright test` | Run all tests (all browsers) |
| `npx playwright test --project=chromium` | Run tests on Chromium only |
| `npx playwright test --headed` | Run tests with visible browser |
| `npx playwright test --ui` | Open interactive test runner |
| `npx playwright test tests/login.spec.ts` | Run a specific test file |
| `npx playwright test --grep @slow` | Run slow tests only |
| `npx playwright test --grep-invert @slow` | Skip slow tests |
| `npx playwright codegen localhost:5173` | Record actions and generate test code |


## Tips for Beginners

1. **Start with Simple Form** - It's the easiest challenge and teaches core concepts

2. **Use Codegen to learn selectors** - Run `npx playwright codegen localhost:5173` and click around. Playwright will show you the code!

3. **Click "Show Test Hints"** - Each challenge has a hints section with example Playwright code

4. **Use `--headed` often** - Watching tests run helps you understand what's happening

5. **Check the test files** - Look at `tests/*.spec.ts` for examples of how to test each challenge


## Test Best Practices

The tests in this project follow Playwright best practices:

1. **Use user-facing locators first** - `getByRole`, `getByLabel`, `getByText`
2. **Reusable fixtures** - See `tests/fixtures.ts` for login helpers
3. **Multi-browser testing** - Chrome, Firefox, and Safari
4. **Test tags** - `@slow`, `@visual`, `@a11y` for filtering
5. **Accessibility testing** - Uses axe-core for WCAG compliance

See `tests/*.spec.ts` for detailed best practices in action.


## Need More Help?

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Locators Guide](https://playwright.dev/docs/locators)
- Check the `tests/` folder for real-world examples


Built with [Claude Code](https://claude.ai/claude-code)
