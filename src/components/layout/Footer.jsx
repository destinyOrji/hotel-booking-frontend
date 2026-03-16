import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = ({ hotelInfo = {} }) => {
  const {
    name = 'Royal Elysaa Hotel & Suites',
    address = '123 Royal street, Port Harcout, Rivers State, Nigeria',
    phone = '09138301508',
    email = 'royalelysaa@gmail.com'
  } = hotelInfo

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">{name}</h3>
          <address className="footer-address">
            <p className="footer-text">{address}</p>
            <p className="footer-text">
              Phone: <a href={`tel:${phone.replace(/\s/g, '')}`} className="footer-contact-link">{phone}</a>
            </p>
            <p className="footer-text">
              Email: <a href={`mailto:${email}`} className="footer-contact-link">{email}</a>
            </p>
          </address>
        </div>

        <nav className="footer-section" aria-label="Quick links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links" role="list">
            <li>
              <Link to="/rooms" className="footer-link">Rooms</Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">Contact</Link>
            </li>
            <li>
              <Link to="/faq" className="footer-link">
                <abbr title="Frequently Asked Questions">FAQ</abbr>
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-section" aria-label="Policies">
          <h4 className="footer-heading">Policies</h4>
          <ul className="footer-links" role="list">
            <li>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </li>
            <li>
              <Link to="/cancellation" className="footer-link">Cancellation Policy</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <nav className="footer-social" aria-label="Social media links">
            <a 
              href="https://facebook.com" 
              className="footer-social-link" 
              aria-label="Follow us on Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">Facebook</span>
            </a>
            <a 
              href="https://twitter.com" 
              className="footer-social-link" 
              aria-label="Follow us on Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">Twitter</span>
            </a>
            <a 
              href="https://instagram.com" 
              className="footer-social-link" 
              aria-label="Follow us on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">Instagram</span>
            </a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          <small>© {new Date().getFullYear()} {name}. All rights reserved.</small>
        </p>
      </div>
    </footer>
  )
}

export default Footer
