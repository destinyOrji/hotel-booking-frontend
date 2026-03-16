import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AuthLayout.css'

const AuthLayout = ({ children, title, subtitle }) => {
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    {
      url: '/images/hero/hotel-exterior-1.jpg',
      title: 'Luxury Redefined',
      description: 'Experience world-class hospitality'
    },
    {
      url: '/images/hero/hotel-exterior-2.jpg',
      title: 'Comfort Perfected',
      description: 'Where every detail matters'
    },
    {
      url: '/images/hero/hotel-exterior-3.jpg',
      title: 'Your Home Away',
      description: 'Creating memories that last'
    },
    {
      url: '/images/hero/hotel-pool.jpg',
      title: 'Unwind in Style',
      description: 'Relaxation at its finest'
    }
  ]

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <div className="auth-layout">
      {/* Left Side - Image Carousel */}
      <div className="auth-image-side">
        <div className="auth-image-carousel">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`auth-carousel-slide ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url('${image.url}')` }}
            >
              <div className="auth-carousel-overlay">
                <div className="auth-carousel-content">
                  <h2 className="carousel-title">{image.title}</h2>
                  <p className="carousel-description">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="auth-carousel-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">
            <span className="logo-text">HoDik Hotel</span>
          </Link>

          <div className="auth-content">
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>

          <div className="auth-footer-text">
            <p>All rights reserved © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
