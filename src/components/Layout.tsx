import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState, useEffect } from 'react'

function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [visitorCount, setVisitorCount] = useState(0)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Helper for nav link styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-bold text-red-700' : ''

  useEffect(() => {
    // Fake visitor counter that persists in localStorage
    const stored = localStorage.getItem('visitor-count')
    const count = stored ? parseInt(stored, 10) + 1 : 1337
    localStorage.setItem('visitor-count', count.toString())
    setVisitorCount(count)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Under Construction Banner */}
      {isHomePage && (
        <div className="under-construction py-1">
          <span className="blink">***</span> UNDER CONSTRUCTION - Please Mind the Gap <span className="blink">***</span>
        </div>
      )}

      {/* Header */}
      <header className="retro-panel-raised p-4 relative">

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold m-0">
                <Link to="/" className="no-underline text-black hover:text-black">
                  Test Automation Practice
                </Link>
              </h1>
              <p className="text-sm m-0 mt-1">
                <i>Your #2 source for Software Testing practice!</i>
              </p>
            </div>
            <div className="text-right text-sm">
              {isHomePage && (
                <>
                  <div className="mb-1 text-xs">You are visitor #</div>
                  <div className="odometer" data-testid="visitor-counter">
                    {visitorCount.toString().padStart(6, '0').split('').map((digit, i) => (
                      <span key={i} className="odometer-digit">{digit}</span>
                    ))}
                  </div>
                </>
              )}
              {isAuthenticated && (
                <div className="mt-2">
                  Logged in as: <strong>{user?.username}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 pt-4 border-t-2 border-gray-500" aria-label="Main navigation">
            <ul className="flex flex-wrap gap-4 list-none m-0 p-0">
              <li>
                <NavLink to="/" end className={navLinkClass} data-testid="nav-home">[Home]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/simple-form" className={navLinkClass} data-testid="nav-simple-form">[Simple Form]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/checkboxes-radios" className={navLinkClass} data-testid="nav-checkboxes-radios">[Checkboxes]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/login" className={navLinkClass} data-testid="nav-login">[Login]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/loading-states" className={navLinkClass} data-testid="nav-loading">[Loading States]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/protected" className={navLinkClass} data-testid="nav-protected">[Protected Page]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/drag-drop" className={navLinkClass} data-testid="nav-drag-drop">[Drag & Drop]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/data-tables" className={navLinkClass} data-testid="nav-data-tables">[Data Tables]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/modals" className={navLinkClass} data-testid="nav-modals">[Modals]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/network-mocking" className={navLinkClass} data-testid="nav-network-mocking">[Network]</NavLink>
              </li>
              <li>
                <NavLink to="/challenges/visual-testing" className={navLinkClass} data-testid="nav-visual-testing">[Visual]</NavLink>
              </li>
              {isAuthenticated && (
                <li>
                  <button
                    onClick={logout}
                    className="retro-button"
                    data-testid="logout-button"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Marquee */}
      {isHomePage && (
        <div className="bg-blue-900 text-yellow-200 py-1 retro-marquee">
          <span className="retro-marquee-content">
            Welcome to Test Automation Practice!!! Learn to write tests like a PRO!!!
            New challenges added regularly!!! Best viewed on Freeserve dial-up!!!
            As featured on Teletext page 888!!! You ARE the Weakest Link... Goodbye!!!
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {!isHomePage && (
            <div className="mb-2">
              <Link to="/" className="text-sm" data-testid="back-to-challenges">
                ← Back to Challenges
              </Link>
            </div>
          )}
          <div className="retro-window">
            <div className="retro-window-title">
              <span>Challenge Window</span>
              <span className="flex gap-1">
                <span className="w-4 h-3 bg-gray-300 border border-gray-500 text-center text-xs leading-none">_</span>
                <span className="w-4 h-3 bg-gray-300 border border-gray-500 text-center text-xs leading-none">X</span>
              </span>
            </div>
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="retro-panel-raised p-4 text-center text-sm">
        <hr />

        {isHomePage ? (
          <>
            {/* Award Badges */}
            <div className="flex justify-center gap-4 flex-wrap mb-4">
              <div className="award-badge">
                <div className="award-badge-star">★</div>
                <div className="award-badge-text">TOP 100%</div>
                <div className="award-badge-subtext">of the Web</div>
              </div>
              <div className="award-badge gold">
                <div className="award-badge-star">★</div>
                <div className="award-badge-text">BRILLIANT</div>
                <div className="award-badge-subtext">Site Award</div>
              </div>
              <div className="award-badge blue">
                <div className="award-badge-star">★</div>
                <div className="award-badge-text">BARELY</div>
                <div className="award-badge-subtext">Interactive</div>
              </div>
            </div>

            {/* Teletext Badge */}
            <div className="flex justify-center mb-4">
              <div className="teletext-badge">
                <span className="teletext-badge-text">As Seen On</span>
                <span className="teletext-badge-title">TELETEXT</span>
                <span className="teletext-badge-page">p.888</span>
              </div>
            </div>

            {/* Millionaire Lifelines */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              <div className="lifeline-badge">
                <span className="lifeline-badge-icon">📞</span>
                Phone a Friend
              </div>
              <div className="lifeline-badge">
                <span className="lifeline-badge-icon">👥</span>
                Ask the Audience
              </div>
              <div className="lifeline-badge">
                <span className="lifeline-badge-icon">½</span>
                50:50
              </div>
            </div>

            {/* Browser Badges */}
            <div className="flex justify-center gap-3 mb-4">
              <div className="browser-badge netscape">
                <span className="browser-badge-icon">N</span>
                <span className="browser-badge-text">Netscape<br/>NOW!</span>
              </div>
              <div className="browser-badge ie">
                <span className="browser-badge-icon">e</span>
                <span className="browser-badge-text">Internet<br/>Explorer</span>
              </div>
              <div className="browser-badge freeserve">
                <span className="browser-badge-icon">f</span>
                <span className="browser-badge-text">Freeserve<br/>User</span>
              </div>
            </div>

            <p className="m-0">
              Made with {'<'}TABLE{'>'} tags.
            </p>
            <p className="m-0 mt-2">
              <a href="mailto:example@example.com">Email the Webmaster</a> |
              <a href="#" className="ml-2">Sign my Guestbook</a> |
              <a href="#" className="ml-2">View Source</a>
            </p>
            <p className="m-0 mt-1 text-xs">
              <i>Cheerio!</i>
            </p>

            <hr />

            {/* Web Ring */}
            <div className="webring my-3">
              <div className="webring-title">
                ◄ Test Automation Practice WebRing ►
              </div>
              <div className="webring-nav">
                <a href="#">[← Prev]</a>
                <a href="#">[Random]</a>
                <a href="#">[List]</a>
                <a href="#">[Next →]</a>
              </div>
            </div>

            <hr />

            <p className="m-0 mt-2 text-xs">
              Best viewed at <strong>800x600</strong> resolution with <strong>16-bit colour</strong>
            </p>
            <p className="m-0 mt-1 text-xs text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-GB')} | This page is a page.
            </p>
          </>
        ) : (
          <p className="m-0 text-xs text-gray-600">
            <Link to="/">Test Automation Practice</Link>
          </p>
        )}
      </footer>
    </div>
  )
}

export default Layout
