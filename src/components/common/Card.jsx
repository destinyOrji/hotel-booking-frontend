import './Card.css'

const Card = ({ 
  title, 
  image, 
  children, 
  actions,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {image && (
        <div className="card-image">
          <img src={image} alt={title || 'Card image'} />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        <div className="card-body">{children}</div>
      </div>
      {actions && (
        <div className="card-actions">
          {actions}
        </div>
      )}
    </div>
  )
}

export default Card
