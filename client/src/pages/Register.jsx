// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import PasswordInput from '../components/PasswordInput';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    background: #f5f7fc;
    font-family: 'DM Sans', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Left Panel ── */
  .reg-left {
    background: linear-gradient(145deg, #1a4fa0 0%, #1658b8 45%, #2070d8 100%);
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .reg-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 340px; height: 340px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .reg-left::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -60px;
    width: 280px; height: 280px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .left-brand {
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 1;
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

  .left-middle { position: relative; z-index: 1; }

  .left-tagline {
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }

  .left-headline {
    font-family: 'Sora', sans-serif;
    font-size: 30px; font-weight: 700;
    color: #fff; line-height: 1.25;
    letter-spacing: -0.7px;
    margin-bottom: 16px;
  }

  .left-headline span {
    display: block;
    color: rgba(255,255,255,0.52);
    font-size: 24px;
  }

  .left-body {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    line-height: 1.65;
    max-width: 340px;
    margin-bottom: 32px;
  }

  /* Steps */
  .left-steps { display: flex; flex-direction: column; gap: 0; }

  .left-step {
    display: flex; align-items: flex-start; gap: 14px;
    position: relative;
  }

  .step-left {
    display: flex; flex-direction: column; align-items: center;
  }

  .step-num {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .step-line {
    width: 1.5px; height: 28px;
    background: rgba(255,255,255,0.15);
    margin: 4px 0;
  }

  .left-step:last-child .step-line { display: none; }

  .step-content { padding-top: 4px; padding-bottom: 20px; }

  .step-title {
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.9);
    margin-bottom: 2px;
  }

  .step-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    line-height: 1.4;
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
  .reg-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    overflow-y: auto;
  }

  .reg-card {
    width: 100%;
    max-width: 400px;
  }

  .reg-card-header { margin-bottom: 28px; }

  .reg-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 700;
    color: #1a1f36; letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .reg-card-sub {
    font-size: 14px; color: #6b7592; line-height: 1.5;
  }

  /* ── Form ── */
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-group { margin-bottom: 14px; }

  .form-label {
    display: block;
    font-size: 13px; font-weight: 500;
    color: #3a3f55; margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .form-input {
    width: 100%;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1f36;
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

  /* Phone prefix */
  .phone-wrap {
    display: flex;
    border: 1.5px solid #dde3f0;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .phone-wrap:focus-within {
    border-color: #1a4fa0;
    box-shadow: 0 0 0 3px rgba(26, 79, 160, 0.1);
  }

  .phone-prefix {
    padding: 11px 12px;
    font-size: 14px; font-weight: 500;
    color: #4a5270;
    background: #f4f6fb;
    border-right: 1.5px solid #dde3f0;
    white-space: nowrap;
    display: flex; align-items: center;
  }

  .phone-input {
    flex: 1;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1f36;
    border: none; outline: none;
    background: transparent;
  }

  .phone-input::placeholder { color: #aab0c6; }

  /* Password hint */
  .password-hint {
    font-size: 11.5px;
    color: #aab0c6;
    margin-top: 5px;
    line-height: 1.4;
  }

  /* Strength bar */
  .strength-row {
    display: flex; gap: 4px; margin-top: 8px;
  }

  .strength-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: #e8ecf5;
    transition: background 0.3s;
  }

  .strength-seg.weak   { background: #ef4444; }
  .strength-seg.medium { background: #f59e0b; }
  .strength-seg.strong { background: #22c55e; }

  .strength-label {
    font-size: 11px; font-weight: 500;
    margin-top: 4px;
  }

  .strength-label.weak   { color: #ef4444; }
  .strength-label.medium { color: #f59e0b; }
  .strength-label.strong { color: #22c55e; }

  /* ── Error ── */
  .error-box {
    display: flex; align-items: flex-start; gap: 8px;
    background: #fff5f5;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
    font-size: 13px; color: #b91c1c;
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

  /* ── Submit Button ── */
  .btn-register {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #1a4fa0, #2060c8);
    color: #fff;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 6px;
  }

  .btn-register:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(26, 79, 160, 0.32);
  }

  .btn-register:active:not(:disabled) { transform: translateY(0); }

  .btn-register:disabled { opacity: 0.65; cursor: not-allowed; }

  .btn-register svg {
    width: 14px; height: 14px;
    stroke: #fff; fill: none;
    stroke-width: 2.5; stroke-linecap: round;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0;
  }

  .divider-line { flex: 1; height: 1px; background: #e8ecf5; }

  .divider-text { font-size: 12px; color: #aab0c6; font-weight: 500; white-space: nowrap; }

  /* ── Google ── */
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

  /* ── Bottom ── */
  .reg-links {
    margin-top: 22px;
    text-align: center;
    font-size: 13px; color: #6b7592;
  }

  .reg-links a {
    color: #1a4fa0; text-decoration: none; font-weight: 500;
    transition: opacity 0.15s;
  }

  .reg-links a:hover { opacity: 0.75; text-decoration: underline; }

  .trust-row {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-top: 24px; padding-top: 18px;
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
    .reg-root { grid-template-columns: 1fr; }
    .reg-left { display: none; }
    .reg-right { padding: 40px 24px; align-items: flex-start; padding-top: 60px; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// Password strength checker
const getStrength = (pwd) => {
  if (!pwd) return { level: 0, label: '', segments: [] };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', cls: 'weak', segs: [1, 0, 0, 0] };
  if (score === 2) return { level: 2, label: 'Fair', cls: 'medium', segs: [1, 1, 0, 0] };
  if (score === 3) return { level: 3, label: 'Good', cls: 'medium', segs: [1, 1, 1, 0] };
  return { level: 4, label: 'Strong', cls: 'strong', segs: [1, 1, 1, 1] };
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/register', formData);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(formData.password);

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">

        {/* ── Left Panel ── */}
        <div className="reg-left">
          <div className="left-brand">
            <div className="left-brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="left-brand-name">EduPortal</span>
          </div>

          <div className="left-middle">
            <div className="left-tagline">Free · Secure · Trusted</div>
            <h2 className="left-headline">
              Shuru karo aaj hi,
              <span>bilkul muft mein.</span>
            </h2>
            <p className="left-body">
              Ek baar register karo aur hazaron tests, subjects, aur courses tak lifetime access pao. Koi hidden charge nahi.
            </p>
            <div className="left-steps">
              <div className="left-step">
                <div className="step-left">
                  <div className="step-num">1</div>
                  <div className="step-line" />
                </div>
                <div className="step-content">
                  <div className="step-title">Account banao</div>
                  <div className="step-sub">Naam, email aur password — bas itna kaafi hai</div>
                </div>
              </div>
              <div className="left-step">
                <div className="step-left">
                  <div className="step-num">2</div>
                  <div className="step-line" />
                </div>
                <div className="step-content">
                  <div className="step-title">Course chuno</div>
                  <div className="step-sub">Apne syllabus ke hisaab se subjects select karo</div>
                </div>
              </div>
              <div className="left-step">
                <div className="step-left">
                  <div className="step-num">3</div>
                  <div className="step-line" />
                </div>
                <div className="step-content">
                  <div className="step-title">Test do, score dekho</div>
                  <div className="step-sub">Instant results, detailed analytics ke saath</div>
                </div>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <span>© 2025 EduPortal</span>
            <div className="left-footer-dot" />
            <span>Free Forever</span>
            <div className="left-footer-dot" />
            <span>Privacy Protected</span>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="reg-right">
          <div className="reg-card">

            <div className="reg-card-header">
              <h1 className="reg-card-title">Account banao 🎓</h1>
              <p className="reg-card-sub">Seedha dashboard par pahuncho — koi verification wait nahi.</p>
            </div>

            {error && (
              <div className="error-box">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Name + Email row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    className="form-input"
                    id="name" type="text" name="name"
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    className="form-input"
                    id="email" type="email" name="email"
                    placeholder="aap@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required autoComplete="email"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label className="form-label" htmlFor="mobile">Mobile Number</label>
                <div className="phone-wrap">
                  <span className="phone-prefix">🇮🇳 +91</span>
                  <input
                    className="phone-input"
                    id="mobile" type="tel" name="mobile"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={handleChange}
                    required maxLength={10}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  autoComplete="new-password"
                />
                {formData.password && (
                  <>
                    <div className="strength-row">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={`strength-seg ${strength.segs?.[i] ? strength.cls : ''}`}
                        />
                      ))}
                    </div>
                    <div className={`strength-label ${strength.cls}`}>{strength.label} password</div>
                  </>
                )}
                {!formData.password && (
                  <div className="password-hint">Min 8 characters, ek number aur ek uppercase zaroor ho</div>
                )}
              </div>

              <button type="submit" className="btn-register" disabled={loading}>
                {loading ? (
                  <>
                    <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    Register ho raha hai…
                  </>
                ) : (
                  'Account banao — Free mein'
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
              onClick={() => (window.location.href = 'http://localhost:8000/api/auth/google')}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.2 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.8 7.3 29.2 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 15.2l6.6 4.8C14.7 16.6 19 14 24 14c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.8 7.3 29.2 5 24 5c-7.7 0-14.3 4.4-17.7 10.2z"/>
                <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36.3 26.8 37 24 37c-5.3 0-9.7-3.6-11.2-8.5l-6.6 5C9.5 40.4 16.2 45 24 45z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.2 5.2C37 38.2 44 33 44 25c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              Google se register karo
            </button>

            <div className="reg-links">
              Already account hai? <Link to="/login">Login karo</Link>
            </div>

            <div className="trust-row">
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SSL Secured
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                No Spam
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Free Forever
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Register;