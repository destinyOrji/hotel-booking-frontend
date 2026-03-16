import './LoadingSpinner.css'

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = '' }) => {
  const sizeClass = `spinner-${size}`
  
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className={`loading-spinner ${sizeClass}`}>
          <div className="spinner"></div>
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    )
  }

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
