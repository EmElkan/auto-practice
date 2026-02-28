import { test, expect } from '@playwright/test'

test.describe('Network Mocking Challenge', () => {
  test('displays page without mocking (shows error)', async ({ page }) => {
    await page.goto('/challenges/network-mocking')

    await page.getByRole('button', { name: 'Fetch Users' }).click()
    // Without mocking, the API call will fail (Vite returns HTML for unknown routes)
    await expect(page.getByText(/HTTP \d+|Failed to fetch|not valid JSON/)).toBeVisible()
  })

  test('mock GET request - fetch users', async ({ page }) => {
    // Set up mock BEFORE navigating
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Alice Smith', email: 'alice@test.com' },
          { id: 2, name: 'Bob Jones', email: 'bob@test.com' },
        ]),
      })
    })

    await page.goto('/challenges/network-mocking')
    await page.getByRole('button', { name: 'Fetch Users' }).click()

    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Alice Smith' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Bob Jones' })).toBeVisible()
  })

  test('mock GET request - fetch posts', async ({ page }) => {
    await page.route('**/api/posts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'First Post', body: 'This is the first post content.' },
          { id: 2, title: 'Second Post', body: 'This is the second post content.' },
        ]),
      })
    })

    await page.goto('/challenges/network-mocking')
    await page.getByRole('button', { name: 'Fetch Posts' }).click()

    await expect(page.getByText('First Post', { exact: true })).toBeVisible()
    await expect(page.getByText('Second Post', { exact: true })).toBeVisible()
    await expect(page.getByText('This is the first post content.')).toBeVisible()
  })

  test('mock POST request - create user', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { name: string }
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 42, name: body.name }),
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/challenges/network-mocking')
    await page.getByLabel('Name:').fill('Charlie Brown')
    await page.getByRole('button', { name: 'Create User' }).click()

    await expect(page.getByText('Charlie Brown')).toBeVisible()
    await expect(page.getByText('ID: 42')).toBeVisible()
  })

  test('mock search with query params', async ({ page }) => {
    await page.route('**/api/users/search**', async (route) => {
      const url = new URL(route.request().url())
      const query = url.searchParams.get('q')?.toLowerCase() ?? ''

      const allUsers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Alicia' },
      ]

      const filtered = allUsers.filter((u) =>
        u.name.toLowerCase().includes(query)
      )

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filtered),
      })
    })

    await page.goto('/challenges/network-mocking')
    await page.getByLabel('Search:').fill('ali')
    await page.getByRole('button', { name: 'Search' }).click()

    await expect(page.getByText('Results:')).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'Alice' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'Alicia' })).toBeVisible()
    // Bob should not be in results
    await expect(page.getByRole('listitem').filter({ hasText: 'Bob' })).not.toBeVisible()
  })

  test('simulate server error (500)', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/challenges/network-mocking')
    await page.getByRole('button', { name: 'Fetch Users' }).click()

    await expect(page.getByText(/HTTP 500/)).toBeVisible()
  })

  test('simulate network failure', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/challenges/network-mocking')
    await page.getByRole('button', { name: 'Fetch Users' }).click()

    await expect(page.getByText(/Failed to fetch/)).toBeVisible()
  })

  test('mock multiple endpoints', async ({ page }) => {
    // Mock users endpoint
    await page.route('**/api/users', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 1, name: 'User One', email: 'one@test.com' }]),
        })
      }
    })

    // Mock posts endpoint
    await page.route('**/api/posts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, title: 'Post One', body: 'Content one' }]),
      })
    })

    await page.goto('/challenges/network-mocking')

    // Fetch both
    await page.getByRole('button', { name: 'Fetch Users' }).click()
    await expect(page.getByRole('cell', { name: 'User One' })).toBeVisible()

    await page.getByRole('button', { name: 'Fetch Posts' }).click()
    await expect(page.getByText('Post One')).toBeVisible()
  })

  test('search shows error when request fails', async ({ page }) => {
    await page.route('**/api/users/search**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      })
    })

    await page.goto('/challenges/network-mocking')
    await page.getByLabel('Search:').fill('test')
    await page.getByRole('button', { name: 'Search' }).click()

    await expect(page.getByText(/HTTP 500/)).toBeVisible()
  })

  test('nav link exists and works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Network' }).click()
    await expect(page).toHaveURL('/challenges/network-mocking')
    await expect(page.getByRole('heading', { name: 'Network Mocking Challenge' })).toBeVisible()
  })

  test('challenge appears in home page catalog', async ({ page }) => {
    await page.goto('/')
    const challengeRow = page.getByRole('row').filter({ hasText: 'Network Mocking' })
    await expect(challengeRow).toBeVisible()
    await expect(challengeRow.getByRole('cell', { name: 'API', exact: true })).toBeVisible()
  })
})
