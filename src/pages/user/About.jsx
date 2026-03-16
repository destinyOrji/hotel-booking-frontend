import { useState } from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>About Our Hotel</h1>
          <p>Discover the story behind our exceptional hospitality</p>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <p>
              Welcome to our distinguished hotel, where luxury meets comfort and tradition blends with modern elegance. 
              Established with a vision to provide unparalleled hospitality, we have been serving guests from around 
              the world for years, creating memorable experiences that last a lifetime.
            </p>
            <p>
              Our commitment to excellence is reflected in every aspect of our service, from our meticulously designed 
              rooms to our attentive staff who go above and beyond to ensure your stay is nothing short of perfect. 
              We believe that every guest deserves to feel special, and we strive to make that a reality with every visit.
            </p>
            <p>
              Located in the heart of the city, our hotel offers the perfect blend of convenience and tranquility. 
              Whether you're here for business or leisure, you'll find everything you need to make your stay comfortable 
              and enjoyable.
            </p>
          </div>
        </div>
      </section>

      <section className="about-facilities">
        <div className="container">
          <h2 className="section-title">Our Facilities</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <div className="facility-icon">🏊</div>
              <h3>Swimming Pool</h3>
              <p>Relax in our heated outdoor pool with stunning city views</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">💪</div>
              <h3>Fitness Center</h3>
              <p>State-of-the-art gym equipment available 24/7</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🍽️</div>
              <h3>Restaurant & Bar</h3>
              <p>Fine dining experience with international and local cuisine</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">💆</div>
              <h3>Spa & Wellness</h3>
              <p>Rejuvenate with our premium spa treatments</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🅿️</div>
              <h3>Parking</h3>
              <p>Complimentary secure parking for all guests</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">📶</div>
              <h3>Free WiFi</h3>
              <p>High-speed internet access throughout the property</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🏢</div>
              <h3>Business Center</h3>
              <p>Meeting rooms and business services available</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon">🛎️</div>
              <h3>Concierge Service</h3>
              <p>24/7 assistance for all your needs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-location">
        <div className="container">
          <h2 className="section-title">Our Location</h2>
          <div className="location-content">
            <div className="location-info">
              <h3>Find Us Here</h3>
              <p className="address">
                <strong>Address:</strong><br />
                123 Royal Street<br />
                Port Harcourt<br />
                Rivers State, Nigeria
              </p>
              <p>
                Conveniently located in the heart of Port Harcourt, our hotel is within easy reach 
                of major attractions, shopping centers, and business districts. The airport is just 
                30 minutes away, and public transportation is easily accessible.
              </p>
            </div>
            <div className="location-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127117.8!2d6.9944!3d4.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cd9b8c5b5b3b%3A0x3b4b5e5e5e5e5e5e!2sPort%20Harcourt%2C%20Rivers%20State%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
