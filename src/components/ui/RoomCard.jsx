import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import './RoomCard.css'

const RoomCard = memo(({ room, onSelect, showPrice = true }) => {
  const navigate = useNavigate()
  
  // Handle both _id (MongoDB) and id formats
  const roomId = room._id || room.id

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(room)
    } else {
      navigate(`/rooms/${roomId}`)
    }
  }, [onSelect, room, roomId, navigate])

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }, [])

  const displayAmenities = room.amenities?.slice(0, 4) || []
  const hasMoreAmenities = room.amenities?.length > 4

  return (
    <div className="room-card">
      <div className="room-card-image">
        <img 
          src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={room.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {room.status === 'blocked' && (
          <div className="room-card-badge unavailable">Unavailable</div>
        )}
      </div>

      <div className="room-card-content">
        <div className="room-card-header">
          <h3 className="room-card-title">{room.name}</h3>
          <span className="room-card-type">{room.type}</span>
        </div>

        <p className="room-card-description">
          {room.description?.length > 100 
            ? `${room.description.substring(0, 100)}...` 
            : room.description}
        </p>

        <div className="room-card-capacity">
          <span>👤 Up to {room.capacity?.adults || 2} adults</span>
          {room.capacity?.children > 0 && (
            <span>, {room.capacity.children} children</span>
          )}
        </div>

        {displayAmenities.length > 0 && (
          <div className="room-card-amenities">
            {displayAmenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {hasMoreAmenities && (
              <span className="amenity-tag more">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="room-card-footer">
          {showPrice && (
            <div className="room-card-price">
              <span className="price-label">From</span>
              <span className="price-amount">{formatPrice(room.basePrice)}</span>
              <span className="price-period">/night</span>
            </div>
          )}
          <Button 
            variant="primary" 
            onClick={handleClick}
            disabled={room.status === 'blocked'}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
})

RoomCard.displayName = 'RoomCard'

export default RoomCard
