import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL;

function StudentDashboard() {
  const [booksBorrowed, setBooksBorrowed] = useState(0);
  const [nextDueDate, setNextDueDate] = useState('Loading...');
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = localStorage.getItem('user_id'); // Set at login

  useEffect(() => {
    // Fetch student dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard/student/${userId}`);
        setBooksBorrowed(res.data.booksIssued);
        setNextDueDate(res.data.nextDueDate || 'No active books');
      } catch (err) {
        console.error('❌ Failed to fetch dashboard stats:', err);
      }
    };

    // Fetch student profile
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
    };

    if (userId) {
      fetchDashboardStats();
      fetchProfile();
    }
  }, [userId]);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-header">
          <div className="nav-title">
            <h1>Student Dashboard</h1>
          </div>
          <div className="nav-right">
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div className="user-info">
              <img
                src={
                  profile?.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
                }
                alt={profile?.name || 'Avatar'}
                className="user-avatar"
              />
              <div className="user-details">
                <h3>{profile?.name || 'Student'}</h3>
                <p>{profile?.role || 'Student'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/books"><span className="nav-icon">📚</span>Browse Books</Link>
          <Link to="/issued-books"><span className="nav-icon">📖</span>My Books</Link>
          <Link to="/profile"><span className="nav-icon">👤</span>Profile</Link>
          <Link to="/login"><span className="nav-icon">🚪</span>Logout</Link>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, {profile?.name || 'Student'}!</h2>
            <p>
              Discover new books, manage your borrowed titles, and explore our
              extensive library collection. Happy reading!
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Books Borrowed</h3>
              <span className="stat-icon">📖</span>
            </div>
            <div className="stat-value">{booksBorrowed}</div>
            <p className="stat-label">Currently Reading</p>
            <div className="stat-trend">
              <span>📚</span>
              Keep reading!
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Next Due Date</h3>
              <span className="stat-icon">📅</span>
            </div>
            <div
              className="stat-value"
              style={{ marginTop: '40px', fontSize: '2rem' }}
            >
              {nextDueDate}
            </div>
            <p className="stat-label">Upcoming Return</p>
            <div className="stat-trend">
              <span>⏰</span>
              Don't forget!
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>
            <span className="section-icon">⚡</span>
            Quick Actions
          </h3>
          <div className="actions-grid">
            <Link to="/books" className="action-card">
              <span className="action-icon">🔍</span>
              <div className="action-content">
                <h4>Browse Books</h4>
                <p>Explore our extensive collection of books</p>
              </div>
            </Link>
            <Link to="/issued-books" className="action-card">
              <span className="action-icon">📚</span>
              <div className="action-content">
                <h4>My Library</h4>
                <p>View your borrowed books and due dates</p>
              </div>
            </Link>
            <Link to="/profile" className="action-card">
              <span className="action-icon">👤</span>
              <div className="action-content">
                <h4>Update Profile</h4>
                <p>Manage your personal information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
