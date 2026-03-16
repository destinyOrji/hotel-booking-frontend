import { formatPrice } from '../../utils/formatters'
import './PriceBreakdown.css'

const PriceBreakdown = ({ pricing }) => {
  if (!pricing) return null

  return (
    <div className="price-breakdown">
      <div className="price-row">
        <span className="price-label">
          {formatPrice(pricing.pricePerNight)} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}
        </span>
        <span className="price-value">{formatPrice(pricing.basePrice)}</span>
      </div>

      <div className="price-row">
        <span className="price-label">Taxes</span>
        <span className="price-value">{formatPrice(pricing.taxes)}</span>
      </div>

      <div className="price-row">
        <span className="price-label">Service fee</span>
        <span className="price-value">{formatPrice(pricing.fees)}</span>
      </div>

      {pricing.discount > 0 && (
        <div className="price-row discount">
          <span className="price-label">Discount</span>
          <span className="price-value">-{formatPrice(pricing.discount)}</span>
        </div>
      )}

      <div className="price-row total">
        <span className="price-label">Total</span>
        <span className="price-value">{formatPrice(pricing.total)}</span>
      </div>
    </div>
  )
}

export default PriceBreakdown
