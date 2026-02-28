import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useEffect } from 'react'
import TestHints from '../components/TestHints'

function ProtectedPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { setStatus, getStatus } = useProgressStore()

  useEffect(() => {
    // Mark as completed when user successfully accesses this page while authenticated
    if (isAuthenticated && getStatus('protected') !== 'completed') {
      setStatus('protected', 'completed')
    }
  }, [isAuthenticated, setStatus, getStatus])

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div data-testid="access-denied-section">
        <h2 className="text-xl font-bold mb-2">Protected Route Challenge</h2>

        <hr />

        <div className="retro-panel p-4 mt-4 bg-red-100">
          <h3 className="retro-error text-lg">
            Access Denied!
          </h3>
          <p className="mt-2">
            You must be logged in to view this page.
          </p>
          <p className="mt-2">
            <Link to="/challenges/login" data-testid="login-link">
              Click here to login
            </Link>
          </p>
        </div>

        <hr className="mt-4" />

        <TestHints
          tips={[
            'Test that unauthenticated users see the access denied message',
            'Login first, then navigate to this page',
            'Test that logging out redirects/shows access denied',
            'Verify the "login" link navigates to the login page',
            'Prefer user-facing locators over <code>getByTestId()</code>',
          ]}
          codeExamples={[
            {
              title: 'Test access denied when not logged in:',
              code: `await page.goto('/challenges/protected')
await expect(page.getByRole('heading', { name: 'Access Denied!' })).toBeVisible()
await expect(page.getByText('You must be logged in')).toBeVisible()`,
            },
            {
              title: 'Test login link works:',
              code: `await page.goto('/challenges/protected')
await page.getByRole('link', { name: 'Click here to login' }).click()
await expect(page).toHaveURL('/challenges/login')`,
            },
          ]}
        />
      </div>
    )
  }

  // Authenticated content
  return (
    <div data-testid="protected-content">
      <h2 className="text-xl font-bold mb-2">Protected Route Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Test authentication guards and access control.
      </p>

      <hr />

      <div className="retro-panel-raised p-4 mt-4 bg-green-100">
        <h3 className="retro-success text-lg">
          Welcome to the Secret Area!
        </h3>
        <p className="mt-2">
          Congratulations, <strong data-testid="username-display">{user?.username}</strong>!
          You have successfully accessed the protected content.
        </p>
      </div>

      <div className="retro-window mt-4">
        <div className="retro-window-title">
          <span>Secret Information</span>
        </div>
        <div className="p-4">
          <h4 className="font-bold mb-2">Top Secret Data:</h4>
          <table className="retro-table" data-testid="secret-data">
            <tbody>
              <tr>
                <td><strong>Secret Code:</strong></td>
                <td data-testid="secret-code">ALPHA-BRAVO-CHARLIE</td>
              </tr>
              <tr>
                <td><strong>Access Level:</strong></td>
                <td data-testid="access-level">Level 5 - Full Access</td>
              </tr>
              <tr>
                <td><strong>Session Status:</strong></td>
                <td data-testid="session-status">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm">
          <span className="blink">*</span>
          This content is only visible to authenticated users!
          <span className="blink">*</span>
        </p>
      </div>

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Login first, then verify you can see the protected content',
          'Verify the secret data is displayed correctly',
          'Test that the username is displayed',
          'Logout and verify you can no longer access this page',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Login then access protected page:',
            code: `// Login first
await page.goto('/challenges/login')
await page.getByLabel('Username:').fill('testuser')
await page.getByLabel('Password:').fill('password123')
await page.getByRole('button', { name: 'Login' }).click()
await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()

// Navigate to protected page
await page.goto('/challenges/protected')
await expect(page.getByRole('heading', { name: 'Welcome to the Secret Area!' })).toBeVisible()`,
          },
          {
            title: 'Verify secret data:',
            code: `await expect(page.getByRole('row', { name: /Secret Code/ })).toContainText('ALPHA-BRAVO-CHARLIE')
await expect(page.getByRole('row', { name: /Access Level/ })).toContainText('Level 5')
await expect(page.getByText('Congratulations, testuser!')).toBeVisible()`,
          },
          {
            title: 'Test logout removes access:',
            code: `// After accessing protected content...
await page.getByRole('button', { name: 'Logout' }).click()
await page.goto('/challenges/protected')
await expect(page.getByRole('heading', { name: 'Access Denied!' })).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default ProtectedPage
