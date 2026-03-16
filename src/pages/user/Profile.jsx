import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import bookingService from '../../services/bookingService'
import userService from '../../services/userService'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import Input from '../../components/forms/Input'
import { formatDate, formatPrice } from '../../utils/formatters'
import { BOOKING_STATUS } from '../../utils/constants'
import './Profile.css'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    })

    fetchBookings()
  }, [user, navigate])

  const fetchBookings = async () => {
    setIsLoading(true)
    const result = await bookingService.getUserBookings()
    
    if (result.success) {
      setBookings(result.data)
    } else {
      setAlert({ type: 'error', message: result.error })
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setAlert(null)

    const result = await userService.updateProfile(formData)
    
    if (result.success) {
      await updateProfile(result.data)
      setAlert({ type: 'success', message: 'Profile updated successfully' })
      setIsEditing(false)
    } else {
      setAlert({ type: 'error', message: result.error })
    }
    
    setIsSaving(false)
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

  const separateBookings = () => {
    const now = new Date()
    const upcoming = []
    const past = []

    bookings.forEach(booking => {
      const checkInDate = new Date(booking.checkIn)
      if (checkInDate >= now && booking.status !== BOOKING_STATUS.CANCELLED) {
        upcoming.push(booking)
      } else {
        past.push(booking)
      }
    })

    return { upcoming, past }
  }

  if (isLoading) {
    return <Loader fullScreen />
  }

  const { upcoming, past } = separateBookings()

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="profile-content">
          <Card className="profile-info-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-header-info">
                <h2>{user?.name}</h2>
                <p className="profile-role">{user?.role}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />

              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSaving}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <div className="bookings-section">
            <h2 className="section-title">My Bookings</h2>

            {bookings.length === 0 ? (
              <Card>
                <div className="empty-state">
                  <p>You don't have any bookings yet.</p>
                  <Link to="/rooms">
                    <Button variant="primary">Browse Rooms</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div className="bookings-group">
                    <h3 className="bookings-group-title">Upcoming Bookings</h3>
                    <div className="bookings-list">
                      {upcoming.map(booking => (
                        <Card key={booking._id} className="booking-card">
                          <div className="booking-card-content">
                            <div className="booking-card-header">
                              <h4 className="booking-room-name">
                                {booking.room?.name || `Room ${booking.room?._id || booking.roomId}`}
                              </h4>
                              <span className={getStatusBadgeClass(booking.status)}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="booking-details">
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Booking Reference:</span>
                                <span className="booking-detail-value">{booking.bookingReference}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Check-in:</span>
                                <span className="booking-detail-value">{formatDate(booking.checkIn)}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Check-out:</span>
                                <span className="booking-detail-value">{formatDate(booking.checkOut)}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Total:</span>
                                <span className="booking-detail-value booking-price">
                                  {formatPrice(booking.totalPrice || 0)}
                                </span>
                              </div>
                            </div>

                            <div className="booking-card-actions">
                              <Link to={`/profile/bookings/${booking._id}`}>
                                <Button variant="primary" size="small">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div className="bookings-group">
                    <h3 className="bookings-group-title">Past Bookings</h3>
                    <div className="bookings-list">
                      {past.map(booking => (
                        <Card key={booking._id} className="booking-card">
                          <div className="booking-card-content">
                            <div className="booking-card-header">
                              <h4 className="booking-room-name">
                                {booking.room?.name || `Room ${booking.room?._id || booking.roomId}`}
                              </h4>
                              <span className={getStatusBadgeClass(booking.status)}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="booking-details">
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Booking Reference:</span>
                                <span className="booking-detail-value">{booking.bookingReference}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Check-in:</span>
                                <span className="booking-detail-value">{formatDate(booking.checkIn)}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Check-out:</span>
                                <span className="booking-detail-value">{formatDate(booking.checkOut)}</span>
                              </div>
                              <div className="booking-detail-item">
                                <span className="booking-detail-label">Total:</span>
                                <span className="booking-detail-value booking-price">
                                  {formatPrice(booking.totalPrice || 0)}
                                </span>
                              </div>
                            </div>

                            <div className="booking-card-actions">
                              <Link to={`/profile/bookings/${booking._id}`}>
                                <Button variant="outline" size="small">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
