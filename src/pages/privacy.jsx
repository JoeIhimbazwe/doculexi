import "./pages.css";
import { Link } from "react-router-dom";

function Privacy() {
  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>🔒 Privacy Policy</h1>
        <p className="page-subtitle">Last updated: March 2026</p>

        <div className="page-content">
          <h3>1. Information We Collect</h3>
          <p>We collect your email address when you create an account. We also collect PDF files you upload for conversion purposes only.</p>

          <h3>2. How We Use Your Information</h3>
          <p>Your email is used for authentication purposes only. Uploaded files are processed for conversion and are not stored permanently on our servers.</p>

          <h3>3. Data Security</h3>
          <p>We use Supabase for secure authentication. Your data is encrypted and protected at all times.</p>

          <h3>4. Third Party Services</h3>
          <p>We use CloudConvert for PDF conversion and Google Gemini for AI assistance. These services have their own privacy policies.</p>

          <h3>5. Contact</h3>
          <p>For any privacy concerns contact us at <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;