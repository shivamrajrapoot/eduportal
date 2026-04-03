// client/src/pages/SubjectPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; }

  .sp-root {
    min-height: 100vh;
    background: #f5f7fc;
    font-family: 'DM Sans', sans-serif;
    color: #1a1f36;
  }

  /* ── Nav ── */
  .sp-nav {
    background: #fff;
    border-bottom: 1px solid #e8ecf5;
    padding: 0 40px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .nav-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #1a4fa0 0%, #2d6ed4 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  .nav-brand-icon svg { width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .nav-brand-name {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: #1a1f36;
    letter-spacing: -0.3px;
  }

  .btn-back {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: transparent;
    color: #1a4fa0;
    border: 1.5px solid #c3d4f5;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.18s;
  }

  .btn-back:hover {
    background: #eef3fc;
    border-color: #a3bde8;
  }

  .btn-back svg { width: 14px; height: 14px; stroke: #1a4fa0; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── Hero ── */
  .sp-hero {
    background: linear-gradient(120deg, #1a4fa0 0%, #1e63c9 60%, #2d7adf 100%);
    padding: 40px 40px 36px;
    position: relative;
    overflow: hidden;
  }

  .sp-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -60px;
    width: 280px; height: 280px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .sp-hero::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 40%;
    width: 180px; height: 180px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .hero-breadcrumb {
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hero-breadcrumb span { cursor: pointer; }
  .hero-breadcrumb span:hover { color: rgba(255,255,255,0.85); }
  .hero-breadcrumb-sep { opacity: 0.4; }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 6px;
    letter-spacing: -0.5px;
  }

  .hero-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    margin: 0 0 24px;
    max-width: 560px;
  }

  .hero-stats {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hero-stat-val {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .hero-stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.04em;
  }

  .hero-stat-divider {
    width: 1px;
    background: rgba(255,255,255,0.2);
    align-self: stretch;
  }

  /* ── Trust Strip ── */
  .trust-strip {
    background: #eef3fc;
    border-bottom: 1px solid #dde7f8;
    padding: 9px 40px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: #3a5fa8;
    font-weight: 500;
  }

  .trust-dot { width: 5px; height: 5px; background: #3a5fa8; border-radius: 50%; }

  /* ── Body ── */
  .sp-body {
    max-width: 880px;
    margin: 0 auto;
    padding: 32px 40px 60px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #1a1f36;
    letter-spacing: -0.3px;
    margin: 0;
  }

  .section-pills {
    display: flex;
    gap: 8px;
  }

  .pill {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .pill-blue { background: #eef3fc; color: #1a4fa0; }
  .pill-green { background: #E8F5E9; color: #2e7d32; }

  /* ── Test List ── */
  .test-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .test-card {
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    padding: 22px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 0.35s ease forwards;
  }

  .test-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: #e8ecf5;
    transition: background 0.22s;
  }

  .test-card:hover {
    border-color: #b8ccf0;
    box-shadow: 0 6px 20px rgba(26,79,160,0.08);
    transform: translateX(2px);
  }

  .test-card:hover::before { background: #1a4fa0; }

  .test-card.attempted::before { background: #4CAF50; }
  .test-card.attempted { border-color: #c8e6c9; }

  .test-left { flex: 1; min-width: 0; }

  .test-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .test-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #1a1f36;
    letter-spacing: -0.2px;
    margin: 0;
  }

  .badge-attempted {
    font-size: 11px;
    font-weight: 600;
    background: #E8F5E9;
    color: #2e7d32;
    padding: 2px 9px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .badge-attempted::before {
    content: '';
    display: inline-block;
    width: 5px; height: 5px;
    background: #4CAF50;
    border-radius: 50%;
  }

  .test-desc {
    font-size: 13px;
    color: #6b7592;
    margin: 0 0 12px;
    line-height: 1.5;
  }

  .test-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .meta-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #555e7a;
    background: #f0f3fa;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  .meta-chip svg { width: 12px; height: 12px; stroke: #555e7a; fill: none; stroke-width: 2; stroke-linecap: round; }

  .meta-chip.negative {
    background: #fff0f0;
    color: #c0392b;
  }

  .meta-chip.negative svg { stroke: #c0392b; }

  /* ── Action Buttons ── */
  .test-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }

  .btn-primary {
    padding: 9px 20px;
    background: linear-gradient(135deg, #1a4fa0, #2060c8);
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.18s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,79,160,0.3); }

  .btn-primary svg { width: 13px; height: 13px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .btn-success {
    padding: 9px 20px;
    background: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.18s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-success:hover { background: #43a047; transform: translateY(-1px); }

  .btn-success svg { width: 13px; height: 13px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; }

  .btn-outline {
    padding: 8px 20px;
    background: transparent;
    color: #1a4fa0;
    border: 1.5px solid #c3d4f5;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.18s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-outline:hover { background: #eef3fc; border-color: #a3bde8; }

  .btn-outline svg { width: 13px; height: 13px; stroke: #1a4fa0; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── Empty ── */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
  }

  .empty-icon { font-size: 42px; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #4a5270; margin: 0 0 6px; }
  .empty-sub { font-size: 13px; color: #8a92a6; }

  /* ── Skeleton ── */
  .skeleton-card {
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    padding: 22px 24px;
  }

  .skeleton-line {
    background: linear-gradient(90deg, #f0f2f8 25%, #e2e6f0 50%, #f0f2f8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  /* ── Loading / Error full-page ── */
  .sp-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 12px;
  }

  .sp-spinner {
    width: 40px; height: 40px;
    border: 3px solid #e8ecf5;
    border-top-color: #1a4fa0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .sp-spinner-label {
    font-size: 14px;
    color: #8a92a6;
  }

  .sp-error-icon { font-size: 40px; }
  .sp-error-msg { font-size: 15px; color: #c0392b; font-weight: 500; }

  /* ── Animations ── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .card-stagger:nth-child(1) { animation-delay: 0.05s; }
  .card-stagger:nth-child(2) { animation-delay: 0.1s; }
  .card-stagger:nth-child(3) { animation-delay: 0.15s; }
  .card-stagger:nth-child(4) { animation-delay: 0.2s; }
  .card-stagger:nth-child(5) { animation-delay: 0.25s; }

  @media (max-width: 640px) {
    .sp-nav { padding: 0 20px; }
    .sp-hero { padding: 28px 20px 24px; }
    .trust-strip { padding: 9px 20px; }
    .sp-body { padding: 24px 20px 48px; }
    .test-card { flex-direction: column; align-items: flex-start; }
    .test-actions { flex-direction: row; flex-wrap: wrap; width: 100%; }
  }
`;

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
      <div className="skeleton-line" style={{ width: '50%', height: '18px' }} />
      <div className="skeleton-line" style={{ width: '70px', height: '18px', borderRadius: '20px' }} />
    </div>
    <div className="skeleton-line" style={{ width: '85%', height: '13px' }} />
    <div className="skeleton-line" style={{ width: '60%', height: '13px', marginBottom: '14px' }} />
    <div style={{ display: 'flex', gap: '8px' }}>
      {[80, 90, 95, 70].map((w, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${w}px`, height: '24px', borderRadius: '20px', marginBottom: 0 }} />
      ))}
    </div>
  </div>
);

const SubjectPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/subjects/${subjectId}`);
        setSubject(res.data.data.subject);
        const fetchedTests = res.data.data.tests;
        setTests(fetchedTests);

        const attemptMap = {};
        await Promise.all(
          fetchedTests.map(async (test) => {
            try {
              const aRes = await axiosInstance.get(`/attempts/check/${test._id}`);
              if (aRes.data.data.attemptId) {
                attemptMap[test._id] = aRes.data.data.attemptId;
              }
            } catch (err) {
              // no attempt — ignore
            }
          })
        );
        setAttempts(attemptMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const attemptedCount = Object.keys(attempts).length;
  const pendingCount = tests.length - attemptedCount;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-center">
          <div className="sp-spinner" />
          <span className="sp-spinner-label">Tests load ho rahe hain…</span>
        </div>
      </div>
    </>
  );

  if (!subject) return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-center">
          <div className="sp-error-icon">⚠️</div>
          <span className="sp-error-msg">Subject nahi mila!</span>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Wapas jao
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="sp-root">

        {/* ── Nav ── */}
        <nav className="sp-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="nav-brand-name">EduPortal</span>
          </div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
        </nav>

        {/* ── Hero ── */}
        <div className="sp-hero">
          <div className="hero-breadcrumb">
            <span onClick={() => navigate(-1)}>Dashboard</span>
            <span className="hero-breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{subject.name}</span>
          </div>
          <h1 className="hero-title">{subject.name}</h1>
          <p className="hero-desc">
            {subject.description || 'Is subject ke tests neeche dekhe. Apna score badhao!'}
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">{tests.length}</span>
              <span className="hero-stat-label">Total Tests</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">{attemptedCount}</span>
              <span className="hero-stat-label">Attempted</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">{pendingCount}</span>
              <span className="hero-stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* ── Trust Strip ── */}
        <div className="trust-strip">
          <div className="trust-item"><div className="trust-dot" />Secure Test Environment</div>
          <div className="trust-item"><div className="trust-dot" />Results Certified</div>
          <div className="trust-item"><div className="trust-dot" />Auto-saved Progress</div>
          <div className="trust-item"><div className="trust-dot" />Fair Evaluation</div>
        </div>

        {/* ── Body ── */}
        <main className="sp-body">
          <div className="section-header">
            <h2 className="section-title">Available Tests</h2>
            <div className="section-pills">
              {attemptedCount > 0 && <span className="pill pill-green">{attemptedCount} Done</span>}
              {pendingCount > 0 && <span className="pill pill-blue">{pendingCount} Pending</span>}
            </div>
          </div>

          {/* Empty state */}
          {tests.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">Abhi koi test available nahi hai</div>
              <div className="empty-sub">Admin jald hi tests add karega. Baad mein check karein.</div>
            </div>
          )}

          {/* Test cards */}
          <div className="test-list">
            {tests.map((test, idx) => {
              const attemptId = attempts[test._id];
              const isAttempted = !!attemptId;

              return (
                <div
                  key={test._id}
                  className={`test-card card-stagger ${isAttempted ? 'attempted' : ''}`}
                  style={{ animationDelay: `${0.05 + idx * 0.07}s`, animationFillMode: 'forwards' }}
                >
                  <div className="test-left">
                    <div className="test-title-row">
                      <h3 className="test-title">{test.title}</h3>
                      {isAttempted && (
                        <span className="badge-attempted">Attempted</span>
                      )}
                    </div>

                    {test.description && (
                      <p className="test-desc">{test.description}</p>
                    )}

                    <div className="test-meta">
                      <span className="meta-chip">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {test.duration} min
                      </span>
                      <span className="meta-chip">
                        <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                        {test.totalMarks} marks
                      </span>
                      <span className="meta-chip">
                        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/></svg>
                        Pass: {test.passingMarks}
                      </span>
                      {test.negativeMarking > 0 && (
                        <span className="meta-chip negative">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          -{test.negativeMarking} negative
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="test-actions">
                    {isAttempted ? (
                      <>
                        <button
                          className="btn-success"
                          onClick={() => navigate(`/result/${attemptId}`)}
                        >
                          <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/></svg>
                          View Result
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => navigate(`/reattempt/${test._id}`)}
                        >
                          <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                          Reattempt
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => navigate(`/test/${test._id}`)}
                      >
                        Start Test
                        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default SubjectPage;