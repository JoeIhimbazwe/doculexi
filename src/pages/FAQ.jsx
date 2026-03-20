import "./pages.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "How do I convert a PDF to Word?",
      a: "Simply upload your PDF file by clicking the upload box, then click the Convert to Word button. Your converted file will be ready to download in seconds!"
    },
    {
      q: "Is DocuLexi free to use?",
      a: "Yes! DocuLexi is completely free to use. We offer 25 free conversions per day powered by CloudConvert."
    },
    {
      q: "Is my data safe?",
      a: "Absolutely! We use Supabase for secure authentication and your files are deleted from our servers immediately after conversion."
    },
    {
      q: "What file size is supported?",
      a: "We support PDF files up to 10MB. For larger files please contact us."
    },
    {
      q: "Who is Lexi?",
      a: "Lexi is our AI document assistant powered by Google Gemini. She can help you with editing, formatting and answering questions about your documents!"
    },
    {
      q: "How do I contact support?",
      a: "You can reach us at ihimbazwejeff15@gmail.com or on Instagram @jeff_ihbz. We typically respond within 24 hours."
    },
  ];

  return (
    <div className="page-container">
      <div className="page-box">
        <Link to="/" className="back-btn">← Back to App</Link>
        <h1>❓ FAQ</h1>
        <p className="page-subtitle">Frequently Asked Questions</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpen(open === index ? null : index)}
              >
                {faq.q}
                <span>{open === index ? "▲" : "▼"}</span>
              </button>
              {open === index && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;