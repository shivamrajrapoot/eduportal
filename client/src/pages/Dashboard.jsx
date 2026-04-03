// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; }

  .dash-root {
    min-height: 100vh;
    background: #f5f7fc;
    font-family: 'DM Sans', sans-serif;
    color: #1a1f36;
  }

  /* ── Top Nav ── */
  .dash-nav {
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
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #1a4fa0 0%, #2d6ed4 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-brand-icon svg {
    width: 18px;
    height: 18px;
    fill: #fff;
  }

  .nav-brand-name {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: #1a1f36;
    letter-spacing: -0.3px;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-avatar {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #1a4fa0, #4a80d4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }

  .nav-user-info {
    text-align: right;
  }

  .nav-user-name {
    font-size: 13px;
    font-weight: 500;
    color: #1a1f36;
    line-height: 1.3;
  }

  .nav-user-email {
    font-size: 11px;
    color: #8a92a6;
    line-height: 1.3;
  }

  .btn-logout {
    padding: 7px 16px;
    background: transparent;
    color: #e53e3e;
    border: 1.5px solid #fecaca;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background: #fff5f5;
    border-color: #fc8181;
  }

  /* ── Hero Banner ── */
  .dash-hero {
    background: linear-gradient(120deg, #1a4fa0 0%, #1e63c9 60%, #2d7adf 100%);
    padding: 40px 40px 36px;
    position: relative;
    overflow: hidden;
  }

  .dash-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -60px;
    width: 320px; height: 320px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .dash-hero::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 30%;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .hero-greeting {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 6px;
    letter-spacing: -0.5px;
  }

  .hero-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    margin: 0 0 24px;
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
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    
    gap: 5px;
    font-size: 16px;
    color: #3a5fa8;
    font-weight: 500;
  }

  .trust-dot {
    width: 5px; height: 5px;
    background: #3a5fa8;
    border-radius: 50%;
  }

  /* ── Main Body ── */
  .dash-body {
    max-width: 1140px;
    margin: 0 auto;
    padding: 32px 40px 60px;
  }

  /* ── Section Header ── */
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

  .section-count {
    font-size: 12px;
    color: #8a92a6;
    background: #edf0f7;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Course Grid ── */
  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .course-card {
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 16px;
    padding: 22px;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  .course-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a4fa0, #4a88e8);
    opacity: 0;
    transition: opacity 0.22s;
  }

  .course-card:hover {
    border-color: #b8ccf0;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(26, 79, 160, 0.1);
  }

  .course-card:hover::before {
    opacity: 1;
  }

  .course-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #eef3fc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    font-size: 20px;
  }

  .course-card-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #1a1f36;
    margin: 0 0 7px;
    letter-spacing: -0.2px;
    line-height: 1.35;
  }

  .course-card-desc {
    font-size: 13px;
    color: #6b7592;
    margin: 0 0 16px;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .course-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .course-badge {
    font-size: 11px;
    font-weight: 600;
    color: #1a4fa0;
    background: #eef3fc;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.02em;
  }

  .course-arrow {
    width: 28px; height: 28px;
    background: #1a4fa0;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }

  .course-card:hover .course-arrow {
    background: #1550b0;
  }

  .course-arrow svg {
    width: 13px; height: 13px;
    fill: #fff;
  }

  /* ── Loading Skeleton ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Empty State ── */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #8a92a6;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #4a5270;
    margin: 0 0 6px;
  }

  .empty-sub {
    font-size: 13px;
    color: #8a92a6;
  }

  /* ── Animations ── */
  .fade-in {
    animation: fadeIn 0.4s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-stagger:nth-child(1) { animation-delay: 0.05s; }
  .card-stagger:nth-child(2) { animation-delay: 0.1s; }
  .card-stagger:nth-child(3) { animation-delay: 0.15s; }
  .card-stagger:nth-child(4) { animation-delay: 0.2s; }
  .card-stagger:nth-child(5) { animation-delay: 0.25s; }
  .card-stagger:nth-child(6) { animation-delay: 0.3s; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .dash-nav { padding: 0 20px; }
    .dash-hero { padding: 28px 20px 24px; }
    .trust-strip { padding: 9px 20px; }
    .dash-body { padding: 24px 20px 48px; }
    .nav-user-info { display: none; }
    .hero-title { font-size: 20px; }
  }
`;

// Course icons based on keywords
const getCourseIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('math') || n.includes('ganit')) return '📐';
  if (n.includes('physics') || n.includes('bhautik')) return '⚛️';
  if (n.includes('chemistry') || n.includes('rasayan')) return '🧪';
  if (n.includes('biology') || n.includes('jeev')) return '🧬';
  if (n.includes('english') || n.includes('angrezi')) return '📝';
  if (n.includes('hindi')) return '📖';
  if (n.includes('computer') || n.includes('code')) return '💻';
  if (n.includes('history') || n.includes('itihas')) return '🏛️';
  if (n.includes('geo') || n.includes('bhugol')) return '🌍';
  return '📚';
};

const getInitials = (name = '') => {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'U';
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-line" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '14px' }} />
    <div className="skeleton-line" style={{ width: '70%', height: '16px' }} />
    <div className="skeleton-line" style={{ width: '90%', height: '13px' }} />
    <div className="skeleton-line" style={{ width: '60%', height: '13px', marginBottom: '16px' }} />
    <div className="skeleton-line" style={{ width: '40%', height: '24px', borderRadius: '20px' }} />
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get('/courses/all');
        setCourses(res.data.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">

        {/* ── Nav ── */}
        <nav className="dash-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="nav-brand-name">EduPortal</span>
          </div>
          <div className="nav-right">
            <div className="nav-user-info">
              <div className="nav-user-name">{user?.name}</div>
              <div className="nav-user-email">{user?.email}</div>
            </div>
            <div className="nav-avatar">{getInitials(user?.name)}</div>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="dash-hero">
          <div className="hero-greeting">Student Dashboard</div>
          <h1 className="hero-title">Namaskar, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="hero-subtitle">Khud ko aage badhne se mat roko!</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">{courses.length}</span>
              <span className="hero-stat-label">Courses Available</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">0</span>
              <span className="hero-stat-label">Completed</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">∞</span>
              <span className="hero-stat-label">Learning Ahead</span>
            </div>
          </div>
        </div>

        {/* ── Trust Strip ── */}
        <div className="trust-strip">
          <div className="trust-item"><div className="trust-dot" />Design With Love For Your Practice</div>
        </div>

        {/* ── Body ── */}
        <main className="dash-body">
          <div className="section-header">
            <h2 className="section-title">Available Courses</h2>
            {!loading && (
              <span className="section-count">{courses.length} courses</span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && courses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">Abhi koi course available nahi hai</div>
              <div className="empty-sub">Admin jald hi naye courses add karega. Please baad mein check karein.</div>
            </div>
          )}

          {/* Course cards */}
          {!loading && courses.length > 0 && (
            <div className="course-grid">
              {courses.map((course, idx) => (
                <div
                  key={course._id}
                  className="course-card fade-in card-stagger"
                  style={{ opacity: 0, animationFillMode: 'forwards' }}
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <div className="course-card-icon">
                    {getCourseIcon(course.name)}
                  </div>
                  <h3 className="course-card-name">{course.name}</h3>
                  <p className="course-card-desc">
                    {course.description || 'Is course ke bare mein details jald hi available hongi.'}
                  </p>
                  <div className="course-card-footer">
                    <span className="course-badge">Start Learning</span>
                    <div className="course-arrow">
                      <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;