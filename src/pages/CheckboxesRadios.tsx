import { useState, type FormEvent } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type FormData = {
  beverage: string
  biscuits: string[]
  newsletter: boolean
  terms: boolean
}

const biscuitOptions = [
  { id: 'digestive', label: 'Digestive' },
  { id: 'hobnob', label: 'Hobnob' },
  { id: 'custard-cream', label: 'Custard Cream' },
  { id: 'bourbon', label: 'Bourbon' },
  { id: 'jaffa-cake', label: 'Jaffa Cake' },
]

function CheckboxesRadios() {
  const { setStatus, getStatus } = useProgressStore()
  const [formData, setFormData] = useState<FormData>({
    beverage: '',
    biscuits: [],
    newsletter: false,
    terms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  const handleBeverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, beverage: e.target.value }))
    markInProgress()
  }

  const handleBiscuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      biscuits: checked
        ? [...prev.biscuits, value]
        : prev.biscuits.filter((b) => b !== value),
    }))
    markInProgress()
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
    markInProgress()
  }

  const markInProgress = () => {
    if (getStatus('checkboxes-radios') === 'not_started') {
      setStatus('checkboxes-radios', 'in_progress')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.terms) {
      return
    }
    setSubmittedData({ ...formData })
    setSubmitted(true)
    setStatus('checkboxes-radios', 'completed')
  }

  const handleReset = () => {
    setFormData({ beverage: '', biscuits: [], newsletter: false, terms: false })
    setSubmitted(false)
    setSubmittedData(null)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Checkboxes & Radio Buttons Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Practice selecting radio buttons, checking/unchecking checkboxes,
        and verifying their states using <code>toBeChecked()</code>.
      </p>

      <hr />

      {submitted ? (
        <div className="mt-4" data-testid="success-section">
          <div className="retro-panel-raised p-4 bg-green-100">
            <h3 className="retro-success text-lg">
              Preferences Saved!
            </h3>
            <p className="mt-2">Here's what you selected:</p>
            <table className="retro-table mt-2">
              <tbody>
                <tr>
                  <td><strong>Preferred Beverage:</strong></td>
                  <td data-testid="submitted-beverage">{submittedData?.beverage || 'None selected'}</td>
                </tr>
                <tr>
                  <td><strong>Favourite Biscuits:</strong></td>
                  <td data-testid="submitted-biscuits">
                    {submittedData?.biscuits.length
                      ? submittedData.biscuits.map(b =>
                          biscuitOptions.find(opt => opt.id === b)?.label
                        ).join(', ')
                      : 'None selected'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Newsletter:</strong></td>
                  <td data-testid="submitted-newsletter">
                    {submittedData?.newsletter ? 'Yes, sign me up!' : 'No thanks'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="retro-button mt-4"
            onClick={handleReset}
            data-testid="reset-button"
          >
            Start Over
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} data-testid="preferences-form">
          <fieldset>
            <legend>Preferred Beverage</legend>
            <p className="text-sm mb-2">Select one:</p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="beverage"
                  value="tea"
                  checked={formData.beverage === 'tea'}
                  onChange={handleBeverageChange}
                  className="w-4 h-4"
                />
                Tea
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="beverage"
                  value="coffee"
                  checked={formData.beverage === 'coffee'}
                  onChange={handleBeverageChange}
                  className="w-4 h-4"
                />
                Coffee
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="beverage"
                  value="water"
                  checked={formData.beverage === 'water'}
                  onChange={handleBeverageChange}
                  className="w-4 h-4"
                />
                Water
              </label>
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend>Favourite Biscuits</legend>
            <p className="text-sm mb-2">Select all that apply:</p>

            <div className="space-y-2">
              {biscuitOptions.map((biscuit) => (
                <label key={biscuit.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="biscuits"
                    value={biscuit.id}
                    checked={formData.biscuits.includes(biscuit.id)}
                    onChange={handleBiscuitChange}
                    className="w-4 h-4"
                  />
                  {biscuit.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend>Additional Options</legend>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                Subscribe to our newsletter
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                  required
                />
                I accept the terms and conditions <span className="text-red-600">*</span>
              </label>
            </div>
          </fieldset>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="retro-button"
              data-testid="submit-button"
            >
              Save Preferences
            </button>
            <button
              type="button"
              className="retro-button"
              onClick={handleReset}
              data-testid="clear-button"
            >
              Clear All
            </button>
          </div>
        </form>
      )}

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Use <code>getByRole(\'radio\')</code> and <code>getByRole(\'checkbox\')</code> for inputs',
          'Use <code>getByLabel()</code> when inputs have associated label text',
          'Use <code>toBeChecked()</code> and <code>not.toBeChecked()</code> for state assertions',
          'Use <code>check()</code> and <code>uncheck()</code> instead of <code>click()</code> for reliability',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Select a radio button:',
            code: `// Using getByLabel (recommended)
await page.getByLabel('Tea').check()

// Or using getByRole with filtering
await page.getByRole('radio', { name: 'Coffee' }).check()

// Verify selection
await expect(page.getByLabel('Tea')).toBeChecked()
await expect(page.getByLabel('Coffee')).not.toBeChecked()`,
          },
          {
            title: 'Check and uncheck checkboxes:',
            code: `// Check multiple biscuits
await page.getByLabel('Digestive').check()
await page.getByLabel('Hobnob').check()

// Uncheck one
await page.getByLabel('Digestive').uncheck()

// Verify states
await expect(page.getByLabel('Digestive')).not.toBeChecked()
await expect(page.getByLabel('Hobnob')).toBeChecked()`,
          },
          {
            title: 'Submit and verify results:',
            code: `await page.getByLabel('Tea').check()
await page.getByLabel('Jaffa Cake').check()
await page.getByLabel('I accept the terms and conditions').check()

await page.getByRole('button', { name: 'Save Preferences' }).click()

await expect(page.getByRole('heading', { name: 'Preferences Saved!' })).toBeVisible()
await expect(page.getByRole('cell', { name: 'tea' })).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default CheckboxesRadios
