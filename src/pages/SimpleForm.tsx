import { useState, type FormEvent } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type FormData = {
  firstName: string
  lastName: string
  email: string
  message: string
}

function SimpleForm() {
  const { setStatus, getStatus } = useProgressStore()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Mark as in progress when user starts typing
    if (getStatus('simple-form') === 'not_started') {
      setStatus('simple-form', 'in_progress')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmittedData({ ...formData })
    setSubmitted(true)
    setStatus('simple-form', 'completed')
  }

  const handleReset = () => {
    setFormData({ firstName: '', lastName: '', email: '', message: '' })
    setSubmitted(false)
    setSubmittedData(null)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Simple Form Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Fill out the form and submit it. Practice locating inputs by label,
        entering text, and verifying the success message.
      </p>

      <hr />

      {submitted ? (
        <div className="mt-4" data-testid="success-section">
          <div className="retro-panel-raised p-4 bg-green-100">
            <h3 className="retro-success text-lg">
              Form Submitted Successfully!
            </h3>
            <p className="mt-2">Here's what you submitted:</p>
            <table className="retro-table mt-2" data-testid="submitted-data">
              <tbody>
                <tr>
                  <td><strong>First Name:</strong></td>
                  <td data-testid="submitted-firstName">{submittedData?.firstName}</td>
                </tr>
                <tr>
                  <td><strong>Last Name:</strong></td>
                  <td data-testid="submitted-lastName">{submittedData?.lastName}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td data-testid="submitted-email">{submittedData?.email}</td>
                </tr>
                <tr>
                  <td><strong>Message:</strong></td>
                  <td data-testid="submitted-message">{submittedData?.message}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="retro-button mt-4"
            onClick={handleReset}
            data-testid="reset-button"
          >
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} data-testid="simple-form">
          <fieldset>
            <legend>Contact Information</legend>

            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-1">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="retro-input w-full max-w-xs"
                required
                data-testid="input-firstName"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block mb-1">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="retro-input w-full max-w-xs"
                required
                data-testid="input-lastName"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="retro-input w-full max-w-xs"
                required
                data-testid="input-email"
              />
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend>Your Message</legend>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-1">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="retro-textarea w-full max-w-md"
                rows={4}
                required
                data-testid="input-message"
              />
            </div>
          </fieldset>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="retro-button"
              data-testid="submit-button"
            >
              Submit Form
            </button>
            <button
              type="button"
              className="retro-button"
              onClick={handleReset}
              data-testid="clear-button"
            >
              Clear Form
            </button>
          </div>
        </form>
      )}

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Use <code>getByLabel()</code> to find inputs by their label text',
          'Use <code>getByRole()</code> for buttons and headings',
          'Use <code>getByText()</code> to verify displayed content',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Fill form using labels:',
            code: `await page.getByLabel('First Name:').fill('John')
await page.getByLabel('Last Name:').fill('Doe')
await page.getByLabel('Email Address:').fill('john@example.com')
await page.getByLabel('Message:').fill('Hello world!')`,
          },
          {
            title: 'Submit and verify success:',
            code: `await page.getByRole('button', { name: 'Submit Form' }).click()
await expect(page.getByRole('heading', { name: 'Form Submitted Successfully!' })).toBeVisible()
// Verify submitted data in table cells (exact match avoids partial hits)
await expect(page.getByRole('cell', { name: 'John', exact: true })).toBeVisible()
await expect(page.getByRole('cell', { name: 'john@example.com', exact: true })).toBeVisible()`,
          },
          {
            title: 'Test form reset:',
            code: `await page.getByRole('button', { name: 'Clear Form' }).click()
await expect(page.getByLabel('First Name:')).toHaveValue('')`,
          },
          {
            title: 'Test required field validation:',
            code: `// Try submitting empty form — HTML5 validation prevents it
await page.getByRole('button', { name: 'Submit Form' }).click()
// Form should still be visible (not submitted)
await expect(page.getByRole('group', { name: 'Contact Information' })).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default SimpleForm
