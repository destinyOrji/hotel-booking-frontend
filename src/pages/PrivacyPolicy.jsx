import './PolicyPages.css'

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-updated">Last Updated: March 13, 2026</p>

        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>
            At Royal Elysaa Hotel & Suites, we collect information that you provide directly to us when you:
          </p>
          <ul>
            <li>Create an account or make a reservation</li>
            <li>Contact us for customer support</li>
            <li>Subscribe to our newsletter or promotional communications</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>The information we collect may include:</p>
          <ul>
            <li>Name, email address, phone number</li>
            <li>Billing and payment information</li>
            <li>Booking preferences and history</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and manage your bookings</li>
            <li>Communicate with you about your reservations</li>
            <li>Send you promotional offers and updates (with your consent)</li>
            <li>Improve our services and customer experience</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li>Service providers who assist in operating our business</li>
            <li>Payment processors for secure transaction handling</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website. 
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly 
            collect personal information from children.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy
