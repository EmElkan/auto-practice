import { useState } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type User = {
  id: number
  name: string
  email: string
}

type Post = {
  id: number
  title: string
  body: string
}

// Simulated API base URL - tests can intercept these
const API_BASE = '/api'

function NetworkMocking() {
  const { setStatus, getStatus } = useProgressStore()

  // Users API state
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Posts API state
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [postsError, setPostsError] = useState<string | null>(null)

  // Create user state
  const [newUserName, setNewUserName] = useState('')
  const [createResult, setCreateResult] = useState<string | null>(null)
  const [createLoading, setCreateLoading] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const markProgress = () => {
    if (getStatus('network-mocking') === 'not_started') {
      setStatus('network-mocking', 'in_progress')
    }
  }

  // Fetch users - can be mocked
  const fetchUsers = async () => {
    markProgress()
    setUsersLoading(true)
    setUsersError(null)
    try {
      const response = await fetch(`${API_BASE}/users`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setUsersLoading(false)
    }
  }

  // Fetch posts - can be mocked
  const fetchPosts = async () => {
    markProgress()
    setPostsLoading(true)
    setPostsError(null)
    try {
      const response = await fetch(`${API_BASE}/posts`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setPostsLoading(false)
    }
  }

  // Create user - can be mocked
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    markProgress()
    setCreateLoading(true)
    setCreateResult(null)
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName }),
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setCreateResult(`Created user: ${data.name} (ID: ${data.id})`)
      setNewUserName('')
    } catch (err) {
      setCreateResult(`Error: ${err instanceof Error ? err.message : 'Failed to create user'}`)
    } finally {
      setCreateLoading(false)
    }
  }

  // Search users - can be mocked with query params
  const searchUsers = async () => {
    markProgress()
    setSearchLoading(true)
    setSearchError(null)
    try {
      const response = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Network Mocking Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Learn to intercept and mock network requests using Playwright's
        <code> page.route()</code> API. This page makes real API calls that you'll intercept in tests.
      </p>

      <div className="retro-panel p-3 mb-4 bg-blue-100">
        <strong>Note:</strong> This page makes requests to <code>/api/*</code> endpoints.
        Without mocking, these will fail (404). In your tests, use <code>page.route()</code>
        to intercept and return mock data.
      </div>

      <hr />

      {/* Section 1: GET Request - Fetch Users */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 1: GET Request - Fetch Users</h3>
        <p className="text-sm mb-2">Fetches users from <code>/api/users</code></p>
        <button
          className="retro-button"
          onClick={fetchUsers}
          disabled={usersLoading}
          data-testid="fetch-users-button"
        >
          {usersLoading ? 'Loading...' : 'Fetch Users'}
        </button>

        {usersError && (
          <div className="mt-2 retro-panel p-2 bg-red-100" data-testid="users-error">
            <span className="retro-error">{usersError}</span>
          </div>
        )}

        {users.length > 0 && (
          <table className="retro-table mt-2 w-full" data-testid="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} data-testid={`user-row-${user.id}`}>
                  <td>{user.id}</td>
                  <td data-testid={`user-name-${user.id}`}>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr className="my-4" />

      {/* Section 2: GET Request - Fetch Posts */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 2: GET Request - Fetch Posts</h3>
        <p className="text-sm mb-2">Fetches posts from <code>/api/posts</code></p>
        <button
          className="retro-button"
          onClick={fetchPosts}
          disabled={postsLoading}
          data-testid="fetch-posts-button"
        >
          {postsLoading ? 'Loading...' : 'Fetch Posts'}
        </button>

        {postsError && (
          <div className="mt-2 retro-panel p-2 bg-red-100" data-testid="posts-error">
            <span className="retro-error">{postsError}</span>
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-2" data-testid="posts-list">
            {posts.map((post) => (
              <div key={post.id} className="retro-panel p-2 mb-2" data-testid={`post-${post.id}`}>
                <strong>{post.title}</strong>
                <p className="text-sm mt-1">{post.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Section 3: POST Request - Create User */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 3: POST Request - Create User</h3>
        <p className="text-sm mb-2">Sends a POST request to <code>/api/users</code></p>
        <form onSubmit={createUser} className="flex gap-2 items-end">
          <div>
            <label htmlFor="new-user-name" className="block text-sm mb-1">Name:</label>
            <input
              type="text"
              id="new-user-name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="retro-input"
              required
              data-testid="new-user-input"
            />
          </div>
          <button
            type="submit"
            className="retro-button"
            disabled={createLoading}
            data-testid="create-user-button"
          >
            {createLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
        {createResult && (
          <div
            className={`mt-2 retro-panel p-2 ${createResult.startsWith('Error') ? 'bg-red-100' : 'bg-green-100'}`}
            data-testid="create-result"
          >
            {createResult}
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Section 4: GET with Query Params - Search */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 4: GET with Query Params - Search</h3>
        <p className="text-sm mb-2">Searches users via <code>/api/users/search?q=...</code></p>
        <div className="flex gap-2 items-end">
          <div>
            <label htmlFor="search-query" className="block text-sm mb-1">Search:</label>
            <input
              type="text"
              id="search-query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="retro-input"
              placeholder="Enter name..."
              data-testid="search-input"
            />
          </div>
          <button
            className="retro-button"
            onClick={searchUsers}
            disabled={searchLoading}
            data-testid="search-button"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchError && (
          <div className="mt-2 retro-panel p-2 bg-red-100" data-testid="search-error">
            <span className="retro-error">{searchError}</span>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-2" data-testid="search-results">
            <strong>Results:</strong>
            <ul className="list-disc ml-6">
              {searchResults.map((user) => (
                <li key={user.id} data-testid={`search-result-${user.id}`}>{user.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="retro-panel p-4">
        <button
          className="retro-button"
          onClick={() => setStatus('network-mocking', 'completed')}
          data-testid="mark-complete-button"
        >
          Mark Challenge Complete
        </button>
      </div>

      <hr className="my-4" />

      <TestHints
        tips={[
          'Use <code>page.route()</code> to intercept requests before the page makes them',
          'Mock responses with <code>route.fulfill()</code> to return custom JSON',
          'Use <code>getByRole()</code> and <code>getByLabel()</code> to interact with UI',
          'Test error handling by returning error status codes',
          'Use <code>route.abort()</code> to simulate network failures',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Mock GET and verify with roles:',
            code: `await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
    ]),
  })
})

await page.goto('/challenges/network-mocking')
await page.getByRole('button', { name: 'Fetch Users' }).click()
await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible()`,
          },
          {
            title: 'Mock POST with form input:',
            code: `await page.route('**/api/users', async (route) => {
  if (route.request().method() === 'POST') {
    const body = route.request().postDataJSON()
    await route.fulfill({
      status: 201,
      body: JSON.stringify({ id: 99, name: body.name }),
    })
  }
})

await page.getByLabel('Name:').fill('Charlie')
await page.getByRole('button', { name: 'Create User' }).click()
await expect(page.getByText('Charlie')).toBeVisible()`,
          },
          {
            title: 'Simulate an error:',
            code: `await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Server error' }),
  })
})

await page.getByRole('button', { name: 'Fetch Users' }).click()
await expect(page.getByText('HTTP 500')).toBeVisible()`,
          },
          {
            title: 'Search with query params:',
            code: `await page.route('**/api/users/search**', async (route) => {
  const url = new URL(route.request().url())
  const query = url.searchParams.get('q')
  // Return filtered mock data
  await route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'Alice' }]),
  })
})

await page.getByLabel('Search:').fill('ali')
await page.getByRole('button', { name: 'Search' }).click()
await expect(page.getByRole('listitem').filter({ hasText: 'Alice' })).toBeVisible()`,
          },
          {
            title: 'Simulate network failure:',
            code: `// Use route.abort() to simulate a dropped connection
await page.route('**/api/users', async (route) => {
  await route.abort('failed')
})

await page.goto('/challenges/network-mocking')
await page.getByRole('button', { name: 'Fetch Users' }).click()
await expect(page.getByText(/Failed to fetch/)).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default NetworkMocking
