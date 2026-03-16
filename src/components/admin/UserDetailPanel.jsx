import { format } from 'date-fns'
import Button from '../common/Button'
import { USER_ROLES } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'
import './UserDetailPanel.css'

const UserDetailPanel = ({ user, onEdit, onBlock, onUnblock }) => {
  const getRoleBadge = (role) => {
    const roleClasses = {
      [USER_ROLES.ADMIN]: 'role-badge role-admin',
      [USER_ROLES.STAFF]: 'role-badge role-staff',
      [USER_ROLES.USER]: 'role-badge role-user',
      [USER_ROLES.GUEST]: 'role-badge role-guest'
    }
    
    return (
      <span className={roleClasses[role] || 'role-badge'}>
        {role}
      </span>
    )
  }

  const getStatusBadge = (isBlocked) => {
    return (
      <span className={`status-badge ${isBlocked ? 'status-blocked' : 'status-active'}`}>
        {isBlocked ? 'Blocked' : 'Active'}
      </span>
    )
  }

  const getBookingStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'booking-status-pending',
      'confirmed': 'booking-status-confirmed',
      'checked-in': 'booking-status-checked-in',
      'checked-out': 'booking-status-checked-out',
      'cancelled': 'booking-status-cancelled'
    }
    
    return (
      <span className={`booking-status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="user-detail-panel">
      <div className="panel-content">
        {/* User Information */}
        <section className="detail-section">
          <h3>User Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{getRoleBadge(user.role)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{getStatusBadge(user.isBlocked)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Joined:</span>
              <span className="detail-value">
                {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Booking History */}
        <section className="detail-section">
          <h3>Booking History</h3>
          {user.bookingHistory && user.bookingHistory.length > 0 ? (
            <div className="booking-history">
              <div className="booking-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Bookings:</span>
                  <span className="summary-value">{user.bookingHistory.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Spent:</span>
                  <span className="summary-value">
                    {formatPrice(
                      user.bookingHistory.reduce((sum, booking) => 
                        sum + (booking.pricing?.total || 0), 0
                      )
                    )}
                  </span>
                </div>
              </div>
              <div className="booking-list">
                {user.bookingHistory.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-reference">#{booking.bookingReference}</span>
                      {getBookingStatusBadge(booking.status)}
                    </div>
                    <div className="booking-details">
                      <div className="booking-detail">
                        <span className="booking-label">Room:</span>
                        <span>{booking.roomName || 'N/A'}</span>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-label">Check-in:</span>
                        <span>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-label">Check-out:</span>
                        <span>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-label">Total:</span>
                        <span className="booking-price">
                          {formatPrice(booking.pricing?.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-bookings">No booking history available</p>
          )}
        </section>

        {/* Actions */}
        <section className="detail-section">
          <div className="action-buttons">
            <Button variant="primary" onClick={onEdit}>
              Edit User
            </Button>
            {user.isBlocked ? (
              <Button variant="primary" onClick={onUnblock}>
                Unblock User
              </Button>
            ) : (
              <Button variant="danger" onClick={onBlock}>
                Block User
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserDetailPanel
