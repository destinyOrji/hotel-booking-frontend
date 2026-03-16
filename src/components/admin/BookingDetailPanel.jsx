import { useState } from 'react'
import { format } from 'date-fns'
import Button from '../common/Button'
import Select from '../forms/Select'
import Alert from '../common/Alert'
import bookingService from '../../services/bookingService'
import { BOOKING_STATUS } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'
import './BookingDetailPanel.css'

const BookingDetailPanel = ({ booking, onClose, onUpdate }) => {
  const [status, setStatus] = useState(booking.status)
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState(booking.notes || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const statusOptions = [
    { value: BOOKING_STATUS.PENDING, label: 'Pending' },
    { value: BOOKING_STATUS.CONFIRMED, label: 'Confirmed' },
    { value: BOOKING_STATUS.CHECKED_IN, label: 'Checked In' },
    { value: BOOKING_STATUS.CHECKED_OUT, label: 'Checked Out' },
    { value: BOOKING_STATUS.CANCELLED, label: 'Cancelled' }
  ]

  const handleStatusUpdate = async () => {
    if (status === booking.status) {
      setError('Status has not changed')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await bookingService.updateBookingStatus(booking.id, status)
    
    if (result.success) {
      setSuccess('Booking status updated successfully')
      onUpdate && onUpdate(result.data)
    } else {
      setError(result.error)
      setStatus(booking.status) // Revert on error
    }
    
    setLoading(false)
  }

  const handleAddNote = async () => {
    if (!note.trim()) {
      setError('Note cannot be empty')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await bookingService.addBookingNote(booking.id, note)
    
    if (result.success) {
      setNotes([...notes, { text: note, createdAt: new Date(), author: 'Admin' }])
      setNote('')
      setSuccess('Note added successfully')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleGenerateInvoice = () => {
    // Create a printable invoice
    const invoiceWindow = window.open('', '_blank')
    
    if (!invoiceWindow) {
      setError('Please allow pop-ups to generate invoice')
      return
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${booking.bookingReference}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 40px;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #2c5282;
          }
          .invoice-details {
            text-align: right;
          }
          .invoice-details p {
            margin: 5px 0;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2d3748;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
          }
          .info-label {
            font-size: 12px;
            color: #718096;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 14px;
            color: #2d3748;
          }
          .pricing-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .pricing-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .pricing-table tr:last-child td {
            border-bottom: 2px solid #333;
          }
          .pricing-table .label {
            text-align: left;
          }
          .pricing-table .amount {
            text-align: right;
            font-weight: 600;
          }
          .pricing-table .total-row {
            font-size: 18px;
            font-weight: bold;
            background: #f7fafc;
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-confirmed {
            background: #d4edda;
            color: #155724;
          }
          .status-pending {
            background: #fef5e7;
            color: #d68910;
          }
          .status-cancelled {
            background: #f8d7da;
            color: #721c24;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #718096;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <p style="margin-top: 10px; color: #718096;">Hotel Booking System</p>
            </div>
            <div class="invoice-details">
              <p><strong>Invoice #:</strong> ${booking.bookingReference}</p>
              <p><strong>Date:</strong> ${format(new Date(booking.createdAt), 'MMMM dd, yyyy')}</p>
              <p><strong>Status:</strong> <span class="status-badge status-${booking.status}">${booking.status}</span></p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">${booking.guestInfo.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${booking.guestInfo.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone</span>
                <span class="info-value">${booking.guestInfo.phone}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Check-In Date</span>
                <span class="info-value">${format(new Date(booking.checkIn), 'MMMM dd, yyyy')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Check-Out Date</span>
                <span class="info-value">${format(new Date(booking.checkOut), 'MMMM dd, yyyy')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Room</span>
                <span class="info-value">${booking.roomName || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Guests</span>
                <span class="info-value">${booking.guests.adults} Adults, ${booking.guests.children} Children</span>
              </div>
            </div>
            ${booking.specialRequests ? `
              <div style="margin-top: 15px;">
                <span class="info-label">Special Requests</span>
                <p class="info-value" style="margin-top: 5px;">${booking.specialRequests}</p>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Payment Summary</div>
            <table class="pricing-table">
              <tr>
                <td class="label">Room Rate</td>
                <td class="amount">${formatPrice(booking.pricing.basePrice)}</td>
              </tr>
              <tr>
                <td class="label">Taxes</td>
                <td class="amount">${formatPrice(booking.pricing.taxes)}</td>
              </tr>
              <tr>
                <td class="label">Service Fees</td>
                <td class="amount">${formatPrice(booking.pricing.fees)}</td>
              </tr>
              ${booking.pricing.discount > 0 ? `
              <tr>
                <td class="label">Discount ${booking.promoCode ? `(${booking.promoCode})` : ''}</td>
                <td class="amount" style="color: #38a169;">-${formatPrice(booking.pricing.discount)}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td class="label">TOTAL AMOUNT</td>
                <td class="amount">${formatPrice(booking.pricing.total)}</td>
              </tr>
            </table>
            <p style="margin-top: 15px; font-size: 14px;">
              <strong>Payment Status:</strong> 
              <span style="text-transform: capitalize;">${booking.paymentStatus}</span>
            </p>
          </div>

          <div class="footer">
            <p>Thank you for choosing our hotel!</p>
            <p style="margin-top: 5px;">For any inquiries, please contact us at info@hotel.com</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `

    invoiceWindow.document.write(invoiceHTML)
    invoiceWindow.document.close()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'status-confirmed'
      case BOOKING_STATUS.CHECKED_IN:
        return 'status-checked-in'
      case BOOKING_STATUS.CHECKED_OUT:
        return 'status-checked-out'
      case BOOKING_STATUS.CANCELLED:
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  return (
    <div className="booking-detail-panel">
      <div className="panel-header">
        <div>
          <h2>Booking Details</h2>
          <p className="booking-reference">#{booking.bookingReference}</p>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="panel-content">
        {/* Guest Information */}
        <section className="detail-section">
          <h3>Guest Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{booking.guestInfo.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{booking.guestInfo.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{booking.guestInfo.phone}</span>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="detail-section">
          <h3>Booking Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Check-In:</span>
              <span className="detail-value">
                {format(new Date(booking.checkIn), 'MMMM dd, yyyy')}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Check-Out:</span>
              <span className="detail-value">
                {format(new Date(booking.checkOut), 'MMMM dd, yyyy')}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Room:</span>
              <span className="detail-value">{booking.roomName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Guests:</span>
              <span className="detail-value">
                {booking.guests.adults} Adults, {booking.guests.children} Children
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">
                {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>
          {booking.specialRequests && (
            <div className="detail-item full-width">
              <span className="detail-label">Special Requests:</span>
              <p className="detail-value">{booking.specialRequests}</p>
            </div>
          )}
        </section>

        {/* Pricing Information */}
        <section className="detail-section">
          <h3>Pricing</h3>
          <div className="pricing-breakdown">
            <div className="pricing-row">
              <span>Base Price:</span>
              <span>{formatPrice(booking.pricing.basePrice)}</span>
            </div>
            <div className="pricing-row">
              <span>Taxes:</span>
              <span>{formatPrice(booking.pricing.taxes)}</span>
            </div>
            <div className="pricing-row">
              <span>Fees:</span>
              <span>{formatPrice(booking.pricing.fees)}</span>
            </div>
            {booking.pricing.discount > 0 && (
              <div className="pricing-row discount">
                <span>Discount:</span>
                <span>-{formatPrice(booking.pricing.discount)}</span>
              </div>
            )}
            <div className="pricing-row total">
              <span>Total:</span>
              <span>{formatPrice(booking.pricing.total)}</span>
            </div>
          </div>
          {booking.promoCode && (
            <div className="promo-code">
              <span className="promo-label">Promo Code:</span>
              <span className="promo-value">{booking.promoCode}</span>
            </div>
          )}
          <div className="payment-status">
            <span className="detail-label">Payment Status:</span>
            <span className={`payment-badge ${booking.paymentStatus}`}>
              {booking.paymentStatus}
            </span>
          </div>
        </section>

        {/* Status Management */}
        <section className="detail-section">
          <h3>Status Management</h3>
          <div className="status-controls">
            <div className="current-status">
              <span className="detail-label">Current Status:</span>
              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <div className="status-update">
              <Select
                label="Update Status"
                options={statusOptions}
                value={status}
                onChange={setStatus}
                className="status-select"
              />
              <Button
                onClick={handleStatusUpdate}
                loading={loading}
                disabled={status === booking.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <section className="detail-section">
          <h3>Internal Notes</h3>
          <div className="notes-list">
            {notes.length === 0 ? (
              <p className="no-notes">No notes yet</p>
            ) : (
              notes.map((noteItem, index) => (
                <div key={index} className="note-item">
                  <div className="note-header">
                    <span className="note-author">{noteItem.author || 'Admin'}</span>
                    <span className="note-date">
                      {format(new Date(noteItem.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="note-text">{noteItem.text}</p>
                </div>
              ))
            )}
          </div>
          <div className="add-note">
            <textarea
              className="note-input"
              placeholder="Add internal note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} loading={loading} disabled={!note.trim()}>
              Add Note
            </Button>
          </div>
        </section>

        {/* Actions */}
        <section className="detail-section">
          <h3>Actions</h3>
          <div className="action-buttons">
            <Button variant="outline" onClick={handleGenerateInvoice}>
              Generate Invoice
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default BookingDetailPanel
