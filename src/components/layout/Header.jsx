import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const isAdmin = user?.role === 'admin' || user?.role === 'staff'

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header-nav') && !event.target.closest('.header-mobile-toggle')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Close menu when route changes
  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={handleLinkClick} aria-label="HotelBooking - Go to homepage">
          <img src="/images/logo/royal_logo.jpg" alt="Royal Elysaa Logo" className="header-logo-image" />
          <span aria-hidden="true">Royal Elysaa Hotel & Suites</span>
        </Link>

        <button
          className="header-mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <span className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav 
          id="main-navigation" 
          className={`header-nav ${isMenuOpen ? 'mobile-open' : ''}`}
          aria-label="Main navigation"
        >
          <ul className="header-nav-links" role="list">
            <li>
              <Link to="/rooms" className="header-nav-link" onClick={handleLinkClick}>
                Rooms
              </Link>
            </li>
            <li>
              <Link to="/about" className="header-nav-link" onClick={handleLinkClick}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="header-nav-link" onClick={handleLinkClick}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="header-nav-link" onClick={handleLinkClick}>
                <abbr title="Frequently Asked Questions">FAQ</abbr>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin/bookings" className="header-nav-link" onClick={handleLinkClick}>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {isAuthenticated ? (
            <div className="header-user-menu">
              <button
                className="header-user-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label={`User menu for ${user?.name}`}
                aria-controls="user-dropdown-menu"
              >
                <div className="header-user-avatar" aria-hidden="true">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="header-user-name">{user?.name}</span>
                <span className="dropdown-arrow" aria-hidden="true">{isUserMenuOpen ? '▲' : '▼'}</span>
              </button>
              {isUserMenuOpen && (
                <div 
                  id="user-dropdown-menu"
                  className="header-dropdown" 
                  role="menu"
                  aria-label="User account menu"
                >
                  <Link 
                    to="/profile" 
                    className="header-dropdown-item" 
                    onClick={handleLinkClick}
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/profile/bookings" 
                    className="header-dropdown-item" 
                    onClick={handleLinkClick}
                    role="menuitem"
                  >
                    My Bookings
                  </Link>
                  <button
                    className="header-dropdown-item"
                    onClick={() => {
                      logout()
                      setIsUserMenuOpen(false)
                      setIsMenuOpen(false)
                    }}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth-buttons">
              <Link to="/login" className="header-nav-link" onClick={handleLinkClick}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-small" onClick={handleLinkClick}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
