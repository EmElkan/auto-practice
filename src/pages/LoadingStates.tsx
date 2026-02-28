import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type User = {
  id: number
  name: string
  email: string
  role: string
}

// Mock data fetching function with configurable delay
const fetchUsers = async (delay: number): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, delay))

  return [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Moderator' },
    { id: 5, name: 'Eve Wilson', email: 'eve@example.com', role: 'User' },
  ]
}

// Skeleton loader component
function SkeletonRow() {
  return (
    <tr data-testid="skeleton-row">
      <td><div className="retro-skeleton h-4 w-8"></div></td>
      <td><div className="retro-skeleton h-4 w-32"></div></td>
      <td><div className="retro-skeleton h-4 w-40"></div></td>
      <td><div className="retro-skeleton h-4 w-20"></div></td>
    </tr>
  )
}

function LoadingStates() {
  const { setStatus, getStatus } = useProgressStore()
  const [delay, setDelay] = useState(2000)
  const [shouldError, setShouldError] = useState(false)
  const shouldErrorRef = useRef(shouldError)
  shouldErrorRef.current = shouldError

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users', delay],
    queryFn: async () => {
      if (shouldErrorRef.current) {
        throw new Error('Simulated network error! The server is down.')
      }
      return fetchUsers(delay)
    },
    retry: false,
  })

  // Mark progress when data loads
  useEffect(() => {
    if (users && getStatus('loading-states') === 'not_started') {
      setStatus('loading-states', 'in_progress')
    }
  }, [users, getStatus, setStatus])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Loading States Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Practice handling async content, skeleton loaders,
        loading spinners, and error states.
      </p>

      <hr />

      {/* Configuration Panel */}
      <div className="retro-panel p-4 mt-4 mb-4">
        <h4 className="font-bold mb-2">Configure Loading Behavior:</h4>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="delay" className="block mb-1 text-sm">
              Delay (ms):
            </label>
            <input
              type="number"
              id="delay"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="retro-input w-24"
              min={0}
              max={10000}
              step={500}
              data-testid="delay-input"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={shouldError}
                onChange={(e) => setShouldError(e.target.checked)}
                data-testid="error-checkbox"
              />
              Simulate Error
            </label>
          </div>

          <button
            className="retro-button"
            onClick={() => refetch()}
            disabled={isFetching}
            data-testid="refresh-button"
          >
            {isFetching ? 'Loading...' : 'Refresh Data'}
          </button>

          <button
            className="retro-button"
            onClick={() => setStatus('loading-states', 'completed')}
            data-testid="mark-complete-button"
          >
            Mark Complete
          </button>
        </div>
      </div>

      {/* Data Display */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">
          User Data
          {isFetching && !isLoading && (
            <span className="text-sm font-normal ml-2 retro-loading" data-testid="refetching-indicator">
              Updating...
            </span>
          )}
        </h3>

        {isError ? (
          <div className="retro-panel p-4 bg-red-100" data-testid="error-section">
            <h4 className="retro-error">Error Loading Data</h4>
            <p className="mt-2" data-testid="error-message">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button
              className="retro-button mt-2"
              onClick={() => refetch()}
              data-testid="retry-button"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="retro-table w-full" data-testid="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton loading state
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                users?.map((user) => (
                  <tr key={user.id} data-testid={`user-row-${user.id}`}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Loading indicator overlay */}
      {isLoading && (
        <div className="text-center mt-4" data-testid="loading-section">
          <p className="retro-loading">Loading user data, please wait...</p>
          <p className="text-sm text-gray-600 mt-2">
            (Configured delay: {delay}ms)
          </p>
        </div>
      )}

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Use <code>getByRole()</code> for buttons, tables, and cells',
          'Use <code>getByLabel()</code> to find form inputs',
          'Use <code>getByText()</code> to verify displayed content',
          'Wait for loading to complete with <code>toBeVisible()</code> and timeout',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Wait for data to load:',
            code: `await page.goto('/challenges/loading-states')
// Wait for loading to complete (data visible)
await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible({ timeout: 10000 })
await expect(page.getByRole('cell', { name: 'bob@example.com' })).toBeVisible()`,
          },
          {
            title: 'Test error state:',
            code: `await page.getByLabel('Simulate Error').check()
await page.getByRole('button', { name: 'Refresh Data' }).click()
await expect(page.getByRole('heading', { name: 'Error Loading Data' })).toBeVisible()
await expect(page.getByText('Simulated network error')).toBeVisible()`,
          },
          {
            title: 'Test retry from error:',
            code: `// After triggering error...
await page.getByLabel('Simulate Error').uncheck()
await page.getByRole('button', { name: 'Retry' }).click()
await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible({ timeout: 10000 })`,
          },
          {
            title: 'Test with custom delay:',
            code: `await page.getByLabel('Delay (ms):').fill('500')
await page.getByRole('button', { name: 'Refresh Data' }).click()
// Data should load quickly with 500ms delay
await expect(page.getByRole('cell', { name: 'Alice Johnson' })).toBeVisible({ timeout: 2000 })`,
          },
        ]}
      />
    </div>
  )
}

export default LoadingStates
