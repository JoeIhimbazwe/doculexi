import "./pages.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function ReportBug() {
  const [submitted, setSubmitted] = useState(false);
  const [bug, setBug] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!bug || !email) {
      alert("Please fill in all fields!");
      return;
    }
    window.location.href = `mailto:ihimbazwejeff15@gmail.com?subject=Bug Report - DocuLexi&body=From: ${email}%0D%0A%0D%0ABug Description:%0D%0A${bug}`;
    setSubmitted(true);
  };

  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>🐛 Report a Bug</h1>
        <p className="page-subtitle">Found something broken? Let us know!</p>

        {submitted ? (
          <div className="success-box">
            ✅ Thank you for your report! We'll look into it shortly.
          </div>
        ) : (
          <div className="bug-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="page-input"
            />
            <textarea
              placeholder="Describe the bug in detail..."
              value={bug}
              onChange={(e) => setBug(e.target.value)}
              className="page-textarea"
              rows={6}
            />
            <button onClick={handleSubmit} className="page-btn">
              📨 Send Bug Report
            </button>
          </div>
        )}

        <div className="alt-contact">
          <p>Or contact us directly:</p>
          <a href="mailto:ihimbazwejeff15@gmail.com">ihimbazwejeff15@gmail.com</a>
          <a href="https://instagram.com/jeff_ihbz" target="_blank">@jeff_ihbz on Instagram</a>
        </div>
      </div>
    </div>
  );
}

export default ReportBug;