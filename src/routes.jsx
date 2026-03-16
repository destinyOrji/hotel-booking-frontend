import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoadingSpinner, ProtectedRoute } from './components/common'
import AdminLayout from './components/layout/AdminLayout'
import UserLayout from './components/layout/UserLayout'

// Eager load critical pages
import Home from './pages/user/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Lazy load user pages
const RoomListing = lazy(() => import('./pages/user/RoomListing'))
const RoomDetail = lazy(() => import('./pages/user/RoomDetail'))
const Booking = lazy(() => import('./pages/user/Booking'))
const Checkout = lazy(() => import('./pages/user/Checkout'))
const Confirmation = lazy(() => import('./pages/user/Confirmation'))
const Profile = lazy(() => import('./pages/user/Profile'))
const BookingDetail = lazy(() => import('./pages/user/BookingDetail'))
const About = lazy(() => import('./pages/user/About'))
const Contact = lazy(() => import('./pages/user/Contact'))
const FAQ = lazy(() => import('./pages/user/FAQ'))

// Lazy load policy pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy'))

// Lazy load auth pages
const PasswordRecovery = lazy(() => import('./pages/auth/PasswordRecovery'))
const PasswordReset = lazy(() => import('./pages/auth/PasswordReset'))
const AdminRegister = lazy(() => import('./pages/auth/AdminRegister'))

// Lazy load admin pages (separate chunk)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const RoomManagement = lazy(() => import('./pages/admin/RoomManagement'))
const RoomCreate = lazy(() => import('./pages/admin/RoomCreate'))
const RoomEdit = lazy(() => import('./pages/admin/RoomEdit'))
const BookingManagement = lazy(() => import('./pages/admin/BookingManagement'))
const AvailabilityManagement = lazy(() => import('./pages/admin/AvailabilityManagement'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'))
const Promotions = lazy(() => import('./pages/admin/Promotions'))
const PromotionManagement = lazy(() => import('./pages/admin/PromotionManagement'))
const ContactManagement = lazy(() => import('./pages/admin/ContactManagement'))

// Lazy load error pages
const NotFound = lazy(() => import('./pages/NotFound'))
const Forbidden = lazy(() => import('./pages/Forbidden'))

// Loading fallback component
const PageLoader = () => (
  <LoadingSpinner fullScreen message="Loading page..." />
)

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* User pages with layout */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/rooms" element={<UserLayout><RoomListing /></UserLayout>} />
        <Route path="/rooms/:id" element={<UserLayout><RoomDetail /></UserLayout>} />
        <Route path="/about" element={<UserLayout><About /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/faq" element={<UserLayout><FAQ /></UserLayout>} />
        
        {/* Policy pages with layout */}
        <Route path="/privacy" element={<UserLayout><PrivacyPolicy /></UserLayout>} />
        <Route path="/terms" element={<UserLayout><TermsOfService /></UserLayout>} />
        <Route path="/cancellation" element={<UserLayout><CancellationPolicy /></UserLayout>} />
        
        {/* Protected user pages with layout */}
        <Route path="/booking" element={<UserLayout><ProtectedRoute><Booking /></ProtectedRoute></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><ProtectedRoute><Checkout /></ProtectedRoute></UserLayout>} />
        <Route path="/confirmation/:id" element={<UserLayout><ProtectedRoute><Confirmation /></ProtectedRoute></UserLayout>} />
        <Route path="/profile" element={<UserLayout><ProtectedRoute><Profile /></ProtectedRoute></UserLayout>} />
        <Route path="/profile/bookings/:id" element={<UserLayout><ProtectedRoute><BookingDetail /></ProtectedRoute></UserLayout>} />
        
        {/* Auth pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        
        {/* Error Pages */}
        <Route path="/forbidden" element={<Forbidden />} />
        
        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><RoomManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/rooms/new" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><RoomCreate /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/rooms/:id/edit" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><RoomEdit /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><BookingManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/availability" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><AvailabilityManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute requiredRole="admin"><AdminLayout><StaffManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><Promotions /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotion-management" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><PromotionManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute requiredRole={['admin', 'staff']}><AdminLayout><ContactManagement /></AdminLayout></ProtectedRoute>} />
        
        {/* 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
