// client/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import PasswordInput from "../components/PasswordInput";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #f5f7fc;
    font-family: 'DM Sans', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Left Panel ── */
  .login-left {
    background: linear-gradient(145deg, #1a4fa0 0%, #1658b8 45%, #2070d8 100%);
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 340px; height: 340px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .login-left::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -60px;
    width: 280px; height: 280px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .left-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .left-brand-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }

  .left-brand-icon svg {
    width: 20px; height: 20px;
    fill: none; stroke: #fff;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }

  .left-brand-name {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 700;
    color: #fff; letter-spacing: -0.3px;
  }

  .left-middle {
    position: relative; z-index: 1;
  }

  .left-tagline {
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }

  .left-headline {
    font-family: 'Sora', sans-serif;
    font-size: 32px; font-weight: 700;
    color: #fff;
    line-height: 1.25;
    letter-spacing: -0.8px;
    margin-bottom: 16px;
  }

  .left-headline span {
    display: block;
    color: rgba(255,255,255,0.55);
    font-size: 26px;
  }

  .left-body {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    line-height: 1.65;
    max-width: 340px;
    margin-bottom: 32px;
  }

  .left-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .left-feature {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .feature-dot {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 15px;
  }

  .feature-text {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
  }

  .left-footer {
    position: relative; z-index: 1;
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    display: flex; align-items: center; gap: 6px;
  }

  .left-footer-dot {
    width: 4px; height: 4px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
  }

  /* ── Right Panel ── */
  .login-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
  }

  .login-card-header {
    margin-bottom: 32px;
  }

  .login-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 700;
    color: #1a1f36;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .login-card-sub {
    font-size: 14px;
    color: #6b7592;
    line-height: 1.5;
  }

  /* ── Form ── */
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #3a3f55;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .form-input {
    width: 100%;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a1f36;
    background: #fff;
    border: 1.5px solid #dde3f0;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    appearance: none;
  }

  .form-input::placeholder { color: #aab0c6; }

  .form-input:focus {
    border-color: #1a4fa0;
    box-shadow: 0 0 0 3px rgba(26, 79, 160, 0.1);
  }

  .form-input:hover:not(:focus) { border-color: #b8c4e0; }

  /* ── Error ── */
  .error-box {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #fff5f5;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 18px;
    font-size: 13px;
    color: #b91c1c;
    line-height: 1.45;
    animation: slideDown 0.2s ease;
  }

  .error-box svg {
    width: 15px; height: 15px;
    stroke: #b91c1c; fill: none;
    stroke-width: 2; stroke-linecap: round;
    flex-shrink: 0; margin-top: 1px;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Primary Button ── */
  .btn-login {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #1a4fa0, #2060c8);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }

  .btn-login:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(26, 79, 160, 0.32);
  }

  .btn-login:active:not(:disabled) { transform: translateY(0); }

  .btn-login:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn-login svg {
    width: 14px; height: 14px;
    stroke: #fff; fill: none;
    stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0;
  }

  .divider-line {
    flex: 1; height: 1px; background: #e8ecf5;
  }

  .divider-text {
    font-size: 12px; color: #aab0c6; font-weight: 500;
    white-space: nowrap;
  }

  /* ── Google Button ── */
  .btn-google {
    width: 100%;
    padding: 11px;
    background: #fff;
    color: #3a3f55;
    border: 1.5px solid #dde3f0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }

  .btn-google:hover {
    border-color: #b8c4e0;
    background: #fafbff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .google-icon {
    width: 18px; height: 18px; flex-shrink: 0;
  }

  /* ── Links ── */
  .login-links {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .login-link-row {
    font-size: 13px;
    color: #6b7592;
  }

  .login-link-row a {
    color: #1a4fa0;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.15s;
  }

  .login-link-row a:hover { opacity: 0.75; text-decoration: underline; }

  .forgot-link {
    font-size: 12px;
    color: #aab0c6;
    text-decoration: none;
    transition: color 0.15s;
  }

  .forgot-link:hover { color: #1a4fa0; }

  /* ── Trust badges ── */
  .trust-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #eef0f8;
    flex-wrap: wrap;
  }

  .trust-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: #8a92a6; font-weight: 500;
  }

  .trust-badge svg {
    width: 12px; height: 12px;
    stroke: #8a92a6; fill: none;
    stroke-width: 2; stroke-linecap: round;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 40px 24px; align-items: flex-start; padding-top: 60px; }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">

        {/* ── Left Panel ── */}
        <div className="login-left">
          <div className="left-brand">
            <div className="left-brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="left-brand-name">EduPortal</span>
          </div>

          <div className="left-middle">
            <div className="left-tagline">India's Trusted Test Platform</div>
            <h2 className="left-headline">
              Apni preparation
              <span>agle level par le jao.</span>
            </h2>
            <p className="left-body">
              Lakhs of students trust EduPortal for mock tests, subject practice, and real exam preparation. Secure, fast, and always available.
            </p>
            <div className="left-features">
              <div className="left-feature">
                <div className="feature-dot">📝</div>
                <span className="feature-text">Curriculum-aligned mock tests</span>
              </div>
              <div className="left-feature">
                <div className="feature-dot">📊</div>
                <span className="feature-text">Detailed score analytics</span>
              </div>
              <div className="left-feature">
                <div className="feature-dot">🔒</div>
                <span className="feature-text">SSL encrypted & tamper-proof results</span>
              </div>
              <div className="left-feature">
                <div className="feature-dot">⚡</div>
                <span className="feature-text">Instant result, no waiting</span>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <span>© 2025 EduPortal</span>
            <div className="left-footer-dot" />
            <span>Secure Platform</span>
            <div className="left-footer-dot" />
            <span>All rights reserved</span>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="login-right">
          <div className="login-card">

            <div className="login-card-header">
              <h1 className="login-card-title">Welcome back 👋</h1>
              <p className="login-card-sub">Apne account mein login karein aur practice shuru karein.</p>
            </div>

            {error && (
              <div className="error-box">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  className="form-input"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="aap@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" className="forgot-link">Bhool to nahi gaye password?</Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Apna password daalen"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <>
                    <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    Login ho raha hai…
                  </>
                ) : (
                  'Login karo'
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">ya fir</span>
              <div className="divider-line" />
            </div>

            <button
              className="btn-google"
              onClick={() => (window.location.href = "http://localhost:8000/api/auth/google")}
            >
              <svg className="google-icon" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.2 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.8 7.3 29.2 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 15.2l6.6 4.8C14.7 16.6 19 14 24 14c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.8 7.3 29.2 5 24 5c-7.7 0-14.3 4.4-17.7 10.2z"/>
                <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36.3 26.8 37 24 37c-5.3 0-9.7-3.6-11.2-8.5l-6.6 5C9.5 40.4 16.2 45 24 45z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.2 5.2C37 38.2 44 33 44 25c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              Google se login karo
            </button>

            <div className="login-links">
              <p className="login-link-row">
                Account nahi hai?{' '}
                <Link to="/register">Register karo</Link>
              </p>
            </div>

            <div className="trust-row">
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SSL Secured
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Data Encrypted
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Verified Platform
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Built with ❤️ by Shivam Singh Rajput
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;