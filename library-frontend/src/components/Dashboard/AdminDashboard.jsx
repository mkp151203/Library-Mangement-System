import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
const API_URL = import.meta.env.VITE_API_URL;
function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/dashboard/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    fetch(`${API_URL}/dashboard/recent-activities`)
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error('Error fetching activities:', err));
  }, []);
const username = localStorage.getItem('username') || 'Admin';
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-header">
          <div className="nav-title">
            
            <h1>Admin Dashboard</h1>
          </div>
          <div className="user-info">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" 
              alt="Admin Avatar" 
              className="user-avatar"
            />
            <div className="user-details">
              <h3>{username}</h3>
              <p>Administrator</p>
            </div>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/books">
            <span className="nav-icon">📚</span>
            Manage Books
          </Link>
          <Link to="/issue-book">
            <span className="nav-icon">📖</span>
            Issue Book
          </Link>
          <Link to="/return-book">
            <span className="nav-icon">↩️</span>
            Return Book
          </Link>
          <Link to="/issued-books">
            <span className="nav-icon">📋</span>
            View Issued Books
          </Link>
          <Link to="/profile">
            <span className="nav-icon">👤</span>
            Profile
          </Link>
          <Link to="/login">
            <span className="nav-icon">🚪</span>
            Logout
          </Link>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, {username}!</h2>
            <p>Manage your library efficiently with our comprehensive dashboard. Monitor books, track issues, and oversee all library operations.</p>
          </div>
          
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Books</h3>
              <span className="stat-icon">📚</span>
            </div>
            <div className="stat-value">{stats.totalBooks ?? '...'}</div>
            <p className="stat-label">In Collection</p>
            
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Books Issued</h3>
              <span className="stat-icon">📖</span>
            </div>
            <div className="stat-value">{stats.booksIssued ?? '...'}</div>
            <p className="stat-label">Currently Borrowed</p>
            
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Active Students</h3>
              <span className="stat-icon">👥</span>
            </div>
            <div className="stat-value">{stats.activeStudents ?? '...'}</div>
            <p className="stat-label">Registered Users</p>
           
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Overdue Books</h3>
              <span className="stat-icon">⚠️</span>
            </div>
            <div className="stat-value">{stats.overdueBooks ?? '...'}</div>
            <p className="stat-label">Need Attention</p>
            
          </div>
        </div>

        

        <div className="recent-activities">
          <h3>
            <span className="section-icon">📊</span>
            Recent Activities
          </h3>
          <div className="activities-container">
            {activities.length > 0 ? (
              <div className="activities-list">
                {activities.map(activity => (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-icon">
                      {activity.action === 'Book returned' ? '📚' :
                       activity.action === 'Book issued' ? '📖' : '➕'}
                    </div>
                    <div className="activity-details">
                      <h4>{activity.action}</h4>
                      <p>{activity.book}</p>
                      <div className="activity-meta">
                        {activity.student && <span>Student: {activity.student}</span>}
                        <span className="activity-date">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activities">
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200" 
                  alt="No Activities" 
                />
                <h4>No Recent Activities</h4>
                <p>Library activities will appear here as they happen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;