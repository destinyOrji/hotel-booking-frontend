import { Link, useNavigate } from 'react-router-dom'
import './Forbidden.css'

const Forbidden = () => {
  const navigate = useNavigate()

  return (
    <div className="forbidden-page">
      <div className="forbidden-content">
        <div className="forbidden-icon">🚫</div>
        <h1 className="forbidden-title">403</h1>
        <h2 className="forbidden-subtitle">Access Denied</h2>
        <p className="forbidden-message">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="forbidden-actions">
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Forbidden
