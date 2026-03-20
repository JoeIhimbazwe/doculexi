import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey there! 👋 I'm Lexi, your AI document assistant! Upload a PDF and I'll help you edit, format, or answer any questions about it!" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl(null);
    setStatus("");
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setChatLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Lexi, a friendly and smart AI document assistant built into a PDF to Word converter app. 
                    The user has uploaded a PDF file called "${file ? file.name : "no file yet"}". 
                    Help them with editing, formatting, and converting their document.
                    Be friendly, helpful and keep responses concise.
                    User message: ${userInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      setMessages([...newMessages, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "❌ Sorry, something went wrong. Please try again in a moment!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    setLoading(true);
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
      setStatus("✅ Conversion successful!");
    } catch (error) {
      setStatus(`❌ Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) return (
    <div className="auth-container">
      <div style={{ color: "white", fontSize: "20px" }}>Loading...</div>
    </div>
  );

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo">📄 DocuLexi</div>
        <div className="tagline">Smart PDF Conversion powered by AI</div>
        <div className="header-user">
          <span className="user-email">👤 {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        {/* Converter Card */}
        <div className="card">
          <div className="card-header">
            <h1>PDF to Word</h1>
            <p className="subtitle">Upload your PDF and convert it instantly</p>
          </div>

          <label className="upload-box">
            <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
            {file ? (
              <div className="file-selected">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="upload-content">
                <span className="upload-icon">☁️</span>
                <span className="upload-hint">Click to upload your PDF</span>
                <span className="upload-sub">Supports PDF files up to 10MB</span>
              </div>
            )}
          </label>

          <button onClick={handleConvert} className="convert-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Converting...
              </>
            ) : (
              <>⚡ Convert to Word</>
            )}
          </button>

          {status && (
            <div className={`status ${status.includes("❌") ? "error" : "success"}`}>
              {status}
            </div>
          )}

          {downloadUrl && (
            <a href={downloadUrl} download className="download-btn">
              ⬇️ Download Word File
            </a>
          )}
        </div>

        {/* Desktop Chat */}
        <div className="chat-card desktop-chat">
          <div className="chat-header">
            <div className="lexi-avatar">🤖</div>
            <div>
              <div className="lexi-name">Lexi</div>
              <div className="lexi-status">● Online</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.role === "bot" && <span className="bot-label">Lexi</span>}
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="message bot">
                <span className="bot-label">Lexi</span>
                <div className="typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask Lexi anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage} disabled={chatLoading}>
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Chat Button */}
      <div className="mobile-chat">
        <button className="float-btn" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? "✕" : "🤖"}
        </button>

        {chatOpen && (
          <div className="mobile-chat-window">
            <div className="chat-header">
              <div className="lexi-avatar">🤖</div>
              <div>
                <div className="lexi-name">Lexi</div>
                <div className="lexi-status">● Online</div>
              </div>
              <button className="close-btn" onClick={() => setChatOpen(false)}>✕</button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  {msg.role === "bot" && <span className="bot-label">Lexi</span>}
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="message bot">
                  <span className="bot-label">Lexi</span>
                  <div className="typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask Lexi anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleSendMessage} disabled={chatLoading}>
                🚀
              </button>
            </div>
          </div>
        )}
      </div>

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
            <p>Built with  by <span className="powered">Joe Ihimbazwe</span> — Sokcho, South Korea</p>
            <p>Powered by <span className="powered">Lexi AI</span> & <span className="powered">CloudConvert</span></p>
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