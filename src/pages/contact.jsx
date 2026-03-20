import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./pages.css";

function Contact() {
  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>📬 Contact Us</h1>
        <p className="page-subtitle">We'd love to hear from you!</p>

        <div className="contact-grid">
          <div className="contact-item">
            <FaUser className="contact-icon" />
            <div>
              <h4>Name</h4>
              <p>Joe Ihimbazwe</p>
            </div>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h4>Email</h4>
              <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a>
            </div>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <div>
              <h4>Phone</h4>
              <a href="tel:+8201033761274">+82 010 3376 1274</a>
            </div>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <div>
              <h4>Location</h4>
              <p>Sokcho, South Korea</p>
            </div>
          </div>
          <div className="contact-item">
            <FaInstagram className="contact-icon instagram" />
            <div>
              <h4>Instagram</h4>
              <a href="https://instagram.com/jeff_ihbz" target="_blank">@jeff_ihbz</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;