import './PolicyPages.css'

const TermsOfService = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Terms of Service</h1>
        <p className="policy-updated">Last Updated: March 13, 2026</p>

        <section className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Royal Elysaa Hotel & Suites website and services, you accept 
            and agree to be bound by these Terms of Service. If you do not agree to these terms, 
            please do not use our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Booking and Reservations</h2>
          <h3>2.1 Reservation Process</h3>
          <p>
            All bookings are subject to availability and confirmation. We reserve the right to 
            refuse or cancel any reservation at our discretion.
          </p>
          <h3>2.2 Payment</h3>
          <p>
            Payment is required at the time of booking unless otherwise specified. All prices are 
            in Nigerian Naira (NGN) and include applicable taxes unless stated otherwise.
          </p>
          <h3>2.3 Booking Modifications</h3>
          <p>
            Modifications to existing bookings are subject to availability and may incur additional 
            charges. Please contact us at least 48 hours before your check-in date for any changes.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Check-in and Check-out</h2>
          <ul>
            <li>Check-in time: 2:00 PM</li>
            <li>Check-out time: 12:00 PM (Noon)</li>
            <li>Early check-in and late check-out are subject to availability and may incur additional charges</li>
            <li>Valid government-issued photo identification is required at check-in</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Guest Responsibilities</h2>
          <p>Guests are expected to:</p>
          <ul>
            <li>Respect hotel property and other guests</li>
            <li>Comply with hotel rules and regulations</li>
            <li>Not engage in illegal activities on the premises</li>
            <li>Not smoke in non-smoking areas</li>
            <li>Report any damages or issues immediately</li>
            <li>Be responsible for any damages caused during their stay</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Liability</h2>
          <h3>5.1 Hotel Liability</h3>
          <p>
            Royal Elysaa Hotel & Suites is not liable for any loss, damage, or injury to persons 
            or property unless caused by our negligence. We recommend guests secure travel insurance.
          </p>
          <h3>5.2 Guest Liability</h3>
          <p>
            Guests are liable for any damage to hotel property caused by themselves or their visitors. 
            Repair or replacement costs will be charged to the guest's account.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Privacy and Data Protection</h2>
          <p>
            Your use of our services is also governed by our Privacy Policy. Please review our 
            Privacy Policy to understand how we collect, use, and protect your personal information.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Promotional Offers</h2>
          <p>
            Promotional offers and discounts are subject to specific terms and conditions. 
            Offers cannot be combined unless explicitly stated and are valid for a limited time only.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Force Majeure</h2>
          <p>
            We are not liable for any failure to perform our obligations due to circumstances 
            beyond our reasonable control, including but not limited to natural disasters, 
            government actions, or other force majeure events.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Amendments</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be 
            effective immediately upon posting on our website. Your continued use of our services 
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms of Service are governed by the laws of the Federal Republic of Nigeria. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
            of the courts in Rivers State, Nigeria.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Contact Information</h2>
          <p>
            For questions or concerns regarding these Terms of Service, please contact us at:
          </p>
          <p>
            Email: <a href="mailto:royalelysaa@gmail.com">royalelysaa@gmail.com</a><br />
            Phone: <a href="tel:09138301508">09138301508</a>
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfService