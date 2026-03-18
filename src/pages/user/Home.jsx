import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../../components/forms/SearchForm'
import roomService from '../../services/roomService'
import './Home.css'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)

  const heroImages = [
    {
      url: '/images/hero/hotel-exterior-2.jpg',
      alt: 'Hotel front entrance with parking'
    },
    {
      url: '/images/hero/hotel-exterior-3.jpg',
      alt: 'Hotel side view with rooms'
    },
    {
      url: '/images/hero/hotel-pool.jpg',
      alt: 'Hotel outdoor pool area'
    }
  ]

  // Fetch featured rooms
  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      setIsLoadingRooms(true)
      const result = await roomService.getRooms({ status: 'available' })
      if (result.success && result.data) {
        // Get first 3 rooms as featured
        setFeaturedRooms(result.data.slice(0, 3))
      }
      setIsLoadingRooms(false)
    }
    fetchFeaturedRooms()
  }, [])

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroImages.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const amenities = [
    {
      image: '/images/Amenities/Swimming_Pool.jpg',
      title: 'Swimming Pool',
      description: 'Outdoor infinity pool with ocean views'
    },
    {
      image: '/images/Amenities/FineDining.jpg',
      title: 'Fine Dining',
      description: 'Award-winning restaurant and bar'
    },
    {
      image: '/images/Amenities/Spa_Wellness.jpg',
      title: 'Spa & Wellness',
      description: 'Full-service spa and fitness center'
    },
    {
      image: '/images/Amenities/Valet_Parking.jpg',
      title: 'Valet Parking',
      description: 'Complimentary valet parking service'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section with Slider */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url('${image.url}')`
              }}
              role="img"
              aria-label={image.alt}
            >
              {/* Fallback image element for debugging */}
              <img 
                src={image.url} 
                alt={image.alt} 
                style={{ display: 'none' }}
                onError={(e) => console.error('Image failed to load:', image.url)}
                onLoad={() => console.log('Image loaded:', image.url)}
              />
            </div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Royal Elysaa  Redefined, Comfort Perfected</h1>
          <p className="hero-subtitle">
            Where every thoughtful detail invites extraordinary escapes and creates memories to treasure forever. Your sanctuary of sophistication awaits
          </p>
          <div className="hero-actions">
            <Link to="/rooms" className="btn btn-primary">Explore Rooms</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
        
        {/* Slider Indicators */}
        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <h2 className="search-title">Find Your Perfect Stay</h2>
            <p className="search-subtitle">Check availability and book your room</p>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="featured-rooms-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Signature Rooms</h2>
            <p className="section-subtitle">Discover comfort and elegance in every detail</p>
          </div>
          <div className="rooms-grid">
            {isLoadingRooms ? (
              <div className="loading-rooms">
                <p>Loading featured rooms...</p>
              </div>
            ) : featuredRooms.length > 0 ? (
              featuredRooms.map(room => (
                <div key={room._id} className="room-card hover-lift">
                  <div className="room-image">
                    <img 
                      src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={room.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="room-overlay">
                      <Link to={`/rooms/${room._id}`} className="btn btn-white">View Details</Link>
                    </div>
                  </div>
                  <div className="room-info">
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-description">
                      {room.description?.length > 100 
                        ? `${room.description.substring(0, 100)}...` 
                        : room.description}
                    </p>
                    <div className="room-footer">
                      <span className="room-price">From ${room.basePrice}/night</span>
                      <Link to={`/rooms/${room._id}`} className="room-link">Book Now →</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-rooms-message">
                <p>No rooms available at the moment. Please check back later.</p>
              </div>
            )}
          </div>
          <div className="section-cta">
            <Link to="/rooms" className="btn btn-outline-dark">View All Rooms</Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">World-Class Amenities</h2>
            <p className="section-subtitle">Everything you need for a perfect stay</p>
          </div>
          <div className="amenities-grid">
            {amenities.map((amenity, index) => (
              <div key={index} className="amenity-card fade-in">
                <div className="amenity-icon">
                  <img 
                    src={amenity.image} 
                    alt={amenity.title}
                    onError={(e) => {
                      console.error('Amenity image failed to load:', amenity.image)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <h3 className="amenity-title">{amenity.title}</h3>
                <p className="amenity-description">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="container">
          <div className="experience-grid">
            <div className="experience-content">
              <h2 className="experience-title">An Unforgettable Experience</h2>
              <p className="experience-text">
                Immerse yourself in luxury and comfort at our hotel. From the moment you arrive, 
                our dedicated team ensures every detail of your stay exceeds expectations.
              </p>
              <p className="experience-text">
                Whether you're here for business or leisure, enjoy our premium facilities, 
                exceptional dining, and personalized service that makes every guest feel special.
              </p>
              <Link to="/about" className="btn btn-primary">Discover Our Story</Link>
            </div>
            <div className="experience-images">
              <div className="experience-image-grid">
                <img src="/images/hotel/lobby.jpg" alt="Hotel Lobby" className="exp-img-1" />
                <img src="/images/hotel/pool.jpg" alt="Pool Area" className="exp-img-2" />
                <img src="/images/hotel/dining.jpg" alt="Restaurant" className="exp-img-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Book Your Stay?</h2>
            <p className="cta-subtitle">Join thousands of satisfied guests who chose excellence</p>
            <div className="cta-actions">
              <Link to="/rooms" className="btn btn-primary btn-lg">Book Now</Link>
              <Link to="/contact" className="btn btn-outline-dark btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
