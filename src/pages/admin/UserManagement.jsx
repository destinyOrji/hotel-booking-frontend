import { useState, useEffect } from 'react'
import { 
  DataTable, 
  StatusBadge, 
  ConfirmDialog, 
  Button,
  Modal,
  Loader,
  Alert,
  useToast
} from '../../components/common'
import userService from '../../services/userService'
import { formatDate } from '../../utils/formatters'
import './UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modals
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, user: null })
  const [editModal, setEditModal] = useState({ isOpen: false, user: null })
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, user: null })

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchQuery, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    
    const result = await userService.getAllUsers(1, 1000)
    
    if (result.success) {
      setUsers(result.data.users || result.data)
      setFilteredUsers(result.data.users || result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...users]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
    }

    if (statusFilter) {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(user => user.isActive === isActive)
    }

    setFilteredUsers(filtered)
  }

  const handleSort = ({ key, direction }) => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let aVal = a[key]
      let bVal = b[key]

      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
    setFilteredUsers(sorted)
  }

  const handleViewDetails = async (user) => {
    setLoading(true)
    const result = await userService.getUserById(user._id)
    
    if (result.success) {
      // Backend returns nested structure with user, bookingHistory, and statistics
      const userData = result.data.user || result.data
      const bookings = result.data.bookingHistory || []
      setDetailsModal({ 
        isOpen: true, 
        user: { ...userData, bookings } 
      })
    } else {
      showToast(result.error, 'error')
    }
    setLoading(false)
  }

  const handleEditClick = (user) => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    })
    setEditModal({ isOpen: true, user })
  }

  const handleEditSubmit = async () => {
    if (!editModal.user) return

    const result = await userService.updateUser(editModal.user._id, editForm)

    if (result.success) {
      showToast('User updated successfully', 'success')
      setEditModal({ isOpen: false, user: null })
      fetchUsers()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleStatusToggleClick = (user) => {
    setStatusDialog({ isOpen: true, user })
  }

  const handleStatusToggleConfirm = async () => {
    if (!statusDialog.user) return

    const result = await userService.toggleUserStatus(statusDialog.user._id)

    if (result.success) {
      showToast(
        `User ${statusDialog.user.isActive ? 'deactivated' : 'activated'} successfully`,
        'success'
      )
      setStatusDialog({ isOpen: false, user: null })
      fetchUsers()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleRefresh = () => {
    setSearchQuery('')
    setStatusFilter('')
    fetchUsers()
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers()
      return
    }

    setLoading(true)
    const result = await userService.searchUsers(searchQuery)
    
    if (result.success) {
      setUsers(result.data)
      setFilteredUsers(result.data)
    } else {
      showToast(result.error, 'error')
    }
    setLoading(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      render: (value) => value || 'N/A'
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span className={`role-badge role-${value}`}>
          {value || 'user'}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'createdAt',
      label: 'Registered',
      sortable: true,
      render: (value) => formatDate(value)
    }
  ]

  const renderActions = (user) => (
    <div className="table-actions">
      <Button
        variant="outline"
        size="small"
        onClick={() => handleViewDetails(user)}
      >
        View
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => handleEditClick(user)}
      >
        Edit
      </Button>
      <Button
        variant={user.isActive ? 'danger' : 'success'}
        size="small"
        onClick={() => handleStatusToggleClick(user)}
      >
        {user.isActive ? 'Deactivate' : 'Activate'}
      </Button>
    </div>
  )

  if (loading && users.length === 0) {
    return <Loader fullScreen />
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-description">Manage customer accounts and view user information</p>
        </div>
        <Button onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="filters-section">
        <div className="filter-group search-group">
          <label htmlFor="search-input">Search Users</label>
          <div className="search-input-wrapper">
            <input
              id="search-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="filter-input"
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        onSort={handleSort}
        onRowClick={handleViewDetails}
        actions={renderActions}
      />

      {/* User Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, user: null })}
        title="User Details"
        size="large"
      >
        {detailsModal.user && (
          <div className="user-details">
            <div className="details-section">
              <h3>User Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{detailsModal.user.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{detailsModal.user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{detailsModal.user.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">
                    <span className={`role-badge role-${detailsModal.user.role || 'user'}`}>
                      {detailsModal.user.role || 'user'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <StatusBadge status={detailsModal.user.isActive ? 'active' : 'inactive'} />
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registered:</span>
                  <span className="detail-value">{formatDate(detailsModal.user.createdAt)}</span>
                </div>
                {detailsModal.user.lastLogin && (
                  <div className="detail-item">
                    <span className="detail-label">Last Login:</span>
                    <span className="detail-value">{formatDate(detailsModal.user.lastLogin)}</span>
                  </div>
                )}
              </div>
            </div>

            {detailsModal.user.bookings && detailsModal.user.bookings.length > 0 && (
              <div className="details-section">
                <h3>Booking History</h3>
                <div className="booking-history">
                  {detailsModal.user.bookings.map((booking) => (
                    <div key={booking._id} className="booking-item">
                      <div className="booking-info">
                        <div className="booking-room">
                          <strong>{booking.room?.name || 'Room'}</strong>
                        </div>
                        <div className="booking-dates">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </div>
                      </div>
                      <div className="booking-status">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!detailsModal.user.bookings || detailsModal.user.bookings.length === 0) && (
              <div className="details-section">
                <h3>Booking History</h3>
                <p className="no-bookings">No bookings found for this user.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        title="Edit User"
      >
        <div className="edit-user-modal">
          <div className="form-group">
            <label htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-phone">Phone</label>
            <input
              id="edit-phone"
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setEditModal({ isOpen: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        title={`${statusDialog.user?.isActive ? 'Deactivate' : 'Activate'} User`}
        message={`Are you sure you want to ${statusDialog.user?.isActive ? 'deactivate' : 'activate'} ${statusDialog.user?.name}? ${statusDialog.user?.isActive ? 'This will prevent them from logging in.' : 'This will allow them to log in again.'}`}
        confirmText={statusDialog.user?.isActive ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        type={statusDialog.user?.isActive ? 'danger' : 'success'}
        onConfirm={handleStatusToggleConfirm}
        onCancel={() => setStatusDialog({ isOpen: false, user: null })}
      />
    </div>
  )
}

export default UserManagement
