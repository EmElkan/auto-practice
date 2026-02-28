import { Link } from 'react-router-dom'
import { useProgressStore } from '../store/progressStore'

type Challenge = {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  path: string
  category: string
}

const challenges: Challenge[] = [
  {
    id: 'simple-form',
    title: 'Simple Form',
    description: 'Practice with text inputs, labels, and form submission. Perfect for learning basic selectors and assertions.',
    difficulty: 'Beginner',
    path: '/challenges/simple-form',
    category: 'Forms',
  },
  {
    id: 'checkboxes-radios',
    title: 'Checkboxes & Radios',
    description: 'Learn to interact with checkboxes and radio buttons. Practice check(), uncheck(), and toBeChecked() assertions.',
    difficulty: 'Beginner',
    path: '/challenges/checkboxes-radios',
    category: 'Forms',
  },
  {
    id: 'login',
    title: 'Login / Logout',
    description: 'Authentication flow with username/password, error handling, and logout functionality.',
    difficulty: 'Beginner',
    path: '/challenges/login',
    category: 'Auth',
  },
  {
    id: 'loading-states',
    title: 'Loading States',
    description: 'Handle async content, skeleton loaders, spinners, and dynamic data updates.',
    difficulty: 'Intermediate',
    path: '/challenges/loading-states',
    category: 'Dynamic',
  },
  {
    id: 'protected',
    title: 'Protected Route',
    description: 'Test auth guards, redirects, and session-based access control.',
    difficulty: 'Advanced',
    path: '/challenges/protected',
    category: 'Auth',
  },
  {
    id: 'drag-drop',
    title: 'Drag & Drop',
    description: 'Practice testing drag and drop interactions with sortable lists and kanban boards.',
    difficulty: 'Intermediate',
    path: '/challenges/drag-drop',
    category: 'Interactions',
  },
  {
    id: 'data-tables',
    title: 'Data Tables',
    description: 'Test sorting, filtering, pagination, and row selection in data tables.',
    difficulty: 'Intermediate',
    path: '/challenges/data-tables',
    category: 'Data',
  },
  {
    id: 'modals',
    title: 'Modals & Dialogs',
    description: 'Test modal dialogs, confirmation prompts, forms in modals, nested modals, and focus trapping.',
    difficulty: 'Intermediate',
    path: '/challenges/modals',
    category: 'Interactions',
  },
  {
    id: 'network-mocking',
    title: 'Network Mocking',
    description: 'Learn to intercept and mock API requests using page.route() for reliable tests.',
    difficulty: 'Advanced',
    path: '/challenges/network-mocking',
    category: 'API',
  },
  {
    id: 'visual-testing',
    title: 'Visual Testing',
    description: 'Capture screenshots for visual regression testing. Learn to mask dynamic content like dates and counters.',
    difficulty: 'Intermediate',
    path: '/challenges/visual-testing',
    category: 'Visual',
  },
]

const difficultyColors = {
  Beginner: 'bg-green-700 text-white',
  Intermediate: 'bg-yellow-600 text-black',
  Advanced: 'bg-red-700 text-white',
}

function Home() {
  const { getStatus, setStatus } = useProgressStore()

  // Calculate progress
  const completedCount = challenges.filter(c => getStatus(c.id) === 'completed').length
  const totalCount = challenges.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="retro-success">[COMPLETED]</span>
      case 'in_progress':
        return <span className="retro-warning">[IN PROGRESS]</span>
      default:
        return <span className="text-gray-600">[NOT STARTED]</span>
    }
  }

  return (
    <div>
      <center>
        <h2 className="text-xl font-bold mb-2">
          Welcome to Test Automation Practice!
        </h2>
        <p className="mb-4 text-blue-900">
          <i>Your one-stop shop for learning test automation!</i>
        </p>
      </center>

      <hr />

      {/* Getting Started Guide */}
      <div className="retro-panel-raised p-4 mt-4 mb-4" data-testid="getting-started">
        <h3 className="text-lg font-bold mb-2">Getting Started</h3>
        <p className="text-sm mb-3">
          This app helps you learn <strong>Playwright test automation</strong> through hands-on practice.
          Each challenge teaches different testing concepts with real, interactive examples.
        </p>
        <div className="text-sm mb-3">
          <strong>How to use this app:</strong>
          <ol className="list-decimal ml-6 mt-1">
            <li>Pick a challenge from the catalog below</li>
            <li>Interact with the demo to understand the feature</li>
            <li>Click <strong>"Show Test Hints"</strong> to see example Playwright code</li>
            <li>Write your own tests using the examples as a guide</li>
          </ol>
        </div>
        <div className="text-sm">
          <strong>Recommended order for beginners:</strong>{' '}
          <span className="text-blue-800">
            Simple Form → Checkboxes → Login → Loading States → Modals → Data Tables
          </span>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="retro-panel p-3 mb-4 text-center" data-testid="progress-summary">
        <strong>Progress:</strong>{' '}
        <span data-testid="progress-count">{completedCount}/{totalCount}</span> challenges completed
        {completedCount === totalCount && completedCount > 0 && (
          <span className="ml-2 retro-success">★ All complete! ★</span>
        )}
      </div>

      <h3 className="text-lg font-bold mb-2">
        Challenge Catalog
      </h3>

      <p className="mb-4 text-sm">
        Click on a challenge below to get started. Track your progress as you complete each one!
      </p>

      <table className="retro-table w-full" data-testid="challenge-table">
        <thead>
          <tr>
            <th>Challenge</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => {
            const status = getStatus(challenge.id)
            return (
              <tr key={challenge.id} data-testid={`challenge-row-${challenge.id}`}>
                <td>
                  <strong>{challenge.title}</strong>
                  <br />
                  <small>{challenge.description}</small>
                </td>
                <td>{challenge.category}</td>
                <td>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs ${difficultyColors[challenge.difficulty]}`}
                  >
                    {challenge.difficulty}
                  </span>
                </td>
                <td data-testid={`status-${challenge.id}`}>
                  {getStatusBadge(status)}
                </td>
                <td>
                  <Link
                    to={challenge.path}
                    className="retro-button inline-block no-underline text-black"
                    data-testid={`start-${challenge.id}`}
                  >
                    {status === 'not_started' ? 'Start' : 'Continue'}
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <hr />

      <div className="mt-4 retro-panel p-4">
        <h4 className="font-bold mb-2">Progress Controls</h4>
        <p className="text-sm mb-2">
          Use these controls to manage your challenge progress (stored in localStorage):
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            className="retro-button"
            onClick={() => {
              challenges.forEach((c) => setStatus(c.id, 'completed'))
            }}
            data-testid="mark-all-complete"
          >
            Mark All Complete
          </button>
          <button
            className="retro-button"
            onClick={() => {
              useProgressStore.getState().resetAll()
            }}
            data-testid="reset-progress"
          >
            Reset All Progress
          </button>
        </div>
      </div>

      <hr />

      <center>
        <p className="text-sm mt-4">
          More challenges coming soon!
          <br />
          <span className="text-xs">
            (Infinite scroll, shadow DOM, and more!)
          </span>
        </p>
        <p className="text-xs mt-2">
          <a href="#top">[Back to Top]</a>
        </p>
      </center>
    </div>
  )
}

export default Home
