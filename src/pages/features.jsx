import { Link } from "react-router-dom";
import "./pages.css";

function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Fast Conversion",
      desc: "Convert your PDF files to Word documents in seconds. No waiting, no hassle."
    },
    {
      icon: "🤖",
      title: "AI Assistant — Lexi",
      desc: "Chat with Lexi, our AI document assistant. Ask questions, get editing help and document advice instantly."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      desc: "Your files are encrypted and deleted immediately after conversion. We never store your documents."
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      desc: "Use DocuLexi on any device — desktop, tablet or mobile. Fully responsive design."
    },
    {
      icon: "☁️",
      title: "Cloud Powered",
      desc: "Powered by CloudConvert — industry leading conversion technology used by millions worldwide."
    },
    {
      icon: "👤",
      title: "User Accounts",
      desc: "Create a free account to track your conversions and access your history anytime."
    },
    {
      icon: "🌍",
      title: "Works Anywhere",
      desc: "No software to install. DocuLexi works entirely in your browser from anywhere in the world."
    },
    {
      icon: "💬",
      title: "24/7 Support",
      desc: "Our team is available to help you via email and Instagram anytime you need assistance."
    },
  ];

  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>✨ Features</h1>
        <p className="page-subtitle">Everything you need to work with PDF documents</p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;