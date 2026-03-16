import './LoadingSkeleton.css'

const LoadingSkeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height, 
  count = 1,
  className = '' 
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i)
  
  const getHeight = () => {
    if (height) return height
    
    switch (variant) {
      case 'text':
        return '1rem'
      case 'title':
        return '2rem'
      case 'avatar':
        return '3rem'
      case 'thumbnail':
        return '200px'
      case 'card':
        return '300px'
      default:
        return '1rem'
    }
  }
  
  const getWidth = () => {
    if (variant === 'avatar') return '3rem'
    return width
  }
  
  const getBorderRadius = () => {
    if (variant === 'avatar') return '50%'
    if (variant === 'thumbnail' || variant === 'card') return '8px'
    return '4px'
  }

  return (
    <>
      {skeletons.map((index) => (
        <div
          key={index}
          className={`loading-skeleton ${className}`}
          style={{
            width: getWidth(),
            height: getHeight(),
            borderRadius: getBorderRadius(),
            marginBottom: count > 1 && index < count - 1 ? '0.5rem' : '0'
          }}
        />
      ))}
    </>
  )
}

export default LoadingSkeleton
