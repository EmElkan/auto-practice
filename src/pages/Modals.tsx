import { useState, useEffect, useRef, useCallback } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  testId: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({ isOpen, onClose, title, children, testId, closeOnBackdrop = true, closeOnEscape = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return []
    return Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }, [])

  // Save previous focus and move focus into modal on open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Defer focus so the modal DOM is rendered
      requestAnimationFrame(() => {
        const focusable = getFocusableElements()
        const firstElement = focusable[0]
        if (firstElement) {
          firstElement.focus()
        } else {
          modalRef.current?.focus()
        }
      })
    }
  }, [isOpen, getFocusableElements])

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen])

  // Handle Escape and Tab for focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements()
        if (focusable.length === 0) return

        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, closeOnEscape, getFocusableElements])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      data-testid={`${testId}-backdrop`}
    >
      <div
        ref={modalRef}
        className="retro-window max-w-md w-full mx-4"
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testId}-title`}
      >
        <div className="retro-window-title" id={`${testId}-title`}>
          <span>{title}</span>
          <button
            onClick={onClose}
            className="w-5 h-4 bg-gray-300 border border-gray-500 text-xs leading-none hover:bg-gray-400"
            data-testid={`${testId}-close`}
            aria-label="Close modal"
          >
            X
          </button>
        </div>
        <div className="p-4 bg-gray-200">
          {children}
        </div>
      </div>
    </div>
  )
}

function Modals() {
  const { setStatus, getStatus } = useProgressStore()

  // Basic modal
  const [basicModalOpen, setBasicModalOpen] = useState(false)

  // Confirmation dialog
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmResult, setConfirmResult] = useState<string | null>(null)

  // Form modal
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null)

  // Nested modals
  const [outerModalOpen, setOuterModalOpen] = useState(false)
  const [innerModalOpen, setInnerModalOpen] = useState(false)

  // Alert modal (no backdrop close)
  const [alertModalOpen, setAlertModalOpen] = useState(false)

  const markProgress = () => {
    if (getStatus('modals') === 'not_started') {
      setStatus('modals', 'in_progress')
    }
  }

  const handleConfirm = (result: boolean) => {
    markProgress()
    setConfirmResult(result ? 'Confirmed!' : 'Cancelled')
    setConfirmModalOpen(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    markProgress()
    setSubmittedData({ ...formData })
    setFormData({ name: '', email: '' })
    setFormModalOpen(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Modals & Dialogs Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Practice testing modal dialogs including opening, closing,
        form submission, confirmation dialogs, and nested modals.
      </p>

      <hr />

      {/* Section 1: Basic Modal */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 1: Basic Modal</h3>
        <p className="text-sm mb-2">A simple modal that can be closed by clicking X, backdrop, or pressing Escape.</p>
        <button
          className="retro-button"
          onClick={() => { markProgress(); setBasicModalOpen(true) }}
          data-testid="open-basic-modal"
        >
          Open Basic Modal
        </button>
      </div>

      <Modal
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Basic Modal"
        testId="basic-modal"
      >
        <p>This is a basic modal dialog.</p>
        <p className="mt-2 text-sm">Try closing it by:</p>
        <ul className="list-disc ml-6 text-sm">
          <li>Clicking the X button</li>
          <li>Clicking the backdrop (dark area)</li>
          <li>Pressing the Escape key</li>
        </ul>
        <div className="mt-4">
          <button
            className="retro-button"
            onClick={() => setBasicModalOpen(false)}
            data-testid="basic-modal-ok"
          >
            OK
          </button>
        </div>
      </Modal>

      <hr className="my-4" />

      {/* Section 2: Confirmation Dialog */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 2: Confirmation Dialog</h3>
        <p className="text-sm mb-2">A dialog asking for confirmation with OK/Cancel buttons.</p>
        <button
          className="retro-button"
          onClick={() => { markProgress(); setConfirmResult(null); setConfirmModalOpen(true) }}
          data-testid="open-confirm-modal"
        >
          Delete Item
        </button>
        {confirmResult && (
          <span className={`ml-4 ${confirmResult === 'Confirmed!' ? 'retro-success' : 'retro-warning'}`} data-testid="confirm-result">
            {confirmResult}
          </span>
        )}
      </div>

      <Modal
        isOpen={confirmModalOpen}
        onClose={() => handleConfirm(false)}
        title="Confirm Delete"
        testId="confirm-modal"
      >
        <p className="mb-4">Are you sure you want to delete this item?</p>
        <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            className="retro-button"
            onClick={() => handleConfirm(true)}
            data-testid="confirm-ok"
          >
            Yes, Delete
          </button>
          <button
            className="retro-button"
            onClick={() => handleConfirm(false)}
            data-testid="confirm-cancel"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <hr className="my-4" />

      {/* Section 3: Form Modal */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 3: Form in Modal</h3>
        <p className="text-sm mb-2">A modal containing a form that submits data.</p>
        <button
          className="retro-button"
          onClick={() => { markProgress(); setFormModalOpen(true) }}
          data-testid="open-form-modal"
        >
          Add New User
        </button>
        {submittedData && (
          <div className="mt-2 retro-panel p-2" data-testid="form-result">
            <strong>Added:</strong> {submittedData.name} ({submittedData.email})
          </div>
        )}
      </div>

      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Add New User"
        testId="form-modal"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="modal-name" className="block mb-1">Name:</label>
            <input
              type="text"
              id="modal-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="retro-input w-full"
              required
              data-testid="form-modal-name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="modal-email" className="block mb-1">Email:</label>
            <input
              type="email"
              id="modal-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="retro-input w-full"
              required
              data-testid="form-modal-email"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="retro-button" data-testid="form-modal-submit">
              Add User
            </button>
            <button
              type="button"
              className="retro-button"
              onClick={() => setFormModalOpen(false)}
              data-testid="form-modal-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <hr className="my-4" />

      {/* Section 4: Nested Modals */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 4: Nested Modals</h3>
        <p className="text-sm mb-2">A modal that opens another modal on top of it.</p>
        <button
          className="retro-button"
          onClick={() => { markProgress(); setOuterModalOpen(true) }}
          data-testid="open-outer-modal"
        >
          Open Outer Modal
        </button>
      </div>

      <Modal
        isOpen={outerModalOpen}
        onClose={() => { setOuterModalOpen(false); setInnerModalOpen(false) }}
        title="Outer Modal"
        testId="outer-modal"
      >
        <p className="mb-4">This is the outer modal. Click below to open another modal on top.</p>
        <button
          className="retro-button"
          onClick={() => setInnerModalOpen(true)}
          data-testid="open-inner-modal"
        >
          Open Inner Modal
        </button>
      </Modal>

      <Modal
        isOpen={innerModalOpen}
        onClose={() => setInnerModalOpen(false)}
        title="Inner Modal"
        testId="inner-modal"
      >
        <p>This is the inner (nested) modal!</p>
        <p className="mt-2 text-sm">Closing this will return to the outer modal.</p>
        <div className="mt-4">
          <button
            className="retro-button"
            onClick={() => setInnerModalOpen(false)}
            data-testid="inner-modal-close-btn"
          >
            Close Inner
          </button>
        </div>
      </Modal>

      <hr className="my-4" />

      {/* Section 5: Alert Modal (no backdrop close) */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Section 5: Alert Modal</h3>
        <p className="text-sm mb-2">A modal that cannot be closed by clicking the backdrop - must use the button.</p>
        <button
          className="retro-button"
          onClick={() => { markProgress(); setAlertModalOpen(true) }}
          data-testid="open-alert-modal"
        >
          Show Alert
        </button>
      </div>

      <Modal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title="Important Alert"
        testId="alert-modal"
        closeOnBackdrop={false}
        closeOnEscape={false}
      >
        <p className="retro-warning mb-4">This is an important message!</p>
        <p className="text-sm mb-4">You must acknowledge this by clicking the button below.</p>
        <button
          className="retro-button"
          onClick={() => setAlertModalOpen(false)}
          data-testid="alert-modal-acknowledge"
        >
          I Understand
        </button>
      </Modal>

      <hr className="my-4" />

      <div className="retro-panel p-4">
        <button
          className="retro-button"
          onClick={() => setStatus('modals', 'completed')}
          data-testid="mark-complete-button"
        >
          Mark Challenge Complete
        </button>
      </div>

      <hr className="my-4" />

      <TestHints
        tips={[
          'Use <code>getByRole("dialog")</code> to locate modals',
          'Use <code>getByRole("button")</code> for modal triggers and actions',
          'Use <code>getByLabel()</code> for form inputs inside modals',
          'Test all close methods: X button, backdrop click, Escape key',
          'Modals trap focus — Tab/Shift+Tab should cycle within the modal only',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Open and close a modal:',
            code: `// Open modal
