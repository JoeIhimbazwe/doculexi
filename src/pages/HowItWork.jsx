import { Link } from "react-router-dom";
import "./pages.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "👤",
      title: "Create an Account",
      desc: "Sign up for free using your email address. No credit card required."
    },
    {
      number: "02",
      icon: "☁️",
      title: "Upload Your PDF",
      desc: "Click the upload box and select your PDF file. We support files up to 10MB."
    },
    {
      number: "03",
      icon: "⚡",
      title: "Click Convert",
      desc: "Hit the Convert to Word button and our system will process your file instantly."
    },
    {
      number: "04",
      icon: "⬇️",
      title: "Download Your File",
      desc: "Once conversion is complete, click the download button to save your Word document."
    },
    {
      number: "05",
      icon: "🤖",
      title: "Chat with Lexi",
      desc: "Use our AI assistant Lexi to get help with editing, formatting or any document questions."
    },
  ];

  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>🔄 How It Works</h1>
        <p className="page-subtitle">Convert your PDFs to Word in just a few simple steps</p>

        <div className="steps-list">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-cta">
          <p>Ready to get started?</p>
          <Link to="/" className="cta-btn">🚀 Start Converting Now</Link>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;