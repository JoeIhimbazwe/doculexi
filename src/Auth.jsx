import { useState } from "react";
import { supabase } from "./supabase";
import "./Auth.css";

function Auth({ onLogin }) {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Check your email to confirm your account!");
      setPage("login");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first!");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Password reset email sent! Check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">📄 DocuLexi</div>
        <p className="auth-tagline">Smart PDF Conversion powered by AI</p>

        {/* Tabs */}
        {page !== "forgot" && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${page === "login" ? "active" : ""}`}
              onClick={() => { setPage("login"); setError(""); setMessage(""); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${page === "signup" ? "active" : ""}`}
              onClick={() => { setPage("signup"); setError(""); setMessage(""); }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Messages */}
        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}

        {/* Form */}
        <div className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />

          {page !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          )}

          {page === "login" && (
            <>
              <button onClick={handleLogin} className="auth-btn primary" disabled={loading}>
                {loading ? <><div className="spinner"></div> Logging in...</> : "Login"}
              </button>
              <button onClick={() => { setPage("forgot"); setError(""); setMessage(""); }} className="auth-link">
                Forgot password?
              </button>
            </>
          )}

          {page === "signup" && (
            <button onClick={handleSignup} className="auth-btn primary" disabled={loading}>
              {loading ? <><div className="spinner"></div> Creating account...</> : "Create Account"}
            </button>
          )}

          {page === "forgot" && (
            <>
              <button onClick={handleForgotPassword} className="auth-btn primary" disabled={loading}>
                {loading ? <><div className="spinner"></div> Sending...</> : "Send Reset Email"}
              </button>
              <button onClick={() => { setPage("login"); setError(""); setMessage(""); }} className="auth-link">
                ← Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;