import { useState } from 'react'

type CodeExample = {
  title: string
  code: string
}

type TestHintsProps = {
  tips: string[]
  codeExamples: CodeExample[]
}

function TestHints({ tips, codeExamples }: TestHintsProps) {
  // Check if user has seen hints before
  const [isVisible, setIsVisible] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      // Fallback for older browsers
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mt-4">
      {!isVisible && (
        <div className="p-3 mb-2 text-gray-600" data-testid="hints-callout">
          <p className="text-sm m-0">
            <strong>Need help?</strong> Click the button below to see example Playwright code for this challenge.
          </p>
        </div>
      )}

      <button
        className="retro-button"
        onClick={() => setIsVisible(!isVisible)}
        data-testid="toggle-hints-button"
        aria-expanded={isVisible}
        aria-controls="hints-section"
      >
        {isVisible ? 'Hide' : 'Show'} Test Hints
      </button>

      {isVisible && (
        <div className="mt-4 retro-panel p-4" data-testid="hints-section" id="hints-section">
          <h4 className="font-bold mb-2">Testing Tips:</h4>
          <ul className="list-disc ml-6 mb-4 text-sm">
            {tips.map((tip, index) => (
              <li key={index}>
                {tip.split(/(<code>.*?<\/code>)/g).map((part, i) =>
                  part.startsWith('<code>') ? (
                    <code key={i}>{part.slice(6, -7)}</code>
                  ) : (
                    part
                  )
                )}
              </li>
            ))}
          </ul>

          <h4 className="font-bold mb-2">Example Playwright Code:</h4>
          {codeExamples.map((example, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold m-0">{example.title}</p>
                <button
                  className="retro-button text-xs"
                  onClick={() => copyToClipboard(example.code, index)}
                  data-testid={`copy-code-${index}`}
                  aria-label={`Copy code example: ${example.title}`}
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre
                className="bg-gray-900 text-green-400 p-3 text-xs overflow-x-auto rounded"
                data-testid={`code-example-${index}`}
              >
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestHints
