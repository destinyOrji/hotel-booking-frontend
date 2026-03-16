import { useState } from 'react'
import './FAQ.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      category: 'Booking & Reservations',
      questions: [
        {
          question: 'How do I make a reservation?',
          answer: 'You can make a reservation through our website by selecting your check-in and check-out dates, choosing your preferred room type, and completing the booking form. Alternatively, you can call our front desk at +1 (555) 123-4567 or email us at reservations@luxuryhotel.com.'
        },
        {
          question: 'Can I modify or cancel my reservation?',
          answer: 'Yes, you can modify or cancel your reservation through your account dashboard. Please note that cancellation policies vary depending on the room type and rate selected. Standard reservations can be cancelled up to 48 hours before check-in for a full refund. Non-refundable rates cannot be cancelled or modified.'
        },
        {
          question: 'Do I need to pay in advance?',
          answer: 'Payment requirements depend on the rate type you select. Some promotional rates require full payment at the time of booking, while standard rates typically require a credit card to hold the reservation with payment due at check-in or check-out.'
        },
        {
          question: 'What is your minimum stay requirement?',
          answer: 'Our standard minimum stay is one night. However, during peak seasons and special events, we may require a minimum stay of 2-3 nights. Any minimum stay requirements will be clearly displayed during the booking process.'
        }
      ]
    },
    {
      category: 'Check-in & Check-out',
      questions: [
        {
          question: 'What are your check-in and check-out times?',
          answer: 'Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability. Additional charges may apply for late check-out.'
        },
        {
          question: 'Can I request early check-in or late check-out?',
          answer: 'Yes, early check-in and late check-out requests can be made during booking or by contacting our front desk. We will do our best to accommodate your request based on availability. Late check-out may incur additional charges.'
        },
        {
          question: 'What do I need to bring for check-in?',
          answer: 'Please bring a valid government-issued photo ID (driver\'s license or passport) and the credit card used for booking. If someone else made the reservation for you, please bring a copy of their ID and authorization letter.'
        }
      ]
    },
    {
      category: 'Room & Amenities',
      questions: [
        {
          question: 'What amenities are included in the rooms?',
          answer: 'All our rooms include complimentary WiFi, flat-screen TV, air conditioning, mini-fridge, coffee maker, iron and ironing board, hair dryer, and premium toiletries. Specific amenities may vary by room type.'
        },
        {
          question: 'Do you offer accessible rooms?',
          answer: 'Yes, we have ADA-compliant accessible rooms available with features such as wider doorways, roll-in showers, grab bars, and lowered fixtures. Please specify your accessibility needs when booking.'
        },
        {
          question: 'Are pets allowed?',
          answer: 'Yes, we are a pet-friendly hotel. We welcome dogs and cats up to 50 pounds with a non-refundable pet fee of $75 per stay. Please inform us in advance if you\'re bringing a pet, and review our pet policy for complete details.'
        },
        {
          question: 'Is smoking allowed in the rooms?',
          answer: 'All our rooms are non-smoking. We have designated outdoor smoking areas available. A cleaning fee of $250 will be charged if smoking is detected in any room.'
        }
      ]
    },
    {
      category: 'Hotel Facilities',
      questions: [
        {
          question: 'Do you have parking available?',
          answer: 'Yes, we offer complimentary self-parking for all guests. Valet parking is also available for an additional fee of $25 per day. Our parking facility is secure and monitored 24/7.'
        },
        {
          question: 'Is WiFi available?',
          answer: 'Yes, high-speed WiFi is complimentary throughout the hotel, including all guest rooms, lobby, restaurant, and common areas.'
        },
        {
          question: 'Do you have a fitness center?',
          answer: 'Yes, our state-of-the-art fitness center is open 24/7 for all guests. It features cardio equipment, free weights, and strength training machines.'
        },
        {
          question: 'Is breakfast included?',
          answer: 'Breakfast inclusion depends on the rate plan selected. Some packages include complimentary breakfast, while others offer it at an additional charge. Our restaurant serves breakfast daily from 6:30 AM to 10:30 AM.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, and cash. Payment is required at check-in or check-out unless prepaid during booking.'
        },
        {
          question: 'Are there any additional fees or taxes?',
          answer: 'Room rates are subject to applicable state and local taxes (currently 12%). Additional fees may apply for services such as parking, pet accommodation, late check-out, or room service. All fees will be clearly disclosed before you complete your booking.'
        },
        {
          question: 'Do you offer discounts or promotions?',
          answer: 'Yes, we regularly offer special promotions and discounts. Check our website for current offers, or sign up for our newsletter to receive exclusive deals. We also offer discounts for AAA members, seniors, military personnel, and corporate travelers.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'Standard reservations can be cancelled up to 48 hours before check-in for a full refund. Cancellations made within 48 hours of check-in will be charged for one night\'s stay. Non-refundable rates cannot be cancelled or modified. Special event dates may have different cancellation policies.'
        }
      ]
    },
    {
      category: 'Other Services',
      questions: [
        {
          question: 'Do you offer airport transportation?',
          answer: 'Yes, we offer airport shuttle service for a fee of $35 per person each way. Please contact us at least 24 hours in advance to arrange pickup. The airport is approximately 30 minutes from the hotel.'
        },
        {
          question: 'Is room service available?',
          answer: 'Yes, room service is available daily from 6:00 AM to 11:00 PM. Our full menu is available in your room, or you can call extension 7 to place an order.'
        },
        {
          question: 'Do you have meeting or event spaces?',
          answer: 'Yes, we have several meeting rooms and event spaces available for business meetings, conferences, weddings, and special events. Our events team can help you plan and coordinate your event. Please contact us for availability and pricing.'
        }
      ]
    }
  ]

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our hotel and services</p>
        </div>
      </section>

      <section className="faq-content">
        <div className="container">
          <div className="faq-intro">
            <p>
              Can't find the answer you're looking for? Please contact our front desk at{' '}
              <a href="tel:+15551234567">+1 (555) 123-4567</a> or email us at{' '}
              <a href="mailto:info@luxuryhotel.com">info@luxuryhotel.com</a>
            </p>
          </div>

          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === globalIndex

                  return (
                    <div
                      key={questionIndex}
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleAccordion(globalIndex)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="policies-section">
        <div className="container">
          <h2 className="section-title">Hotel Policies</h2>
          <div className="policies-grid">
            <div className="policy-card">
              <h3>Cancellation Policy</h3>
              <p>
                Standard reservations can be cancelled up to 48 hours before check-in for a full refund. 
                Cancellations made within 48 hours will be charged for one night's stay. Non-refundable 
                rates cannot be cancelled or modified.
              </p>
            </div>

            <div className="policy-card">
              <h3>Check-in / Check-out</h3>
              <p>
                Check-in time: 3:00 PM<br />
                Check-out time: 11:00 AM<br />
                Early check-in and late check-out available upon request (subject to availability and additional fees).
              </p>
            </div>

            <div className="policy-card">
              <h3>Pet Policy</h3>
              <p>
                We welcome pets up to 50 pounds with a non-refundable fee of $75 per stay. 
                Maximum of 2 pets per room. Pets must be leashed in public areas and cannot be 
                left unattended in rooms.
              </p>
            </div>

            <div className="policy-card">
              <h3>Smoking Policy</h3>
              <p>
                All rooms and indoor areas are non-smoking. Designated outdoor smoking areas are available. 
                A cleaning fee of $250 will be charged if smoking is detected in any room.
              </p>
            </div>

            <div className="policy-card">
              <h3>Age Requirement</h3>
              <p>
                Guests must be at least 21 years of age to check in. Valid government-issued photo 
                identification is required at check-in.
              </p>
            </div>

            <div className="policy-card">
              <h3>Damage Policy</h3>
              <p>
                Guests are responsible for any damage to the room or hotel property during their stay. 
                Charges for damages will be applied to the credit card on file.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
