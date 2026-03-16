import { useState, useEffect } from 'react'
import { 
  DataTable, 
  StatusBadge, 
  ConfirmDialog, 
  DateRangePicker,
  Button,
  Modal,
  Loader,
  Alert,
  useToast
} from '../../components/common'
import bookingService from '../../services/bookingService'
import { formatPrice } from '../../utils/formatters'
import './BookingManagement.css'

const BookingManagement = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { showToast } = useToast()

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Modals
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, booking: null })
  const [statusModal, setStatusModal] = useState({ isOpen: false, booking: null, newStatus: '' })
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, booking: null })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [bookings, statusFilter, searchQuery, startDate, endDate])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    
    const filters = {}
    if (statusFilter) filters.status = statusFilter
    if (searchQuery) filters.search = searchQuery
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const result = await bookingService.getAllBookings(filters)
    
    if (result.success) {
      setBookings(result.data)
      setFilteredBookings(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...bookings]

    if (statusFilter) {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.guestInfo?.name?.toLowerCase().includes(query) ||
        booking.guestInfo?.email?.toLowerCase().includes(query) ||
        booking.room?.name?.toLowerCase().includes(query)
      )
    }

    if (startDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.checkIn) >= new Date(startDate)
      )
    }

    if (endDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.checkOut) <= new Date(endDate)
      )
    }

    setFilteredBookings(filtered)
  }

  const handleSort = ({ key, direction }) => {
    const sorted = [...filteredBookings].sort((a, b) => {
      let aVal = a[key]
      let bVal = b[key]

      // Handle nested properties
      if (key === 'guestName') {
        aVal = a.guestInfo?.name || ''
        bVal = b.guestInfo?.name || ''
      } else if (key === 'roomName') {
        aVal = a.room?.name || ''
        bVal = b.room?.name || ''
      }

      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
    setFilteredBookings(sorted)
  }

  const handleViewDetails = (booking) => {
    setDetailsModal({ isOpen: true, booking })
  }

  const handleStatusChange = (booking) => {
    setStatusModal({ isOpen: true, booking, newStatus: booking.status })
  }

  const handleStatusUpdate = async () => {
    if (!statusModal.booking || !statusModal.newStatus) return

    const result = await bookingService.updateBookingStatus(
      statusModal.booking._id,
      statusModal.newStatus
    )

    if (result.success) {
      showToast('Booking status updated successfully', 'success')
      setStatusModal({ isOpen: false, booking: null, newStatus: '' })
      fetchBookings()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleCancelClick = (booking) => {
    setCancelDialog({ isOpen: true, booking })
  }

  const handleCancelConfirm = async () => {
    if (!cancelDialog.booking) return

    const result = await bookingService.cancelBooking(cancelDialog.booking._id)

    if (result.success) {
      showToast('Booking cancelled successfully', 'success')
      setCancelDialog({ isOpen: false, booking: null })
      fetchBookings()
    } else {
      showToast(result.error, 'error')
    }
  }

  const handleRefresh = () => {
    setStatusFilter('')
    setSearchQuery('')
    setStartDate('')
    setEndDate('')
    fetchBookings()
  }

  const columns = [
    {
      key: 'guestName',
      label: 'Guest Name',
      sortable: true,
      render: (_, row) => row.guestInfo?.name || 'N/A'
    },
    {
      key: 'roomName',
      label: 'Room',
      sortable: true,
      render: (_, row) => row.room?.name || 'N/A'
    },
    {
      key: 'checkIn',
      label: 'Check-in',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'checkOut',
      label: 'Check-out',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'totalPrice',
      label: 'Total Price',
      sortable: true,
      render: (value) => formatPrice(value)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    }
  ]

  const renderActions = (booking) => (
    <div className="table-actions">
      <Button
        variant="outline"
        size="small"
        onClick={() => handleViewDetails(booking)}
      >
        View
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => handleStatusChange(booking)}
        disabled={booking.status === 'cancelled'}
      >
        Update Status
      </Button>
      <Button
        variant="danger"
        size="small"
        onClick={() => handleCancelClick(booking)}
        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
      >
        Cancel
      </Button>
    </div>
  )

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="booking-management">
      <div className="page-header">
        <div>
          <h1>Booking Management</h1>
          <p className="page-description">Manage all hotel bookings and reservations</p>
        </div>
        <Button onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by guest name, email, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group date-filter">
          <DateRangePicker
            label="Date Range"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredBookings}
        onSort={handleSort}
        onRowClick={handleViewDetails}
        actions={renderActions}
      />

      {/* Booking Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, booking: null })}
        title="Booking Details"
        size="large"
      >
        {detailsModal.booking && (
          <div className="booking-details">
            <div className="details-section">
              <h3>Guest Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{detailsModal.booking.guestInfo?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{detailsModal.booking.guestInfo?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{detailsModal.booking.guestInfo?.phone}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Booking Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Room:</span>
                  <span className="detail-value">{detailsModal.booking.room?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">
                    {new Date(detailsModal.booking.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Check-out:</span>
                  <span className="detail-value">
                    {new Date(detailsModal.booking.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">
                    {detailsModal.booking.numberOfGuests?.adults || 0} adults, {detailsModal.booking.numberOfGuests?.children || 0} children
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <StatusBadge status={detailsModal.booking.status} />
                  </span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Payment Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Total Price:</span>
                  <span className="detail-value">{formatPrice(detailsModal.booking.totalPrice)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Status:</span>
                  <span className="detail-value">
                    <StatusBadge status={detailsModal.booking.paymentStatus || 'unpaid'} />
                  </span>
                </div>
              </div>
            </div>

            {detailsModal.booking.specialRequests && (
              <div className="details-section">
                <h3>Special Requests</h3>
                <p className="special-requests">{detailsModal.booking.specialRequests}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, booking: null, newStatus: '' })}
        title="Update Booking Status"
      >
        <div className="status-update-modal">
          <p>Update status for booking: <strong>{statusModal.booking?.guestInfo?.name}</strong></p>
          
          <div className="form-group">
            <label htmlFor="new-status">New Status</label>
            <select
              id="new-status"
              value={statusModal.newStatus}
              onChange={(e) => setStatusModal({ ...statusModal, newStatus: e.target.value })}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setStatusModal({ isOpen: false, booking: null, newStatus: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        title="Cancel Booking"
        message={`Are you sure you want to cancel the booking for ${cancelDialog.booking?.guestInfo?.name}? This action cannot be undone.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        type="danger"
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelDialog({ isOpen: false, booking: null })}
      />
    </div>
  )
}

export default BookingManagement
