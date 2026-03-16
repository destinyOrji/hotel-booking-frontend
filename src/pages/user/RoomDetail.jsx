import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import RoomGallery from '../../components/ui/RoomGallery'
import AvailabilityCalendar from '../../components/ui/AvailabilityCalendar'
import ReviewCard from '../../components/ui/ReviewCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import roomService from '../../services/roomService'
import { formatPrice } from '../../utils/formatters'
import { getAmenityIcon } from '../../utils/amenityIcons'
import './RoomDetail.css'

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDates, setSelectedDates] = useState({
    checkIn: searchParams.get('checkIn') || null,
    checkOut: searchParams.get('checkOut') || null
  })

  useEffect(() => {
    fetchRoomDetails()
  }, [id])

  const fetchRoomDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await roomService.getRoom(id);

      if (result.success) {
        setRoom(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load room details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setError('Please select check-in and check-out dates from the calendar below')
      // Scroll to calendar
      document.querySelector('.room-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const bookingParams = new URLSearchParams({
      roomId: id,
      checkIn: selectedDates.checkIn,
      checkOut: selectedDates.checkOut,
      guests: searchParams.get('guests') || '1'
    })

    navigate(`/booking?${bookingParams.toString()}`)
  }

  const handleDateSelect = (dates) => {
    setSelectedDates(dates)
    setError(null)
  }

  const calculateTotalPrice = () => {
    if (!room || !selectedDates.checkIn || !selectedDates.checkOut) {
      return null
    }

    const checkIn = new Date(selectedDates.checkIn)
    const checkOut = new Date(selectedDates.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    const basePrice = room.basePrice * nights
    const taxes = basePrice * 0.1 // 10% tax
    const fees = 25 // Service fee
    const total = basePrice + taxes + fees

    return {
      nights,
      basePrice,
      taxes,
      fees,
      total
    }
  }

  if (loading) {
    return (
      <div className="room-detail-page">
        <div className="container">
          <Loader fullScreen />
        </div>
      </div>
    )
  }

  if (error && !room) {
    return (
      <div className="room-detail-page">
        <div className="container">
          <Alert type="error" message={error} />
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    )
  }

  if (!room) {
    return null
  }

  const pricing = calculateTotalPrice()
  const averageRating = room.reviews?.length > 0
    ? (room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)
    : null

  return (
    <div className="room-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Results
        </button>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="room-detail-header">
          <div className="room-detail-title-section">
            <h1 className="room-detail-title">{room.name}</h1>
            <span className="room-detail-type">{room.type}</span>
          </div>
          {averageRating && (
            <div className="room-detail-rating">
              <span className="rating-stars">⭐ {averageRating}</span>
              <span className="rating-count">({room.reviews.length} reviews)</span>
            </div>
          )}
        </div>

        <RoomGallery images={room.images || []} />

        <div className="room-detail-content">
          <div className="room-detail-main">
            <section className="room-section">
              <h2 className="section-title">Room Details</h2>
              <div className="room-capacity">
                <span className="capacity-item">
                  <strong>👤 Capacity:</strong> Up to {room.capacity?.adults || 2} adults
                  {room.capacity?.children > 0 && `, ${room.capacity.children} children`}
                </span>
              </div>
              <p className="room-description">{room.description}</p>
            </section>

            <section className="room-section">
              <h2 className="section-title">Amenities</h2>
              <div className="amenities-grid">
                {room.amenities?.map((amenity, index) => {
                  const icon = getAmenityIcon(amenity)
                  console.log('Amenity:', amenity, 'Icon:', icon) // Debug log
                  return (
                    <div key={index} className="amenity-item">
                      {icon.type === 'image' ? (
                        <img 
                          src={icon.value} 
                          alt={amenity} 
                          className="amenity-icon-img"
                          onError={(e) => {
                            console.error('Image failed to load:', icon.value)
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="amenity-icon">{icon.value}</span>
                      )}
                      <span className="amenity-name">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="room-section">
              <h2 className="section-title">Select Your Dates</h2>
              
              <div className="date-inputs">
                <div className="date-input-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input
                    type="date"
                    id="checkIn"
                    value={selectedDates.checkIn || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDates = { ...selectedDates, checkIn: e.target.value }
                      setSelectedDates(newDates)
                      setError(null)
                    }}
                    className="date-input"
                  />
                </div>
                
                <div className="date-input-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOut"
                    value={selectedDates.checkOut || ''}
                    min={selectedDates.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDates = { ...selectedDates, checkOut: e.target.value }
                      setSelectedDates(newDates)
                      setError(null)
                    }}
                    className="date-input"
                    disabled={!selectedDates.checkIn}
                  />
                </div>
              </div>

              <h3 className="section-subtitle">Or use the calendar below</h3>
              <AvailabilityCalendar
                roomId={id}
                onDateSelect={handleDateSelect}
                initialDates={selectedDates}
              />
            </section>

            {room.reviews && room.reviews.length > 0 && (
              <section className="room-section">
                <h2 className="section-title">Guest Reviews</h2>
                <div className="reviews-list">
                  {room.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="room-detail-sidebar">
            <div className="booking-card">
              <div className="booking-card-price">
                <span className="price-amount">{formatPrice(room.basePrice)}</span>
                <span className="price-period">/night</span>
              </div>

              {pricing && (
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>{formatPrice(room.basePrice)} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}</span>
                    <span>{formatPrice(pricing.basePrice)}</span>
                  </div>
                  <div className="price-row">
                    <span>Taxes</span>
                    <span>{formatPrice(pricing.taxes)}</span>
                  </div>
                  <div className="price-row">
                    <span>Service fee</span>
                    <span>{formatPrice(pricing.fees)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="large"
                onClick={handleBookNow}
                disabled={room.status === 'blocked'}
                className="book-now-button"
              >
                {room.status === 'blocked' ? 'Unavailable' : 'Book Now'}
              </Button>

              {!selectedDates.checkIn && (
                <p className="booking-hint">Select dates to see total price</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default RoomDetail
