// client/src/pages/CoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; }

  .cp-root {
    min-height: 100vh;
    background: #f5f7fc;
    font-family: 'DM Sans', sans-serif;
    color: #1a1f36;
  }

  /* ── Nav ── */
  .cp-nav {
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
  }

  .nav-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #1a4fa0 0%, #2d6ed4 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  .nav-brand-icon svg {
    width: 18px; height: 18px;
    fill: none; stroke: #fff; stroke-width: 2;
    stroke-linecap: round; stroke-linejoin: round;
  }

  .nav-brand-name {
    font-family: 'Sora', sans-serif;
    font-weight: 700; font-size: 17px;
    color: #1a1f36; letter-spacing: -0.3px;
  }

  .btn-back {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    background: transparent;
    color: #1a4fa0;
    border: 1.5px solid #c3d4f5;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    transition: all 0.18s;
  }

  .btn-back:hover { background: #eef3fc; border-color: #a3bde8; }

  .btn-back svg {
    width: 14px; height: 14px;
    stroke: #1a4fa0; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }

  /* ── Hero ── */
  .cp-hero {
    background: linear-gradient(120deg, #1a4fa0 0%, #1e63c9 60%, #2d7adf 100%);
    padding: 40px 40px 36px;
    position: relative;
    overflow: hidden;
  }

  .cp-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -60px;
    width: 280px; height: 280px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .cp-hero::after {
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
    display: flex; align-items: center; gap: 6px;
  }

  .hero-breadcrumb span { cursor: pointer; transition: color 0.15s; }
  .hero-breadcrumb span:hover { color: rgba(255,255,255,0.85); }
  .hero-breadcrumb-sep { opacity: 0.4; }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 26px; font-weight: 700;
    color: #fff; margin: 0 0 6px;
    letter-spacing: -0.5px;
  }

  .hero-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    margin: 0 0 24px;
    max-width: 560px;
    line-height: 1.6;
  }

  .hero-stats {
    display: flex; gap: 24px; flex-wrap: wrap;
  }

  .hero-stat { display: flex; flex-direction: column; gap: 2px; }

  .hero-stat-val {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700;
    color: #fff; line-height: 1;
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
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }

  .trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: #3a5fa8; font-weight: 500;
  }

  .trust-dot { width: 5px; height: 5px; background: #3a5fa8; border-radius: 50%; }

  /* ── Body ── */
  .cp-body {
    max-width: 1080px;
    margin: 0 auto;
    padding: 32px 40px 60px;
  }

  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Sora', sans-serif;
    font-size: 17px; font-weight: 600;
    color: #1a1f36; letter-spacing: -0.3px; margin: 0;
  }

  .section-count {
    font-size: 12px; color: #8a92a6;
    background: #edf0f7;
    padding: 3px 10px; border-radius: 20px; font-weight: 500;
  }

  /* ── Subject Grid ── */
  .subject-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
  }

  .subject-card {
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    padding: 22px;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 0.35s ease forwards;
    animation-fill-mode: forwards;
  }

  .subject-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 16px 16px 0 0;
    opacity: 0;
    transition: opacity 0.22s;
  }

  .subject-card:hover {
    border-color: #b8ccf0;
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(26, 79, 160, 0.1);
  }

  .subject-card:hover::after { opacity: 1; }

  /* per-card accent colors */
  .subject-card:nth-child(6n+1)::after { background: linear-gradient(90deg, #1a4fa0, #4a88e8); }
  .subject-card:nth-child(6n+2)::after { background: linear-gradient(90deg, #166534, #22c55e); }
  .subject-card:nth-child(6n+3)::after { background: linear-gradient(90deg, #92400e, #f59e0b); }
  .subject-card:nth-child(6n+4)::after { background: linear-gradient(90deg, #7c3aed, #a78bfa); }
  .subject-card:nth-child(6n+5)::after { background: linear-gradient(90deg, #b91c1c, #f87171); }
  .subject-card:nth-child(6n+6)::after { background: linear-gradient(90deg, #0f766e, #2dd4bf); }

  .subject-icon-wrap {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    font-size: 22px;
    flex-shrink: 0;
  }

  /* icon bg matches accent */
  .subject-card:nth-child(6n+1) .subject-icon-wrap { background: #eef3fc; }
  .subject-card:nth-child(6n+2) .subject-icon-wrap { background: #dcf5e7; }
  .subject-card:nth-child(6n+3) .subject-icon-wrap { background: #fef3c7; }
  .subject-card:nth-child(6n+4) .subject-icon-wrap { background: #ede9fe; }
  .subject-card:nth-child(6n+5) .subject-icon-wrap { background: #fee2e2; }
  .subject-card:nth-child(6n+6) .subject-icon-wrap { background: #ccfbf1; }

  .subject-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 600;
    color: #1a1f36; margin: 0 0 7px;
    letter-spacing: -0.2px; line-height: 1.35;
  }

  .subject-desc {
    font-size: 13px; color: #6b7592;
    margin: 0 0 16px;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 40px;
  }

  .subject-footer {
    display: flex; align-items: center; justify-content: space-between;
  }

  .subject-cta {
    font-size: 12px; font-weight: 600;
    color: #1a4fa0;
    display: flex; align-items: center; gap: 4px;
    transition: gap 0.18s;
  }

  .subject-card:hover .subject-cta { gap: 7px; }

  .subject-cta svg {
    width: 13px; height: 13px;
    stroke: #1a4fa0; fill: none;
    stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    transition: transform 0.18s;
  }

  .subject-card:hover .subject-cta svg { transform: translateX(2px); }

  .subject-arrow {
    width: 30px; height: 30px;
    background: #f0f4fb;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }

  .subject-card:hover .subject-arrow { background: #1a4fa0; }

  .subject-arrow svg {
    width: 13px; height: 13px;
    stroke: #1a4fa0; fill: none;
    stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    transition: stroke 0.2s;
  }

  .subject-card:hover .subject-arrow svg { stroke: #fff; }

  /* ── Skeleton ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
  }

  .skeleton-card {
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    padding: 22px;
  }

  .skeleton-line {
    background: linear-gradient(90deg, #f0f2f8 25%, #e2e6f0 50%, #f0f2f8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  /* ── Empty ── */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    grid-column: 1 / -1;
  }

  .empty-icon { font-size: 42px; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #4a5270; margin: 0 0 6px; }
  .empty-sub { font-size: 13px; color: #8a92a6; }

  /* ── Full-page states ── */
  .cp-center {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 12px;
  }

  .cp-spinner {
    width: 40px; height: 40px;
    border: 3px solid #e8ecf5;
    border-top-color: #1a4fa0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .cp-spinner-label { font-size: 14px; color: #8a92a6; }
  .cp-error-icon { font-size: 40px; }
  .cp-error-msg { font-size: 15px; color: #c0392b; font-weight: 500; }

  /* ── Animations ── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .card-stagger:nth-child(1) { animation-delay: 0.04s; }
  .card-stagger:nth-child(2) { animation-delay: 0.09s; }
  .card-stagger:nth-child(3) { animation-delay: 0.14s; }
  .card-stagger:nth-child(4) { animation-delay: 0.19s; }
  .card-stagger:nth-child(5) { animation-delay: 0.24s; }
  .card-stagger:nth-child(6) { animation-delay: 0.29s; }
  .card-stagger:nth-child(7) { animation-delay: 0.34s; }
  .card-stagger:nth-child(8) { animation-delay: 0.39s; }

  @media (max-width: 640px) {
    .cp-nav { padding: 0 20px; }
    .cp-hero { padding: 28px 20px 24px; }
    .trust-strip { padding: 9px 20px; }
    .cp-body { padding: 24px 20px 48px; }
    .hero-title { font-size: 20px; }
  }
`;

const getSubjectIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('math') || n.includes('ganit') || n.includes('algebra') || n.includes('calculus')) return '📐';
  if (n.includes('physics') || n.includes('bhautik')) return '⚛️';
  if (n.includes('chemistry') || n.includes('rasayan') || n.includes('chem')) return '🧪';
  if (n.includes('biology') || n.includes('jeev') || n.includes('bio')) return '🧬';
  if (n.includes('english') || n.includes('grammar') || n.includes('literature')) return '📝';
  if (n.includes('hindi')) return '📖';
  if (n.includes('computer') || n.includes('code') || n.includes('it') || n.includes('programming')) return '💻';
  if (n.includes('history') || n.includes('itihas')) return '🏛️';
  if (n.includes('geography') || n.includes('geo') || n.includes('bhugol')) return '🌍';
  if (n.includes('economics') || n.includes('arthashastra')) return '📊';
  if (n.includes('science') || n.includes('vigyan')) return '🔬';
  if (n.includes('civics') || n.includes('political') || n.includes('polity')) return '⚖️';
  if (n.includes('sanskrit')) return '🕉️';
  if (n.includes('social')) return '🤝';
  return '📚';
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-line" style={{ width: '48px', height: '48px', borderRadius: '14px', marginBottom: '14px' }} />
    <div className="skeleton-line" style={{ width: '65%', height: '17px' }} />
    <div className="skeleton-line" style={{ width: '90%', height: '13px' }} />
    <div className="skeleton-line" style={{ width: '70%', height: '13px', marginBottom: '16px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton-line" style={{ width: '90px', height: '13px', marginBottom: 0 }} />
      <div className="skeleton-line" style={{ width: '30px', height: '30px', borderRadius: '8px', marginBottom: 0 }} />
    </div>
  </div>
);

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(res.data.data.course);
        setSubjects(res.data.data.subjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <div className="cp-center">
          <div className="cp-spinner" />
          <span className="cp-spinner-label">Course load ho raha hai…</span>
        </div>
      </div>
    </>
  );

  if (!course) return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <div className="cp-center">
          <div className="cp-error-icon">⚠️</div>
          <span className="cp-error-msg">Course nahi mila!</span>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard par jao
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">

        {/* ── Nav ── */}
        <nav className="cp-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="nav-brand-name">EduPortal</span>
          </div>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
        </nav>

        {/* ── Hero ── */}
        <div className="cp-hero">
          <div className="hero-breadcrumb">
            <span onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span className="hero-breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{course.name}</span>
          </div>
          <h1 className="hero-title">{course.name}</h1>
          <p className="hero-desc">
            {course.description || 'Is course ke sabhi subjects neeche available hain. Ek subject chunkar apni preparation shuru karein.'}
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">{subjects.length}</span>
              <span className="hero-stat-label">Subjects</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">∞</span>
              <span className="hero-stat-label">Practice Tests</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">Free</span>
              <span className="hero-stat-label">Access</span>
            </div>
          </div>
        </div>

        {/* ── Trust Strip ── */}
        <div className="trust-strip">
          <div className="trust-item"><div className="trust-dot" />Expert-Verified Content</div>
          <div className="trust-item"><div className="trust-dot" />Syllabus Aligned</div>
          <div className="trust-item"><div className="trust-dot" />Progress Tracked</div>
          <div className="trust-item"><div className="trust-dot" />24/7 Available</div>
        </div>

        {/* ── Body ── */}
        <main className="cp-body">
          <div className="section-header">
            <h2 className="section-title">Choose a Subject</h2>
            {subjects.length > 0 && (
              <span className="section-count">{subjects.length} subjects</span>
            )}
          </div>

          <div className="subject-grid">
            {subjects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <div className="empty-title">Koi subject available nahi hai</div>
                <div className="empty-sub">Admin jald hi subjects add karega. Thodi der baad wapas aayein.</div>
              </div>
            ) : (
              subjects.map((subject, idx) => (
                <div
                  key={subject._id}
                  className="subject-card card-stagger"
                  style={{ animationDelay: `${0.04 + idx * 0.06}s` }}
                  onClick={() => navigate(`/subject/${subject._id}`)}
                >
                  <div className="subject-icon-wrap">
                    {getSubjectIcon(subject.name)}
                  </div>
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-desc">
                    {subject.description || 'Is subject ke tests aur practice material available hain.'}
                  </p>
                  <div className="subject-footer">
                    <span className="subject-cta">
                      Explore Subject
                      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                    <div className="subject-arrow">
                      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CoursePage;