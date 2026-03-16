import { formatDate } from '../../utils/formatters'
import './ReviewCard.css'

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <div className="author-avatar">
            {review.guestName?.charAt(0).toUpperCase() || 'G'}
          </div>
          <div className="author-info">
            <h4 className="author-name">{review.guestName || 'Guest'}</h4>
            <p className="review-date">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="review-rating">
          {renderStars(review.rating)}
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  )
}

export default ReviewCard
