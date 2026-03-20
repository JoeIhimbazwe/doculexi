import "./pages.css";
import { Link } from "react-router-dom";

function Terms() {
  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>📋 Terms of Service</h1>
        <p className="page-subtitle">Last updated: March 2026</p>

        <div className="page-content">
          <h3>1. Acceptance of Terms</h3>
          <p>By using DocuLexi, you agree to these terms of service. If you do not agree, please do not use our service.</p>

          <h3>2. Use of Service</h3>
          <p>DocuLexi is provided for personal and professional use. You may not use this service for illegal activities or to upload harmful content.</p>

          <h3>3. File Uploads</h3>
          <p>You are responsible for the files you upload. We do not store your files permanently. Files are deleted after conversion is complete.</p>

          <h3>4. Limitations</h3>
          <p>DocuLexi is provided as-is. We are not responsible for any data loss or conversion errors. Always keep a backup of your original files.</p>

          <h3>5. Changes to Terms</h3>
          <p>We reserve the right to update these terms at any time. Continued use of the service means you accept the new terms.</p>

          <h3>6. Contact</h3>
          <p>For questions about these terms contact <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Terms;