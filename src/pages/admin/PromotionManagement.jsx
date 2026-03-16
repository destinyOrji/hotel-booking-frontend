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
import promotionService from '../../services/promotionService'
import { formatPrice } from '../../utils/formatters'
import './PromotionManagement.css'

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([])
  const [filteredPromotions, setFilteredPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [formModal, setFormModal] = useState({ isOpen: false, promotion: null })
  const [usageModal, setUsageModal] = useState({ isOpen: false, promotion: null, usage: null })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, promotion: null })

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    minBookingAmount: '',
    applicableRooms: [],
    isActive: true
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [promotions, statusFilter, searchQuery])

  const fetchPromotions = async () => {
    setLoading(true)
    setError('')
    
    const result = await promotionService.getPromotions()
    
    if (result.success) {
      setPromotions(result.data)
      setFilteredPromotions(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...promotions]

    if (statusFilter) {
      filtered = filtered.filter(promo => getPromotionStatus(promo) === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(promo => 
        promo.code?.toLowerCase().includes(query) ||
        promo.description?.toLowerCase().includes(query)
      )
    }

    setFilteredPromotions(filtered)
  }

  const getPromotionStatus = (promotion) => {
    const now = new Date()
    const validFrom = new Date(promotion.validFrom)
    const validTo = new Date(promotion.validTo)

    if (!promotion.isActive) {
      return 'inactive'
    } else if (now > validTo) {
      return 'expired'
    } else if (now < validFrom) {
      return 'scheduled'
    } else {
      return 'active'
    }
  }

  const handleSort = ({ key, direction }) => {
    const sorted = [...filteredPromotions].sort((a, b) => {
      let aVal = a[key]
      let bVal = b[key]

      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
    setFilteredPromotions(sorted)
  }

  const handleCreateClick = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      minBookingAmount: '',
      applicableRooms: [],
      isActive: true
    })
    setFormModal({ isOpen: true, promotion: null })
  }

  const handleEditClick = (promotion) => {
    setFormData({
      code: promotion.code || '',
      description: promotion.description || '',
      discountType: promotion.discountType || 'percentage',
      discountValue: promotion.discountValue || '',
      validFrom: promotion.validFrom ? new Date(promotion.validFrom).toISOString().split('T')[0] : '',
      validTo: promotion.validTo ? new Date(promotion.validTo).toISOString().split('T')[0] : '',
      usageLimit: promotion.usageLimit || '',
      minBookingAmount: promotion.minBookingAmount || '',
      applicableRooms: promotion.applicableRooms || [],
      isActive: promotion.isActive !== false
    })
    setFormModal({ isOpen: true, promotion })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const promotionData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      minBookingAmount: formData.minBookingAmount ? parseFloat(formData.minBookingAmount) : null
    }

    let result
    if (formModal.promotion) {
      result = await promotionService.updatePromotion(formModal.promotion._id, promotionData)
    } else {
      result = await promotionService.createPromotion(promotionData)
    }

    if (result.success) {
      showToast(
        formModal.promotion ? 'Promotion updated successfully' : 'Promotion created successfully',
        'success'
      )
      setFormModal({ isOpen: false, promotion: null })
      fetchPromotions()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleToggleStatus = async (promotion) => {
    const result = await promotionService.togglePromotionStatus(promotion._id)

    if (result.success) {
      showToast(
        `Promotion ${result.data.isActive ? 'activated' : 'deactivated'} successfully`,
        'success'
      )
      fetchPromotions()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleViewUsage = async (promotion) => {
    const result = await promotionService.getPromotionUsage(promotion._id)

    if (result.success) {
      setUsageModal({ isOpen: true, promotion, usage: result.data })
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleDeleteClick = (promotion) => {
    setDeleteDialog({ isOpen: true, promotion })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.promotion) return

    const result = await promotionService.deletePromotion(deleteDialog.promotion._id)

    if (result.success) {
      showToast('Promotion deleted successfully', 'success')
      setDeleteDialog({ isOpen: false, promotion: null })
      fetchPromotions()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleRefresh = () => {
    setStatusFilter('')
    setSearchQuery('')
    fetchPromotions()
  }

  const formatDiscount = (promotion) => {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}%`
    }
    return formatPrice(promotion.discountValue)
  }

  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value) => <strong>{value}</strong>
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true
    },
    {
      key: 'discount',
      label: 'Discount',
      sortable: false,
      render: (_, row) => formatDiscount(row)
    },
    {
      key: 'validFrom',
      label: 'Valid From',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'validTo',
      label: 'Valid To',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'usage',
      label: 'Usage',
      sortable: false,
      render: (_, row) => {
        if (row.usageLimit) {
          return `${row.usageCount || 0} / ${row.usageLimit}`
        }
        return row.usageCount || 0
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_, row) => <StatusBadge status={getPromotionStatus(row)} />
    }
  ]

  const renderActions = (promotion) => (
    <div className="table-actions">
      <Button
        variant="outline"
        size="small"
        onClick={() => handleViewUsage(promotion)}
      >
        Usage
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => handleEditClick(promotion)}
      >
        Edit
      </Button>
      <Button
        variant={promotion.isActive ? 'warning' : 'success'}
        size="small"
        onClick={() => handleToggleStatus(promotion)}
      >
        {promotion.isActive ? 'Deactivate' : 'Activate'}
      </Button>
      <Button
        variant="danger"
        size="small"
        onClick={() => handleDeleteClick(promotion)}
      >
        Delete
      </Button>
    </div>
  )

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="promotion-management">
      <div className="page-header">
        <div>
          <h1>Promotion Management</h1>
          <p className="page-description">Create and manage promotional offers and discount codes</p>
        </div>
        <div className="header-actions">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={handleCreateClick}>
            + Create Promotion
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPromotions}
        onSort={handleSort}
        actions={renderActions}
      />

      {/* Create/Edit Promotion Modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, promotion: null })}
        title={formModal.promotion ? 'Edit Promotion' : 'Create Promotion'}
        size="large"
      >
        <form onSubmit={handleFormSubmit} className="promotion-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="code">Promotion Code *</label>
              <input
                id="code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                required
                placeholder="e.g., SUMMER2024"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountType">Discount Type *</label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleFormChange}
                required
                className="form-select"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              placeholder="Describe the promotion..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="discountValue">
                Discount Value * {formData.discountType === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                id="discountValue"
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleFormChange}
                required
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minBookingAmount">Min Booking Amount ($)</label>
              <input
                id="minBookingAmount"
                type="number"
                name="minBookingAmount"
                value={formData.minBookingAmount}
                onChange={handleFormChange}
                min="0"
                step="0.01"
                placeholder="Optional"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validFrom">Valid From *</label>
              <input
                id="validFrom"
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleFormChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="validTo">Valid To *</label>
              <input
                id="validTo"
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleFormChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="usageLimit">Usage Limit</label>
            <input
              id="usageLimit"
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleFormChange}
              min="1"
              placeholder="Leave empty for unlimited"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFormChange}
                className="form-checkbox"
              />
              <span>Active</span>
            </label>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormModal({ isOpen: false, promotion: null })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {formModal.promotion ? 'Update' : 'Create'} Promotion
            </Button>
          </div>
        </form>
      </Modal>

      {/* Usage Statistics Modal */}
      <Modal
        isOpen={usageModal.isOpen}
        onClose={() => setUsageModal({ isOpen: false, promotion: null, usage: null })}
        title="Promotion Usage Statistics"
        size="large"
      >
        {usageModal.promotion && usageModal.usage && (
          <div className="usage-stats">
            <div className="stats-header">
              <h3>{usageModal.promotion.code}</h3>
              <StatusBadge status={getPromotionStatus(usageModal.promotion)} />
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Uses</div>
                <div className="stat-value">{usageModal.usage.totalUses || 0}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Usage Limit</div>
                <div className="stat-value">
                  {usageModal.promotion.usageLimit || 'Unlimited'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Discount Given</div>
                <div className="stat-value">
                  {formatPrice(usageModal.usage.totalDiscountAmount || 0)}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Remaining Uses</div>
                <div className="stat-value">
                  {usageModal.promotion.usageLimit 
                    ? usageModal.promotion.usageLimit - (usageModal.usage.totalUses || 0)
                    : 'Unlimited'}
                </div>
              </div>
            </div>

            {usageModal.usage.recentBookings && usageModal.usage.recentBookings.length > 0 && (
              <div className="recent-bookings">
                <h4>Recent Bookings</h4>
                <div className="bookings-list">
                  {usageModal.usage.recentBookings.map((booking, index) => (
                    <div key={index} className="booking-item">
                      <div className="booking-info">
                        <span className="booking-guest">{booking.guestName}</span>
                        <span className="booking-date">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="booking-discount">
                        -{formatPrice(booking.discountAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Promotion"
        message={`Are you sure you want to delete the promotion "${deleteDialog.promotion?.code}"? This action cannot be undone.`}
        confirmText="Delete Promotion"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, promotion: null })}
      />
    </div>
  )
}

export default PromotionManagement