await page.getByRole('button', { name: 'Open Basic Modal' }).click()
await expect(page.getByRole('dialog', { name: 'Basic Modal' })).toBeVisible()

// Close with X button (aria-label)
await page.getByRole('button', { name: 'Close modal' }).click()
await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()`,
          },
          {
            title: 'Close by clicking backdrop:',
            code: `await page.getByRole('button', { name: 'Open Basic Modal' }).click()
// The backdrop has no semantic role — testid is the right fallback here.
// Click the corner, not the centre, to avoid hitting the modal inside it.
await page.getByTestId('basic-modal-backdrop').click({ position: { x: 10, y: 10 } })
await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()`,
          },
          {
            title: 'Close with Escape key:',
            code: `await page.getByRole('button', { name: 'Open Basic Modal' }).click()
await page.keyboard.press('Escape')
await expect(page.getByRole('dialog', { name: 'Basic Modal' })).not.toBeVisible()`,
          },
          {
            title: 'Handle confirmation dialog:',
            code: `await page.getByRole('button', { name: 'Delete Item' }).click()
await page.getByRole('button', { name: 'Yes, Delete' }).click()
await expect(page.getByText('Confirmed!')).toBeVisible()`,
          },
          {
            title: 'Fill form inside modal:',
            code: `await page.getByRole('button', { name: 'Add New User' }).click()
