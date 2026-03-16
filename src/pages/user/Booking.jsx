import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import BookingTimeline from '../../components/ui/BookingTimeline'
import PriceBreakdown from '../../components/ui/PriceBreakdown'
import Input from '../../components/forms/Input'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import roomService from '../../services/roomService'
import { formatDate, calculateNights, formatPrice } from '../../utils/formatters'
import { validateEmail, validatePhone } from '../../utils/validators'
import './Booking.css'

const Booking = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)

  const roomId = searchParams.get('roomId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests') || '1'

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (!roomId || !checkIn || !checkOut) {
      setError('Missing booking information')
      setLoading(false)
      return
    }

    fetchRoomDetails()
  }, [roomId])

  const fetchRoomDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await roomService.getRoom(roomId)

      if (result.success) {
        setRoom(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load room details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculatePricing = () => {
    if (!room || !checkIn || !checkOut) return null

    const nights = calculateNights(checkIn, checkOut)
    const basePrice = room.basePrice * nights
    const taxes = basePrice * 0.1 // 10% tax
    const fees = 25 // Service fee
    const discount = promoDiscount
    const total = basePrice + taxes + fees - discount

    return {
      nights,
      basePrice,
      pricePerNight: room.basePrice,
      taxes,
      fees,
      discount,
      total
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    setApplyingPromo(true)
    setPromoError('')

    // Simulate API call to validate promo code
    setTimeout(() => {
      // Mock validation - in real app, this would be an API call
      if (promoCode.toUpperCase() === 'SAVE10') {
        const pricing = calculatePricing()
        const discount = pricing.basePrice * 0.1 // 10% discount
        setPromoDiscount(discount)
        setPromoError('')
      } else if (promoCode.toUpperCase() === 'SAVE20') {
        const pricing = calculatePricing()
        const discount = pricing.basePrice * 0.2 // 20% discount
        setPromoDiscount(discount)
        setPromoError('')
      } else {
        setPromoError('Invalid promo code')
        setPromoDiscount(0)
      }
      setApplyingPromo(false)
    }, 500)
  }

  const onSubmit = (data) => {
    const pricing = calculatePricing()

    const bookingData = {
      roomId,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      guestInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone
      },
      specialRequests: data.specialRequests || '',
      promoCode: promoDiscount > 0 ? promoCode : '',
      pricing
    }

    // Navigate to checkout with booking data
    navigate('/checkout', { state: { bookingData } })
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <Loader fullScreen />
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="booking-page">
        <div className="container">
          <Alert type="error" message={error || 'Room not found'} />
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    )
  }

  const pricing = calculatePricing()
  const steps = [
    { label: 'Guest Info', active: true },
    { label: 'Payment', active: false },
    { label: 'Confirmation', active: false }
  ]

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="booking-title">Complete Your Booking</h1>

        <BookingTimeline steps={steps} currentStep={0} />

        <div className="booking-content">
          <div className="booking-main">
            <div className="booking-section">
              <h2 className="section-title">Guest Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
                <Input
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  register={register}
                  validation={{ required: 'Name is required' }}
                  error={errors.name?.message}
                />

                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  register={register}
                  validation={{
                    required: 'Email is required',
                    validate: (value) => validateEmail(value) || 'Invalid email address'
                  }}
                  error={errors.email?.message}
                />

                <Input
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="(123) 456-7890"
                  register={register}
                  validation={{
                    required: 'Phone number is required',
                    validate: (value) => validatePhone(value) || 'Invalid phone number'
                  }}
                  error={errors.phone?.message}
                />

                <div className="form-group">
                  <label htmlFor="specialRequests" className="form-label">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    className="form-textarea"
                    rows="4"
                    placeholder="Any special requests or requirements..."
                    {...register('specialRequests')}
                  />
                </div>

                <div className="booking-section">
                  <h3 className="subsection-title">Promo Code</h3>
                  <div className="promo-code-section">
                    <Input
                      name="promoCodeInput"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyPromo}
                      loading={applyingPromo}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p className="promo-error">{promoError}</p>
                  )}
                  {promoDiscount > 0 && (
                    <p className="promo-success">
                      ✓ Promo code applied! You saved {formatPrice(promoDiscount)}
                    </p>
                  )}
                </div>

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="primary">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <aside className="booking-sidebar">
            <div className="booking-summary-card">
              <h3 className="summary-title">Booking Summary</h3>

              <div className="room-summary">
                <img
                  src={room.images?.[0] || '/placeholder-room.jpg'}
                  alt={room.name}
                  className="room-summary-image"
                />
                <div className="room-summary-info">
                  <h4 className="room-summary-name">{room.name}</h4>
                  <p className="room-summary-type">{room.type}</p>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">{formatDate(checkIn)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">{formatDate(checkOut)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">{guests}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nights</span>
                  <span className="detail-value">{pricing.nights}</span>
                </div>
              </div>

              <PriceBreakdown pricing={pricing} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Booking
