import { Link } from "react-router-dom";
import "./pages.css";

function Pricing() {
  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>💰 Pricing</h1>
        <p className="page-subtitle">Simple and transparent pricing for everyone</p>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="pricing-badge free">Free</div>
            <div className="pricing-price">$0<span>/month</span></div>
            <p className="pricing-desc">Perfect for occasional use</p>
            <ul className="pricing-features">
              <li>✅ 25 conversions per day</li>
              <li>✅ PDF to Word conversion</li>
              <li>✅ AI Assistant Lexi</li>
              <li>✅ Mobile friendly</li>
              <li>✅ Secure file handling</li>
              <li>❌ Priority support</li>
              <li>❌ Unlimited conversions</li>
              <li>❌ Advanced AI features</li>
            </ul>
            <Link to="/" className="pricing-btn free-btn">Get Started Free</Link>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card pro">
            <div className="pricing-badge pro-badge">Pro ⭐</div>
            <div className="pricing-price">$9.99<span>/month</span></div>
            <p className="pricing-desc">Perfect for professionals</p>
            <ul className="pricing-features">
              <li>✅ Unlimited conversions</li>
              <li>✅ PDF to Word conversion</li>
              <li>✅ Advanced AI Assistant</li>
              <li>✅ Mobile friendly</li>
              <li>✅ Secure file handling</li>
              <li>✅ Priority support</li>
              <li>✅ Larger file sizes (50MB)</li>
              <li>✅ Conversion history</li>
            </ul>
            <a href="mailto:ihimbazwejeff15@gmail.com?subject=DocuLexi Pro Plan" className="pricing-btn pro-btn">
              Contact Us to Upgrade
            </a>
          </div>
        </div>

        <p className="pricing-note">
          💬 Need a custom plan? Contact us at <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

export default Pricing;