import { Link } from "react-router-dom";
import "./pages.css";

function Cookie() {
  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>🍪 Cookie Policy</h1>
        <p className="page-subtitle">Last updated: March 2026</p>

        <div className="page-content">
          <h3>1. What Are Cookies</h3>
          <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and login status.</p>

          <h3>2. How We Use Cookies</h3>
          <p>DocuLexi uses cookies for the following purposes: authentication (to keep you logged in), session management, and improving app performance.</p>

          <h3>3. Types of Cookies We Use</h3>
          <p>We use essential cookies that are required for the app to function properly. These include authentication tokens provided by Supabase to keep you securely logged in.</p>

          <h3>4. Third Party Cookies</h3>
          <p>Our service providers including Supabase and CloudConvert may set their own cookies. These are governed by their respective privacy policies.</p>

          <h3>5. Managing Cookies</h3>
          <p>You can control cookies through your browser settings. However, disabling cookies may affect the functionality of DocuLexi, including your ability to stay logged in.</p>

          <h3>6. Contact</h3>
          <p>For any questions about our cookie policy contact us at <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Cookie;