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
import staffService from '../../services/staffService'
import { formatDate } from '../../utils/formatters'
import './StaffManagement.css'

const ROLES = ['staff', 'admin']
const PERMISSIONS = [
  'manage_rooms',
  'manage_bookings',
  'manage_users',
  'view_reports',
  'manage_promotions',
  'manage_staff',
  'manage_settings'
]

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modals
  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState({ isOpen: false, staff: null })
  const [roleModal, setRoleModal] = useState({ isOpen: false, staff: null })
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, staff: null })

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    permissions: []
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Role form state
  const [roleForm, setRoleForm] = useState({
    role: 'staff',
    permissions: []
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [staff, searchQuery, roleFilter, statusFilter])

  const fetchStaff = async () => {
    setLoading(true)
    setError('')
    
    const result = await staffService.getAllStaff()
    
    if (result.success) {
      setStaff(result.data)
      setFilteredStaff(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...staff]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(member => 
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      )
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role === roleFilter)
    }

    if (statusFilter) {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(member => member.isActive === isActive)
    }

    setFilteredStaff(filtered)
  }

  const handleSort = ({ key, direction }) => {
    const sorted = [...filteredStaff].sort((a, b) => {
      let aVal = a[key]
      let bVal = b[key]

      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
    setFilteredStaff(sorted)
  }

  const handleCreateClick = () => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'staff',
      permissions: []
    })
    setCreateModal(true)
  }

  const handleCreateSubmit = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const result = await staffService.createStaff(createForm)

    if (result.success) {
      showToast('Staff account created successfully', 'success')
      setCreateModal(false)
      fetchStaff()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleEditClick = (member) => {
    setEditForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || ''
    })
    setEditModal({ isOpen: true, staff: member })
  }

  const handleEditSubmit = async () => {
    if (!editModal.staff) return

    const result = await staffService.updateStaff(editModal.staff._id, editForm)

    if (result.success) {
      showToast('Staff updated successfully', 'success')
      setEditModal({ isOpen: false, staff: null })
      fetchStaff()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleRoleClick = (member) => {
    setRoleForm({
      role: member.role || 'staff',
      permissions: member.permissions || []
    })
    setRoleModal({ isOpen: true, staff: member })
  }

  const handleRoleSubmit = async () => {
    if (!roleModal.staff) return

    const result = await staffService.updateStaffRole(roleModal.staff._id, roleForm)

    if (result.success) {
      showToast('Staff role updated successfully', 'success')
      setRoleModal({ isOpen: false, staff: null })
      fetchStaff()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleStatusToggleClick = (member) => {
    setStatusDialog({ isOpen: true, staff: member })
  }

  const handleStatusToggleConfirm = async () => {
    if (!statusDialog.staff) return

    const result = await staffService.toggleStaffStatus(statusDialog.staff._id)

    if (result.success) {
      showToast(
        `Staff ${statusDialog.staff.isActive ? 'deactivated' : 'activated'} successfully`,
        'success'
      )
      setStatusDialog({ isOpen: false, staff: null })
      fetchStaff()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handlePermissionToggle = (permission) => {
    const currentPermissions = createModal ? createForm.permissions : roleForm.permissions
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission]

    if (createModal) {
      setCreateForm({ ...createForm, permissions: newPermissions })
    } else {
      setRoleForm({ ...roleForm, permissions: newPermissions })
    }
  }

  const handleRefresh = () => {
    setSearchQuery('')
    setRoleFilter('')
    setStatusFilter('')
    fetchStaff()
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
          {value}
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
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value) => value ? formatDate(value) : 'Never'
    }
  ]

  const renderActions = (member) => (
    <div className="table-actions">
      <Button
        variant="primary"
        size="small"
        onClick={() => handleEditClick(member)}
      >
        Edit
      </Button>
      <Button
        variant="outline"
        size="small"
        onClick={() => handleRoleClick(member)}
      >
        Role
      </Button>
      <Button
        variant={member.isActive ? 'danger' : 'success'}
        size="small"
        onClick={() => handleStatusToggleClick(member)}
      >
        {member.isActive ? 'Deactivate' : 'Activate'}
      </Button>
    </div>
  )

  if (loading && staff.length === 0) {
    return <Loader fullScreen />
  }

  return (
    <div className="staff-management">
      <div className="page-header">
        <div>
          <h1>Staff Management</h1>
          <p className="page-description">Manage staff accounts and permissions</p>
        </div>
        <div className="header-actions">
          <Button onClick={handleRefresh} variant="outline">
            Refresh
          </Button>
          <Button onClick={handleCreateClick} variant="primary">
            Add Staff
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="filters-section">
        <div className="filter-group search-group">
          <label htmlFor="search-input">Search Staff</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="role-filter">Role</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredStaff}
        onSort={handleSort}
        actions={renderActions}
      />

      {/* Create Staff Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create Staff Account"
        size="large"
      >
        <div className="staff-form">
          <div className="form-group">
            <label htmlFor="create-name">Name *</label>
            <input
              id="create-name"
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-email">Email *</label>
            <input
              id="create-email"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-password">Password *</label>
            <input
              id="create-password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-phone">Phone</label>
            <input
              id="create-phone"
              type="tel"
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-role">Role *</label>
            <select
              id="create-role"
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              className="form-select"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permissions</label>
            <div className="permissions-grid">
              {PERMISSIONS.map(permission => (
                <label key={permission} className="permission-checkbox">
                  <input
                    type="checkbox"
                    checked={createForm.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                  />
                  <span>{permission.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSubmit}
            >
              Create Staff
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, staff: null })}
        title="Edit Staff"
      >
        <div className="staff-form">
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
              onClick={() => setEditModal({ isOpen: false, staff: null })}
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

      {/* Update Role Modal */}
      <Modal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal({ isOpen: false, staff: null })}
        title="Update Role & Permissions"
        size="large"
      >
        <div className="staff-form">
          <div className="form-group">
            <label htmlFor="role-select">Role</label>
            <select
              id="role-select"
              value={roleForm.role}
              onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
              className="form-select"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permissions</label>
            <div className="permissions-grid">
              {PERMISSIONS.map(permission => (
                <label key={permission} className="permission-checkbox">
                  <input
                    type="checkbox"
                    checked={roleForm.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                  />
                  <span>{permission.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setRoleModal({ isOpen: false, staff: null })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRoleSubmit}
            >
              Update Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        title={`${statusDialog.staff?.isActive ? 'Deactivate' : 'Activate'} Staff`}
        message={`Are you sure you want to ${statusDialog.staff?.isActive ? 'deactivate' : 'activate'} ${statusDialog.staff?.name}? ${statusDialog.staff?.isActive ? 'This will revoke their access to the admin panel.' : 'This will restore their access to the admin panel.'}`}
        confirmText={statusDialog.staff?.isActive ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        type={statusDialog.staff?.isActive ? 'danger' : 'success'}
        onConfirm={handleStatusToggleConfirm}
        onCancel={() => setStatusDialog({ isOpen: false, staff: null })}
      />
    </div>
  )
}

export default StaffManagement
