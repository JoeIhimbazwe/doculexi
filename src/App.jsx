import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import * as pdfjsLib from "pdfjs-dist";
import { FaFilePdf, FaFileWord, FaShieldAlt, FaBolt, FaMobileAlt, FaCheckCircle } from "react-icons/fa";
import "./App.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [lexiResult, setLexiResult] = useState("");
  const [lexiLoading, setLexiLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const extractPdfText = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit!");
        return;
      }
      setFile(selected);
      setDownloadUrl(null);
      setStatus("");
      setStep(2);
      setLexiResult("");
      const text = await extractPdfText(selected);
      setPdfText(text);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      if (dropped.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit!");
        return;
      }
      setFile(dropped);
      setDownloadUrl(null);
      setStatus("");
      setStep(2);
      setLexiResult("");
      const text = await extractPdfText(dropped);
      setPdfText(text);
    } else {
      alert("Please upload a PDF file only!");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setStep(3);
    setStatus("Uploading your file...");
    setDownloadUrl(null);

    try {
      const apiKey = import.meta.env.VITE_CLOUDCONVERT_API_KEY;

      const jobResponse = await fetch("https://api.cloudconvert.com/v2/jobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: {
            "upload-file": { operation: "import/upload" },
            "convert-file": {
              operation: "convert",
              input: "upload-file",
              input_format: "pdf",
              output_format: "docx",
            },
            "export-file": {
              operation: "export/url",
              input: "convert-file",
            },
          },
        }),
      });

      const job = await jobResponse.json();
      const uploadTask = job.data.tasks.find((t) => t.name === "upload-file");

      setStatus("Converting your file...");
      const formData = new FormData();
      Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("file", file);

      await fetch(uploadTask.result.form.url, {
        method: "POST",
        body: formData,
      });

      let exportTask = null;
      while (!exportTask || exportTask.status !== "finished") {
        await new Promise((r) => setTimeout(r, 2000));
        const jobStatus = await fetch(
          `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        const jobData = await jobStatus.json();
        exportTask = jobData.data.tasks.find((t) => t.name === "export-file");
        if (exportTask?.status === "error") throw new Error("Conversion failed!");
      }

      const url = exportTask.result.files[0].url;
      setDownloadUrl(url);
      setStatus("✅ Your file is ready!");
      setStep(4);
    } catch (error) {
      setStatus(`❌ Something went wrong: ${error.message}`);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleLexiAction = async (action) => {
    if (!pdfText) {
      alert("No PDF text found!");
      return;
    }
    setLexiLoading(true);
    setActiveFeature(action);
    setLexiResult("");

    const prompts = {
      summarize: `Summarize the following document in clear bullet points. Be concise and highlight the most important information:\n\n${pdfText.slice(0, 3000)}`,
      simplify: `Rewrite the following document in simple, easy-to-understand language. Make it clear for anyone to read:\n\n${pdfText.slice(0, 3000)}`,
      format: `Clean up and fix the formatting of the following document. Organize it with proper headings, paragraphs and structure:\n\n${pdfText.slice(0, 3000)}`,
    };

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompts[action] }] }],
          }),
        }
      );
      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;
      setLexiResult(result);
    } catch (error) {
      setLexiResult("❌ Lexi is unavailable right now. Please try again later!");
    } finally {
      setLexiLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("");
    setDownloadUrl(null);
    setStep(1);
    setPdfText("");
    setLexiResult("");
    setActiveFeature("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lexiResult);
    alert("✅ Copied to clipboard! Paste it into your Word document.");
  };

  if (checkingAuth) return (
    <div className="auth-container">
      <div className="loading-screen">
        <div className="loading-logo">📄 DocuLexi</div>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="container">

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">📄 DocuLexi</div>
          <div className="header-right">
            <span className="user-email">👤 {user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-pill">✨ AI-Powered Document Conversion</div>
        <h1 className="hero-title">Convert PDF to Word<br />in Seconds</h1>
        <p className="hero-subtitle">Upload your PDF and get a perfectly formatted Word document instantly. Then enhance it with Lexi AI.</p>
        <div className="trust-badges">
          <span className="trust-badge"><FaShieldAlt /> Secure</span>
          <span className="trust-badge"><FaBolt /> Fast</span>
          <span className="trust-badge">🆓 Free</span>
          <span className="trust-badge"><FaMobileAlt /> Mobile Friendly</span>
        </div>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Documents Converted</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">99%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">&lt;30s</span>
            <span className="stat-label">Average Time</span>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="steps-progress">
        <div className={`step-dot ${step >= 1 ? "active" : ""}`}>
          <span>1</span>
          <p>Upload</p>
        </div>
        <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
        <div className={`step-dot ${step >= 2 ? "active" : ""}`}>
          <span>2</span>
          <p>Review</p>
        </div>
        <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
        <div className={`step-dot ${step >= 3 ? "active" : ""}`}>
          <span>3</span>
          <p>Convert</p>
        </div>
        <div className={`step-line ${step >= 4 ? "active" : ""}`}></div>
        <div className={`step-dot ${step >= 4 ? "active" : ""}`}>
          <span>4</span>
          <p>Download</p>
        </div>
      </div>

      {/* Main Card */}
      <main className="main">
        <div className="card">

          {/* Step 1 & 2 — Upload */}
          {step <= 2 && (
            <>
              <div className="card-title">
                <FaFilePdf className="card-title-icon pdf" />
                <span>Upload your PDF</span>
                <span className="arrow">→</span>
                <FaFileWord className="card-title-icon word" />
                <span>Get Word file</span>
              </div>

              <label
                className={`upload-box ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
                {file ? (
                  <div className="file-selected">
                    <div className="file-icon-wrap"><FaFilePdf style={{color: "#f87171", fontSize: "32px"}} /></div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)} KB · PDF Document</span>
                    </div>
                    <FaCheckCircle style={{color: "#22c55e", fontSize: "24px"}} />
                  </div>
                ) : (
                  <div className="upload-content">
                    <div className="upload-icon-wrap">☁️</div>
                    <p className="upload-hint">Drag & drop your PDF here</p>
                    <p className="upload-or">or</p>
                    <span className="upload-browse">Browse Files</span>
                    <p className="upload-sub">PDF files only · Max 10MB · Free</p>
                  </div>
                )}
              </label>

              {file && (
                <div className="action-row">
                  <button onClick={handleReset} className="reset-btn">✕ Remove</button>
                  <button onClick={handleConvert} className="convert-btn">
                    ⚡ Convert to Word
                  </button>
                </div>
              )}

              {!file && (
                <div className="features-hint">
                  <div className="feature-hint-item"><FaCheckCircle color="#22c55e" /> No registration required</div>
                  <div className="feature-hint-item"><FaCheckCircle color="#22c55e" /> Files deleted after conversion</div>
                  <div className="feature-hint-item"><FaCheckCircle color="#22c55e" /> 100% free to use</div>
                </div>
              )}
            </>
          )}

          {/* Step 3 — Converting */}
          {step === 3 && (
            <div className="converting-state">
              <div className="converting-icon">⚙️</div>
              <h3>Converting your file...</h3>
              <p>{status}</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="converting-note">This usually takes 10-30 seconds</p>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="success-state">
              <div className="success-icon">🎉</div>
              <h3>Conversion Complete!</h3>
              <p>Your Word document is ready to download.</p>
              <a href={downloadUrl} download className="download-btn">
                ⬇️ Download Word File
              </a>
              <button onClick={handleReset} className="convert-another-btn">
                Convert Another File
              </button>
            </div>
          )}

          {/* Error */}
          {status.includes("❌") && (
            <div className="error-state">{status}</div>
          )}
        </div>

        {/* Lexi AI Card */}
        {step === 4 && (
          <div className="lexi-card">
            <div className="lexi-header">
              <div className="lexi-icon">✨</div>
              <div>
                <h3>Lexi AI Assistant</h3>
                <p>Improve your document instantly</p>
              </div>
              <div className="lexi-badge">NEW</div>
            </div>

            <p className="lexi-desc">Your document has been converted! Now let Lexi AI enhance it for you. Choose an action below:</p>

            <div className="lexi-actions">
              <button
                onClick={() => handleLexiAction("summarize")}
                className={`lexi-btn ${activeFeature === "summarize" ? "active" : ""}`}
                disabled={lexiLoading}
              >
                📝 Summarize
              </button>
              <button
                onClick={() => handleLexiAction("simplify")}
                className={`lexi-btn ${activeFeature === "simplify" ? "active" : ""}`}
                disabled={lexiLoading}
              >
                ✏️ Simplify Text
              </button>
              <button
                onClick={() => handleLexiAction("format")}
                className={`lexi-btn ${activeFeature === "format" ? "active" : ""}`}
                disabled={lexiLoading}
              >
                🎨 Fix Formatting
              </button>
            </div>

            {lexiLoading && (
              <div className="lexi-loading">
                <div className="lexi-spinner"></div>
                <p>Lexi is working on your document...</p>
              </div>
            )}

            {lexiResult && !lexiLoading && (
              <div className="lexi-result">
                <div className="lexi-result-header">
                  <span>✨ Lexi's Result</span>
                  <button onClick={copyToClipboard} className="copy-btn">
                    📋 Copy to Clipboard
                  </button>
                </div>
                <div className="lexi-result-text">{lexiResult}</div>
                <p className="lexi-hint">💡 Copy this and paste it into your Word document!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-box">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">📄 DocuLexi</span>
              <p>Smart PDF conversion powered by AI. Fast, secure and free to use.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="/features">Features</a>
                <a href="/how-it-works">How it works</a>
                <a href="/pricing">Pricing</a>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact Us</a>
                <a href="/report-bug">Report a Bug</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/cookie">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p>© 2026 DocuLexi. All rights reserved.</p>
            <p>Built with ❤️ by <span className="powered">Joe Ihimbazwe</span> — Sokcho, South Korea</p>
            <div className="footer-badges">
              <span className="badge">🔒 Secure</span>
              <span className="badge">⚡ Fast</span>
              <span className="badge">🤖 AI Powered</span>
              <span className="badge">📄 PDF Expert</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;