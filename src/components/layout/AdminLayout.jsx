import AdminSidebar from './AdminSidebar'
import SkipNavigation from '../common/SkipNavigation'
import { AdminProvider } from '../../context/AdminContext'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  return (
    <AdminProvider>
      <div className="admin-layout">
        <SkipNavigation />
        <AdminSidebar />
        <div className="admin-layout-content">
          <main id="main-content" className="admin-layout-main" role="main">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}

export default AdminLayout
