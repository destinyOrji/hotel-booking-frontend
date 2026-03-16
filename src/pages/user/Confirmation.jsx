import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import BookingTimeline from '../../components/ui/BookingTimeline'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import bookingService from '../../services/bookingService'
import { formatDate, formatPrice } from '../../utils/formatters'
import { generateICSFile } from '../../utils/calendarExport'
import './Confirmation.css'

const Confirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [booking, setBooking] = useState(location.state?.booking || null)
  const [loading, setLoading] = useState(!booking)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!booking && id) {
      fetchBookingDetails()
    }
  }, [id, booking])

  const fetchBookingDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await bookingService.getBookingById(id)

      if (result.success) {
        setBooking(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load booking details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCalendar = () => {
    if (!booking) return

    const event = {
      title: `Hotel Booking - ${booking.roomName || 'Room'}`,
      description: `Booking Reference: ${booking.bookingReference}\nGuest: ${booking.guestInfo.name}`,
      location: 'Hotel Name, Address',
      startDate: new Date(booking.checkIn),
      endDate: new Date(booking.checkOut)
    }

    generateICSFile(event)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <Loader fullScreen />
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <Alert type="error" message={error || 'Booking not found'} />
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    )
  }

  const steps = [
    { label: 'Guest Info', active: false },
    { label: 'Payment', active: false },
    { label: 'Confirmation', active: true }
  ]

  return (
    <div className="confirmation-page">
      <div className="container">
        <BookingTimeline steps={steps} currentStep={2} />

        <div className="confirmation-content">
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h1 className="confirmation-title">Booking Confirmed!</h1>
            <p className="confirmation-subtitle">
              Thank you for your reservation. We've sent a confirmation email to {booking.guestInfo.email}
            </p>
          </div>

          <div className="confirmation-card">
            <div className="booking-reference">
              <span className="reference-label">Booking Reference</span>
              <span className="reference-number">{booking.bookingReference || booking.id}</span>
            </div>

            <div className="confirmation-section">
              <h2 className="section-title">Booking Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">{formatDate(booking.checkIn)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">{formatDate(booking.checkOut)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">
                    {booking.guests?.adults || 1} Adult{(booking.guests?.adults || 1) > 1 ? 's' : ''}
                    {booking.guests?.children > 0 && `, ${booking.guests.children} Child${booking.guests.children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Room Type</span>
                  <span className="detail-value">{booking.roomType || 'Standard Room'}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h2 className="section-title">Guest Information</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{booking.guestInfo.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{booking.guestInfo.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{booking.guestInfo.phone}</span>
                </div>
              </div>
              {booking.specialRequests && (
                <div className="special-requests">
                  <span className="detail-label">Special Requests</span>
                  <p className="detail-value">{booking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="confirmation-section">
              <h2 className="section-title">Payment Summary</h2>
              <div className="price-summary">
                <div className="price-row">
                  <span>Room charges</span>
                  <span>{formatPrice(booking.pricing?.basePrice || 0)}</span>
                </div>
                <div className="price-row">
                  <span>Taxes</span>
                  <span>{formatPrice(booking.pricing?.taxes || 0)}</span>
                </div>
                <div className="price-row">
                  <span>Service fee</span>
                  <span>{formatPrice(booking.pricing?.fees || 0)}</span>
                </div>
                {booking.pricing?.discount > 0 && (
                  <div className="price-row discount">
                    <span>Discount</span>
                    <span>-{formatPrice(booking.pricing.discount)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total Paid</span>
                  <span>{formatPrice(booking.pricing?.total || 0)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h2 className="section-title">Check-in Instructions</h2>
              <div className="instructions">
                <p>• Check-in time: 3:00 PM</p>
                <p>• Check-out time: 11:00 AM</p>
                <p>• Please bring a valid ID and the credit card used for booking</p>
                <p>• Early check-in subject to availability</p>
              </div>
            </div>

            <div className="confirmation-section">
              <h2 className="section-title">Hotel Contact</h2>
              <div className="contact-info">
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Email:</strong> reservations@hotel.com</p>
                <p><strong>Address:</strong> 123 Hotel Street, City, State 12345</p>
              </div>
            </div>

            <div className="confirmation-actions">
              <Button variant="outline" onClick={handleDownloadCalendar}>
                📅 Add to Calendar
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                🖨️ Print Confirmation
              </Button>
              <Button variant="primary" onClick={() => navigate('/profile')}>
                View My Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
