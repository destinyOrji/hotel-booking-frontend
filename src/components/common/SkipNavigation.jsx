import './SkipNavigation.css'

const SkipNavigation = () => {
  return (
    <div className="skip-navigation">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
    </div>
  )
}

export default SkipNavigation
