import './PolicyPages.css'

const CancellationPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Cancellation Policy</h1>
        <p className="policy-updated">Last Updated: March 13, 2026</p>

        <section className="policy-section">
          <h2>1. General Cancellation Terms</h2>
          <p>
            At Royal Elysaa Hotel & Suites, we understand that plans can change. This cancellation 
            policy outlines the terms and conditions for canceling or modifying your reservation.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Standard Cancellation Policy</h2>
          <h3>2.1 Free Cancellation Period</h3>
          <p>
            Reservations can be cancelled free of charge up to 48 hours before the scheduled 
            check-in date. Full refund will be processed within 7-10 business days.
          </p>
          <h3>2.2 Late Cancellation</h3>
          <p>
            Cancellations made within 48 hours of the check-in date will incur a charge equivalent 
            to one night's room rate plus applicable taxes.
          </p>
          <h3>2.3 No-Show Policy</h3>
          <p>
            Failure to check in without prior cancellation (no-show) will result in a charge for 
            the full reservation amount, and the reservation will be cancelled.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Special Rate Cancellation Policies</h2>
          <h3>3.1 Non-Refundable Rates</h3>
          <p>
            Bookings made at non-refundable promotional rates cannot be cancelled or modified. 
            The full amount is charged at the time of booking and is non-refundable under any circumstances.
          </p>
          <h3>3.2 Advance Purchase Rates</h3>
          <p>
            Advance purchase rates may have stricter cancellation policies. Please review the 
            specific terms at the time of booking. Typically, these reservations must be cancelled 
            at least 7 days prior to arrival for a partial refund.
          </p>
          <h3>3.3 Group Bookings</h3>
          <p>
            Group reservations (5 or more rooms) are subject to separate cancellation terms. 
            Please contact our reservations team for specific group cancellation policies.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. How to Cancel Your Reservation</h2>
          <p>To cancel your reservation, you can:</p>
          <ul>
            <li>Log in to your account and cancel through your booking dashboard</li>
            <li>Email us at <a href="mailto:royalelysaa@gmail.com">royalelysaa@gmail.com</a> with your booking reference</li>
            <li>Call us at <a href="tel:09138301508">09138301508</a> during business hours</li>
          </ul>
          <p>
            Please have your booking confirmation number ready when contacting us.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Modification Policy</h2>
          <h3>5.1 Date Changes</h3>
          <p>
            Changes to your reservation dates are subject to availability. If you wish to modify 
            your booking dates, please contact us at least 48 hours before your scheduled check-in.
          </p>
          <h3>5.2 Room Type Changes</h3>
          <p>
            Upgrades or changes to room types are subject to availability and may result in 
            additional charges based on the price difference.
          </p>
          <h3>5.3 Guest Name Changes</h3>
          <p>
            Minor corrections to guest names can be made free of charge. Transferring a reservation 
            to a different guest may be subject to cancellation and rebooking.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Refund Processing</h2>
          <p>
            Approved refunds will be processed to the original payment method within 7-10 business 
            days. Please note that your bank or credit card company may take additional time to 
            post the refund to your account.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Force Majeure and Exceptional Circumstances</h2>
          <p>
            In cases of force majeure events (natural disasters, government travel restrictions, 
            medical emergencies, etc.), we will work with guests on a case-by-case basis to find 
            a suitable solution, which may include:
          </p>
          <ul>
            <li>Full refund</li>
            <li>Rebooking for future dates without penalty</li>
            <li>Credit voucher for future stays</li>
          </ul>
          <p>
            Documentation may be required to verify exceptional circumstances.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Early Departure</h2>
          <p>
            If you check out earlier than your scheduled departure date, charges for the remaining 
            nights may apply unless prior arrangements have been made with the hotel management.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have questions about our cancellation policy or need assistance with your 
            reservation, please contact us:
          </p>
          <p>
            Email: <a href="mailto:royalelysaa@gmail.com">royalelysaa@gmail.com</a><br />
            Phone: <a href="tel:09138301508">09138301508</a><br />
            Address: 123 Royal street, Port Harcourt, Rivers State, Nigeria
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Policy Updates</h2>
          <p>
            This cancellation policy is subject to change. Any modifications will be posted on 
            our website with an updated "Last Updated" date. Reservations are subject to the 
            cancellation policy in effect at the time of booking.
          </p>
        </section>
      </div>
    </div>
  )
}

export default CancellationPolicy
