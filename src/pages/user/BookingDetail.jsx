import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import bookingService from '../../services/bookingService'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import { formatDate, formatPrice } from '../../utils/formatters'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../../utils/constants'
import './BookingDetail.css'

const BookingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [alert, setAlert] = useState(null)
  const [cancellationPolicy, setCancellationPolicy] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchBookingDetails()
  }, [id, user, navigate])

  const fetchBookingDetails = async () => {
    setIsLoading(true)
    const result = await bookingService.getBookingById(id)
    
    if (result.success) {
      setBooking(result.data)
      checkCancellationPolicy(result.data)
    } else {
      setAlert({ type: 'error', message: result.error })
    }
    
    setIsLoading(false)
  }

  const checkCancellationPolicy = (bookingData) => {
    const now = new Date()
    const checkInDate = new Date(bookingData.checkIn)
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60)
    
    // Cancellation policy: Can cancel if more than 24 hours before check-in
    const canCancel = hoursUntilCheckIn > 24 && 
                      bookingData.status !== BOOKING_STATUS.CANCELLED &&
                      bookingData.status !== BOOKING_STATUS.CHECKED_IN &&
                      bookingData.status !== BOOKING_STATUS.CHECKED_OUT

    let refundAmount = 0
    let policyMessage = ''

    if (hoursUntilCheckIn > 72) {
      // Full refund if cancelled more than 72 hours before check-in
      refundAmount = bookingData.pricing?.total || 0
      policyMessage = 'Full refund available (cancellation more than 72 hours before check-in)'
    } else if (hoursUntilCheckIn > 24) {
      // 50% refund if cancelled between 24-72 hours before check-in
      refundAmount = (bookingData.pricing?.total || 0) * 0.5
      policyMessage = '50% refund available (cancellation between 24-72 hours before check-in)'
    } else if (hoursUntilCheckIn > 0) {
      // No refund if cancelled less than 24 hours before check-in
      refundAmount = 0
      policyMessage = 'No refund available (cancellation less than 24 hours before check-in)'
    } else {
      // Past check-in date
      refundAmount = 0
      policyMessage = 'Cancellation not available (check-in date has passed)'
    }

    setCancellationPolicy({
      canCancel,
      refundAmount,
      policyMessage,
      hoursUntilCheckIn
    })
  }

  const handleCancelClick = () => {
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    setIsCancelling(true)
    setAlert(null)

    const result = await bookingService.cancelBooking(id)
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Booking cancelled successfully' })
      setShowCancelModal(false)
      // Refresh booking details
      await fetchBookingDetails()
    } else {
      setAlert({ type: 'error', message: result.error })
    }
    
    setIsCancelling(false)
  }

  const handleCancelModalClose = () => {
    if (!isCancelling) {
      setShowCancelModal(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'status-badge status-confirmed'
      case BOOKING_STATUS.PENDING:
        return 'status-badge status-pending'
      case BOOKING_STATUS.CHECKED_IN:
        return 'status-badge status-checked-in'
      case BOOKING_STATUS.CHECKED_OUT:
        return 'status-badge status-checked-out'
      case BOOKING_STATUS.CANCELLED:
        return 'status-badge status-cancelled'
      default:
        return 'status-badge'
    }
  }

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'payment-badge payment-completed'
      case PAYMENT_STATUS.PENDING:
        return 'payment-badge payment-pending'
      case PAYMENT_STATUS.REFUNDED:
        return 'payment-badge payment-refunded'
      case PAYMENT_STATUS.FAILED:
        return 'payment-badge payment-failed'
      default:
        return 'payment-badge'
    }
  }

  if (isLoading) {
    return <Loader fullScreen />
  }

  if (!booking) {
    return (
      <div className="booking-detail-page">
        <div className="booking-detail-container">
          <Alert type="error" message="Booking not found" />
          <Link to="/profile">
            <Button variant="primary">Back to Profile</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-container">
        <div className="booking-detail-header">
          <Link to="/profile" className="back-link">
            ← Back to Profile
          </Link>
          <h1 className="booking-detail-title">Booking Details</h1>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="booking-detail-content">
          <Card className="booking-info-card">
            <div className="booking-info-header">
              <div>
                <h2 className="booking-reference">
                  Booking Reference: {booking.bookingReference}
                </h2>
                <p className="booking-created">
                  Booked on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div className="booking-status-badges">
                <span className={getStatusBadgeClass(booking.status)}>
                  {booking.status}
                </span>
                <span className={getPaymentStatusBadgeClass(booking.paymentStatus)}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="booking-info-section">
              <h3 className="section-title">Room Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Room Name:</span>
                  <span className="info-value">{booking.roomName || `Room ${booking.roomId}`}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Room Type:</span>
                  <span className="info-value">{booking.roomType || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="booking-info-section">
              <h3 className="section-title">Stay Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Check-in:</span>
                  <span className="info-value">{formatDate(booking.checkIn)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Check-out:</span>
                  <span className="info-value">{formatDate(booking.checkOut)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Guests:</span>
                  <span className="info-value">
                    {booking.guests?.adults || 0} Adult(s)
                    {booking.guests?.children > 0 && `, ${booking.guests.children} Child(ren)`}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Number of Nights:</span>
                  <span className="info-value">
                    {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>

            <div className="booking-info-section">
              <h3 className="section-title">Guest Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{booking.guestInfo?.name || user?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{booking.guestInfo?.email || user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{booking.guestInfo?.phone || 'N/A'}</span>
                </div>
              </div>
              {booking.specialRequests && (
                <div className="info-item special-requests">
                  <span className="info-label">Special Requests:</span>
                  <p className="info-value">{booking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="booking-info-section">
              <h3 className="section-title">Pricing Breakdown</h3>
              <div className="pricing-details">
                <div className="pricing-row">
                  <span className="pricing-label">Base Price:</span>
                  <span className="pricing-value">{formatPrice(booking.pricing?.basePrice || 0)}</span>
                </div>
                <div className="pricing-row">
                  <span className="pricing-label">Taxes:</span>
                  <span className="pricing-value">{formatPrice(booking.pricing?.taxes || 0)}</span>
                </div>
                <div className="pricing-row">
                  <span className="pricing-label">Fees:</span>
                  <span className="pricing-value">{formatPrice(booking.pricing?.fees || 0)}</span>
                </div>
                {booking.pricing?.discount > 0 && (
                  <div className="pricing-row discount-row">
                    <span className="pricing-label">
                      Discount {booking.promoCode && `(${booking.promoCode})`}:
                    </span>
                    <span className="pricing-value">-{formatPrice(booking.pricing.discount)}</span>
                  </div>
                )}
                <div className="pricing-row total-row">
                  <span className="pricing-label">Total:</span>
                  <span className="pricing-value">{formatPrice(booking.pricing?.total || 0)}</span>
                </div>
              </div>
            </div>

            {cancellationPolicy && (
              <div className="booking-info-section">
                <h3 className="section-title">Cancellation Policy</h3>
                <div className="cancellation-policy">
                  <p className="policy-message">{cancellationPolicy.policyMessage}</p>
                  {cancellationPolicy.canCancel && (
                    <p className="refund-info">
                      Refund Amount: <strong>{formatPrice(cancellationPolicy.refundAmount)}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="booking-actions">
              {cancellationPolicy?.canCancel && (
                <Button
                  variant="danger"
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                >
                  Cancel Booking
                </Button>
              )}
              <Link to="/profile">
                <Button variant="outline">Back to Profile</Button>
              </Link>
            </div>
          </Card>
        </div>

        <Modal
          isOpen={showCancelModal}
          onClose={handleCancelModalClose}
          title="Cancel Booking"
        >
          <div className="cancel-modal-content">
            <p className="cancel-warning">
              Are you sure you want to cancel this booking?
            </p>
            {cancellationPolicy && (
              <div className="cancel-policy-info">
                <p>{cancellationPolicy.policyMessage}</p>
                <p className="refund-amount">
                  Refund Amount: <strong>{formatPrice(cancellationPolicy.refundAmount)}</strong>
                </p>
              </div>
            )}
            <div className="cancel-modal-actions">
              <Button
                variant="danger"
                onClick={handleCancelConfirm}
                loading={isCancelling}
              >
                Confirm Cancellation
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelModalClose}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default BookingDetail
