import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary, ToastProvider } from './components/common'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { AdminProvider } from './context/AdminContext'
import AppRoutes from './routes'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <BookingProvider>
            <AdminProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </AdminProvider>
          </BookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
