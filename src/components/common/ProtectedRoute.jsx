import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loader while checking authentication
  if (isLoading) {
    return <Loader fullScreen />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access only after authentication is confirmed
  if (requiredRole && user) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    
    if (!user.role || !allowedRoles.includes(user.role)) {
      // User is authenticated but doesn't have the required role
      return <Navigate to="/forbidden" replace />
    }
  }

  return children
}

export default ProtectedRoute
