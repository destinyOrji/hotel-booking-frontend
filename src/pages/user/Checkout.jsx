import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import BookingTimeline from '../../components/ui/BookingTimeline'
import PriceBreakdown from '../../components/ui/PriceBreakdown'
import Input from '../../components/forms/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import bookingService from '../../services/bookingService'
import { formatDate } from '../../utils/formatters'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingData = location.state?.bookingData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const { register, handleSubmit, formState: { errors } } = useForm()

  if (!bookingData) {
    return (
      <div className="checkout-page">
        <div className="container">
          <Alert type="error" message="No booking data found" />
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    )
  }

  const onSubmit = async (paymentData) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would process payment first
      // For now, we'll just create the booking
      const result = await bookingService.createBooking({
        ...bookingData,
        paymentMethod,
        paymentData: {
          // In production, this would be tokenized payment data
          method: paymentMethod
        }
      })

      if (result.success) {
        // Navigate to confirmation page with booking ID
        navigate(`/confirmation/${result.data._id}`, {
          state: { booking: result.data }
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to process booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { label: 'Guest Info', active: false },
    { label: 'Payment', active: true },
    { label: 'Confirmation', active: false }
  ]

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Payment</h1>

        <BookingTimeline steps={steps} currentStep={1} />

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="checkout-content">
          <div className="checkout-main">
            <div className="checkout-section">
              <h2 className="section-title">Payment Method</h2>

              <div className="payment-methods">
                <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-method-label">
                    <span className="payment-icon">💳</span>
                    Credit/Debit Card
                  </span>
                </label>

                <label className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-method-label">
                    <span className="payment-icon">🅿️</span>
                    PayPal
                  </span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="checkout-section">
                <h2 className="section-title">Card Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
                  <Input
                    name="cardNumber"
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    register={register}
                    validation={{ required: 'Card number is required' }}
                    error={errors.cardNumber?.message}
                  />

                  <Input
                    name="cardName"
                    label="Cardholder Name"
                    placeholder="Name on card"
                    register={register}
                    validation={{ required: 'Cardholder name is required' }}
                    error={errors.cardName?.message}
                  />

                  <div className="form-row">
                    <Input
                      name="expiryDate"
                      label="Expiry Date"
                      placeholder="MM/YY"
                      register={register}
                      validation={{ required: 'Expiry date is required' }}
                      error={errors.expiryDate?.message}
                    />

                    <Input
                      name="cvv"
                      label="CVV"
                      placeholder="123"
                      type="password"
                      register={register}
                      validation={{ required: 'CVV is required' }}
                      error={errors.cvv?.message}
                    />
                  </div>

                  <div className="payment-notice">
                    <p>🔒 Your payment information is secure and encrypted</p>
                    <p className="notice-small">This is a demo. No actual payment will be processed.</p>
                  </div>

                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      Complete Booking
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="checkout-section">
                <div className="paypal-placeholder">
                  <p>PayPal integration placeholder</p>
                  <p className="notice-small">In production, PayPal button would appear here</p>
                  <Button
                    variant="primary"
                    onClick={handleSubmit(onSubmit)}
                    loading={loading}
                  >
                    Continue with PayPal
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-sidebar">
            <div className="booking-summary-card">
              <h3 className="summary-title">Booking Summary</h3>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label">Guest</span>
                  <span className="detail-value">{bookingData.guestInfo.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{bookingData.guestInfo.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{bookingData.guestInfo.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">{formatDate(bookingData.checkIn)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">{formatDate(bookingData.checkOut)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">{bookingData.guests}</span>
                </div>
              </div>

              <PriceBreakdown pricing={bookingData.pricing} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
