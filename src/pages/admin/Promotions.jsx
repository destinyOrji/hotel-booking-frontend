import { useState, useEffect } from 'react'
import { format, isAfter, isBefore } from 'date-fns'
import promotionService from '../../services/promotionService'
import PromotionForm from '../../components/admin/PromotionForm'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import { PROMOTION_STATUS, DISCOUNT_TYPES } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'
import './Promotions.css'

const Promotions = () => {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, promotion: null })
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    fetchPromotions()
  }, [])

  useEffect(() => {
    // Check for expired promotions and deactivate them
    const checkExpiredPromotions = () => {
      const now = new Date()
      promotions.forEach(async (promo) => {
        if (promo.status === PROMOTION_STATUS.ACTIVE && isAfter(now, new Date(promo.validTo))) {
          // Automatically deactivate expired promotion
          await promotionService.updatePromotion(promo.id, {
            ...promo,
            status: PROMOTION_STATUS.EXPIRED
          })
        }
      })
    }

    const interval = setInterval(checkExpiredPromotions, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [promotions])

  const fetchPromotions = async () => {
    setLoading(true)
    setError('')
    const result = await promotionService.getPromotions()
    
    if (result.success) {
      setPromotions(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const getPromotionStatus = (promotion) => {
    const now = new Date()
    const validFrom = new Date(promotion.validFrom)
    const validTo = new Date(promotion.validTo)

    if (isAfter(now, validTo)) {
      return PROMOTION_STATUS.EXPIRED
    } else if (isBefore(now, validFrom)) {
      return PROMOTION_STATUS.SCHEDULED
    } else {
      return PROMOTION_STATUS.ACTIVE
    }
  }

  const filterPromotionsByStatus = (status) => {
    return promotions.filter(promo => getPromotionStatus(promo) === status)
  }

  const handleCreatePromotion = () => {
    setEditingPromotion(null)
    setIsFormOpen(true)
  }

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (promotion) => {
    setDeleteModal({ isOpen: true, promotion })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.promotion) return
    
    const result = await promotionService.deletePromotion(deleteModal.promotion.id)
    
    if (result.success) {
      setSuccess('Promotion deleted successfully')
      setDeleteModal({ isOpen: false, promotion: null })
      fetchPromotions()
    } else {
      setError(result.error)
      setDeleteModal({ isOpen: false, promotion: null })
    }
  }

  const handleFormSubmit = async (promotionData) => {
    let result

    if (editingPromotion) {
      result = await promotionService.updatePromotion(editingPromotion.id, promotionData)
    } else {
      result = await promotionService.createPromotion(promotionData)
    }

    if (result.success) {
      setSuccess(editingPromotion ? 'Promotion updated successfully' : 'Promotion created successfully')
      setIsFormOpen(false)
      setEditingPromotion(null)
      fetchPromotions()
    } else {
      setError(result.error)
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingPromotion(null)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      [PROMOTION_STATUS.ACTIVE]: 'status-badge status-active',
      [PROMOTION_STATUS.SCHEDULED]: 'status-badge status-scheduled',
      [PROMOTION_STATUS.EXPIRED]: 'status-badge status-expired'
    }
    
    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status}
      </span>
    )
  }

  const formatDiscount = (promotion) => {
    if (promotion.discountType === DISCOUNT_TYPES.PERCENTAGE) {
      return `${promotion.discountValue}%`
    }
    return formatPrice(promotion.discountValue)
  }

  const renderPromotionCard = (promotion) => {
    const status = getPromotionStatus(promotion)
    const usagePercentage = promotion.usageLimit 
      ? (promotion.usageCount / promotion.usageLimit) * 100 
      : 0

    return (
      <div key={promotion.id} className="promotion-card">
        <div className="promotion-header">
          <div>
            <h3 className="promotion-code">{promotion.code}</h3>
            <p className="promotion-description">{promotion.description}</p>
          </div>
          {getStatusBadge(status)}
        </div>

        <div className="promotion-details">
          <div className="promotion-detail-item">
            <span className="detail-label">Discount:</span>
            <span className="detail-value discount-value">{formatDiscount(promotion)}</span>
          </div>

          <div className="promotion-detail-item">
            <span className="detail-label">Valid Period:</span>
            <span className="detail-value">
              {format(new Date(promotion.validFrom), 'MMM dd, yyyy')} - {format(new Date(promotion.validTo), 'MMM dd, yyyy')}
            </span>
          </div>

          {promotion.usageLimit && (
            <div className="promotion-detail-item">
              <span className="detail-label">Usage:</span>
              <div className="usage-info">
                <span className="detail-value">
                  {promotion.usageCount || 0} / {promotion.usageLimit}
                </span>
                <div className="usage-bar">
                  <div 
                    className="usage-bar-fill" 
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="promotion-detail-item">
            <span className="detail-label">Applicable Rooms:</span>
            <span className="detail-value">
              {promotion.applicableRooms?.length || 0} room(s)
            </span>
          </div>
        </div>

        <div className="promotion-actions">
          <Button
            variant="outline"
            size="small"
            onClick={() => handleEditPromotion(promotion)}
            disabled={status === PROMOTION_STATUS.EXPIRED}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDeleteClick(promotion)}
          >
            Delete
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader fullScreen />
  }

  const activePromotions = filterPromotionsByStatus(PROMOTION_STATUS.ACTIVE)
  const scheduledPromotions = filterPromotionsByStatus(PROMOTION_STATUS.SCHEDULED)
  const expiredPromotions = filterPromotionsByStatus(PROMOTION_STATUS.EXPIRED)

  return (
    <div className="promotions-page">
      <div className="page-header">
        <div>
          <h1>Promotions Management</h1>
          <p className="page-description">Create and manage promotional offers and discount codes</p>
        </div>
        <Button onClick={handleCreatePromotion}>
          + Create Promotion
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      <div className="promotions-tabs">
        <button
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activePromotions.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled ({scheduledPromotions.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          Expired ({expiredPromotions.length})
        </button>
      </div>

      <div className="promotions-content">
        {activeTab === 'active' && (
          <div className="promotions-grid">
            {activePromotions.length > 0 ? (
              activePromotions.map(renderPromotionCard)
            ) : (
              <div className="empty-state">
                <p>No active promotions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="promotions-grid">
            {scheduledPromotions.length > 0 ? (
              scheduledPromotions.map(renderPromotionCard)
            ) : (
              <div className="empty-state">
                <p>No scheduled promotions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expired' && (
          <div className="promotions-grid">
            {expiredPromotions.length > 0 ? (
              expiredPromotions.map(renderPromotionCard)
            ) : (
              <div className="empty-state">
                <p>No expired promotions</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
        size="large"
      >
        <PromotionForm
          promotion={editingPromotion}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, promotion: null })}
        title="Delete Promotion"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete the promotion <strong>{deleteModal.promotion?.code}</strong>?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, promotion: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Promotions
