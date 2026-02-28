import { useState, useEffect } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

// Random quotes that change on each load
const quotes = [
  "The only way to do great work is to love what you do.",
  "Testing leads to failure, and failure leads to understanding.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Quality is not an act, it is a habit.",
]

function VisualTesting() {
  const { setStatus, getStatus } = useProgressStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [randomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mark as in progress when viewed
  useEffect(() => {
    if (getStatus('visual-testing') === 'not_started') {
      setStatus('visual-testing', 'in_progress')
    }
  }, [setStatus, getStatus])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Visual Testing Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Learn to capture screenshots and handle dynamic content
        that changes between test runs.
      </p>

      <hr />

      {/* Static Content Section - Good for baseline screenshots */}
      <div className="retro-window mt-4" data-testid="static-section">
        <div className="retro-window-title">
          <span>Static Content</span>
        </div>
        <div className="p-4">
          <p>This section contains static content that never changes.</p>
          <p className="mt-2">It's perfect for visual regression testing!</p>

          <div className="mt-4 flex gap-4">
            <button className="retro-button" data-testid="static-button-1">
              Button One
            </button>
            <button className="retro-button" data-testid="static-button-2">
              Button Two
            </button>
          </div>

          <table className="retro-table mt-4 w-full">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Screenshots</td>
                <td className="retro-success">Supported</td>
              </tr>
              <tr>
                <td>Visual Comparison</td>
                <td className="retro-success">Supported</td>
              </tr>
              <tr>
                <td>Masking</td>
                <td className="retro-success">Supported</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Content Section - Needs masking */}
      <div className="retro-window mt-4" data-testid="dynamic-section">
        <div className="retro-window-title">
          <span>Dynamic Content (Needs Masking)</span>
        </div>
        <div className="p-4">
          <p className="mb-4 retro-warning">
            These elements change on every page load or over time.
            You'll need to mask them in visual tests!
          </p>

          <table className="retro-table w-full">
            <tbody>
              <tr>
                <td><strong>Current Date:</strong></td>
                <td data-testid="current-date">
                  {currentTime.toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td><strong>Current Time:</strong></td>
                <td data-testid="current-time">
                  {currentTime.toLocaleTimeString()}
                </td>
              </tr>
              <tr>
                <td><strong>Version:</strong></td>
                {/* Intentionally random on every render - teaches masking dynamic content in visual tests */}
                <td data-testid="version-number">
                  v{Math.floor(Math.random() * 3) + 1}.{Math.floor(Math.random() * 10)}.{Math.floor(Math.random() * 100)}
                </td>
              </tr>
              <tr>
                <td><strong>Session ID:</strong></td>
                <td data-testid="session-id">
                  {sessionId}
                </td>
              </tr>
              <tr>
                <td><strong>Build Number:</strong></td>
                {/* Intentionally random on every render - teaches masking dynamic content in visual tests */}
                <td data-testid="build-number">
                  #{Math.floor(Math.random() * 9000) + 1000}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Random Content Section */}
      <div className="retro-panel p-4 mt-4" data-testid="random-quote-section">
        <h4 className="font-bold mb-2">Random Quote of the Day:</h4>
        <blockquote
          className="italic border-l-4 border-blue-600 pl-4"
          data-testid="random-quote"
        >
          "{randomQuote}"
        </blockquote>
      </div>

      {/* Animated Content Section */}
      <div className="retro-window mt-4" data-testid="animated-section">
        <div className="retro-window-title">
          <span>Animated Content</span>
        </div>
        <div className="p-4">
          <p className="mb-4">
            Animations can cause flaky visual tests. Use <code>animations: 'disabled'</code>
          </p>

          <div className="flex items-center gap-4">
            <div
              className="blink text-lg"
              data-testid="blinking-text"
            >
              ★ BLINKING TEXT ★
            </div>

            <div className="retro-marquee" style={{ width: '200px' }} data-testid="marquee">
              <div className="retro-marquee-content">
                Scrolling marquee text that moves across the screen!
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div
              className="inline-block retro-loading"
              data-testid="loading-spinner"
            >
              Loading indicator...
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid - Good for element screenshots */}
      <div className="mt-4" data-testid="card-grid">
        <h4 className="font-bold mb-2">Product Cards (Element Screenshots):</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="retro-panel-raised p-4" data-testid="card-1">
            <h5 className="font-bold">Product A</h5>
            <p className="text-sm">$19.99</p>
            <button className="retro-button mt-2 text-sm">Add to Cart</button>
          </div>
          <div className="retro-panel-raised p-4" data-testid="card-2">
            <h5 className="font-bold">Product B</h5>
            <p className="text-sm">$29.99</p>
            <button className="retro-button mt-2 text-sm">Add to Cart</button>
          </div>
          <div className="retro-panel-raised p-4" data-testid="card-3">
            <h5 className="font-bold">Product C</h5>
            <p className="text-sm">$39.99</p>
            <button className="retro-button mt-2 text-sm">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Footer with timestamp */}
      <div className="mt-4 text-center text-sm" data-testid="page-footer">
        <p>
          Page loaded at: <span data-testid="load-timestamp">{new Date().toISOString()}</span>
        </p>
        <button
          className="retro-button mt-2"
          onClick={() => setStatus('visual-testing', 'completed')}
          data-testid="mark-complete"
        >
          Mark Challenge Complete
        </button>
      </div>

      <hr className="mt-4" />

      <TestHints
        tips={[
          'Use <code>toHaveScreenshot()</code> for visual regression testing',
          'Mask dynamic content with the <code>mask</code> option',
          'Prefer user-facing locators over <code>getByTestId()</code>',
          'Disable animations with <code>animations: "disabled"</code>',
          'Use <code>fullPage: true</code> for full page screenshots',
          'Set <code>maxDiffPixels</code> or <code>threshold</code> for tolerance',
        ]}
        codeExamples={[
          {
            title: 'Mask by role (recommended):',
            code: `await expect(page).toHaveScreenshot('page.png', {
  mask: [
    // Mask rows by their content
    page.getByRole('row', { name: /Current Date/ }),
    page.getByRole('row', { name: /Current Time/ }),
    // Mask semantic elements
    page.getByRole('blockquote'),
  ],
  animations: 'disabled',
})`,
          },
          {
            title: 'Mask by text content:',
            code: `await expect(page).toHaveScreenshot('page.png', {
  mask: [
    page.getByText(/Page loaded at:/),
    page.getByRole('row').filter({ hasText: 'Version' }),
  ],
})`,
          },
          {
            title: 'Element screenshot by heading:',
            code: `// Locate by heading instead of testid
const card = page.locator('.retro-panel-raised').filter({
  has: page.getByRole('heading', { name: 'Product A' }),
})
await expect(card).toHaveScreenshot('product-card.png')`,
          },
          {
            title: 'Disable animations:',
            code: `await expect(page).toHaveScreenshot('static.png', {
  animations: 'disabled',
})`,
          },
          {
            title: 'Full page with masking:',
            code: `await expect(page).toHaveScreenshot('full-page.png', {
  fullPage: true,
  mask: [
    // Mask section by its title
    page.locator('.retro-window').filter({
      has: page.getByText('Dynamic Content'),
    }),
  ],
  maxDiffPixels: 100,
})`,
          },
          {
            title: 'Fallback: testid when needed:',
            code: `// Use testid only when semantic locators aren't practical
await expect(page).toHaveScreenshot({
  mask: [page.getByTestId('session-id')],
})`,
          },
        ]}
      />
    </div>
  )
}

export default VisualTesting