await page.getByLabel('Name:').fill('John Doe')
await page.getByLabel('Email:').fill('john@example.com')
await page.getByRole('button', { name: 'Add User' }).click()
await expect(page.getByText('John Doe')).toBeVisible()`,
          },
          {
            title: 'Test focus trapping:',
            code: `await page.getByRole('button', { name: 'Open Basic Modal' }).click()
const modal = page.getByRole('dialog', { name: 'Basic Modal' })

// Focus should be inside the modal
const focused = modal.locator(':focus')
await expect(focused).toBeVisible()

// Tab through all focusable elements — focus should never leave
await page.keyboard.press('Tab')
await expect(modal.locator(':focus')).toBeVisible()

// Shift+Tab should wrap back inside the modal
await page.keyboard.press('Shift+Tab')
await expect(modal.locator(':focus')).toBeVisible()`,
          },
          {
            title: 'Test nested modals:',
            code: `await page.getByRole('button', { name: 'Open Outer Modal' }).click()
await expect(page.getByRole('dialog', { name: 'Outer Modal' })).toBeVisible()

await page.getByRole('button', { name: 'Open Inner Modal' }).click()
await expect(page.getByRole('dialog', { name: 'Inner Modal' })).toBeVisible()

// Close inner — outer should still be visible
await page.getByRole('button', { name: 'Close Inner' }).click()
await expect(page.getByRole('dialog', { name: 'Inner Modal' })).not.toBeVisible()
await expect(page.getByRole('dialog', { name: 'Outer Modal' })).toBeVisible()`,
          },
          {
            title: 'Test non-dismissible alert modal:',
            code: `await page.getByRole('button', { name: 'Show Alert' }).click()

// Backdrop click should NOT close it
await page.getByTestId('alert-modal-backdrop').click({ position: { x: 10, y: 10 } })
await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

// Escape should NOT close it either
await page.keyboard.press('Escape')
await expect(page.getByRole('dialog', { name: 'Important Alert' })).toBeVisible()

// Must use the acknowledge button
await page.getByRole('button', { name: 'I Understand' }).click()
await expect(page.getByRole('dialog', { name: 'Important Alert' })).not.toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default Modals
