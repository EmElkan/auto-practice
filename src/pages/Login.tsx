import { useState, type FormEvent } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

function Login() {
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const { setStatus, getStatus } = useProgressStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Mark as in progress
    if (getStatus('login') === 'not_started') {
      setStatus('login', 'in_progress')
    }

    const result = await login(username, password)

    setIsLoading(false)

    if (result.success) {
      setStatus('login', 'completed')
      setUsername('')
      setPassword('')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Login / Logout Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Test the authentication flow - login with valid credentials,
        handle errors, and logout.
      </p>

      <hr />

      {isAuthenticated ? (
        <div className="mt-4" data-testid="logged-in-section">
          <div className="retro-panel-raised p-4 bg-green-100">
            <h3 className="retro-success text-lg">
              Login Successful!
            </h3>
            <p className="mt-2">
              Welcome, <strong data-testid="logged-in-username">{user?.username}</strong>!
            </p>
            <p className="mt-2 text-sm">
              You are now authenticated. Try visiting the Protected Page!
            </p>
          </div>
          <button
            className="retro-button mt-4"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="retro-panel p-4 mb-4 bg-blue-100">
            <h4 className="font-bold mb-2">Test Credentials:</h4>
            <table className="retro-table">
              <tbody>
                <tr>
                  <td><strong>Username:</strong></td>
                  <td><code>testuser</code></td>
                </tr>
                <tr>
                  <td><strong>Password:</strong></td>
                  <td><code>password123</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <form onSubmit={handleSubmit} data-testid="login-form">
            <fieldset>
              <legend>Login</legend>

              {error && (
                <div
                  className="retro-panel mb-4 p-2 bg-red-100"
                  data-testid="error-message"
                >
                  <span className="retro-error">{error}</span>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="username" className="block mb-1">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="retro-input w-full max-w-xs"
                  required
                  disabled={isLoading}
                  data-testid="input-username"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="retro-input w-full max-w-xs"
                  required
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </div>

              <button
                type="submit"
                className="retro-button"
                disabled={isLoading}
                data-testid="login-button"
              >
                {isLoading ? (
                  <span className="retro-loading">Logging in...</span>
                ) : (
                  'Login'
                )}
              </button>
            </fieldset>
          </form>
        </div>
      )}

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Use <code>getByLabel()</code> to find form inputs by their label text',
          'Use <code>getByRole()</code> for buttons and headings',
          'Verify error messages with <code>getByText()</code>',
          'Prefer user-facing locators over <code>getByTestId()</code>',
          'Check that the loading state appears during login',
        ]}
        codeExamples={[
          {
            title: 'Successful login flow:',
            code: `await page.getByLabel('Username:').fill('testuser')
await page.getByLabel('Password:').fill('password123')
await page.getByRole('button', { name: 'Login' }).click()
await expect(page.getByRole('heading', { name: 'Login Successful!' })).toBeVisible()
await expect(page.getByText('Welcome, testuser!')).toBeVisible()`,
          },
          {
            title: 'Test invalid credentials:',
            code: `await page.getByLabel('Username:').fill('wronguser')
await page.getByLabel('Password:').fill('wrongpass')
await page.getByRole('button', { name: 'Login' }).click()
await expect(page.getByText('Invalid username or password')).toBeVisible()`,
          },
          {
            title: 'Test logout:',
            code: `// After logging in...
await page.getByRole('button', { name: 'Logout' }).click()
await expect(page.getByRole('group', { name: 'Login' })).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default Login
