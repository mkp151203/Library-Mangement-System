import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    fetch('http://localhost:5000/dashboard/recent-activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error('Error fetching activities:', err));
  }, []);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Admin Dashboard</h1>
        <div className="nav-links">
          <Link to="/books">Manage Books</Link>
          <Link to="/issue-book">Issue Book</Link>
          <Link to="/return-book">Return Book</Link>
          <Link to="/issued-books">View Issued Books</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Welcome, Admin!</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p>{stats.totalBooks ?? '...'}</p>
            <span className="stat-label">In Collection</span>
          </div>
          <div className="stat-card">
            <h3>Books Issued</h3>
            <p>{stats.booksIssued ?? '...'}</p>
            <span className="stat-label">Currently Borrowed</span>
          </div>
          <div className="stat-card">
            <h3>Active Students</h3>
            <p>{stats.activeStudents ?? '...'}</p>
            <span className="stat-label">Registered Users</span>
          </div>
          <div className="stat-card">
            <h3>Overdue Books</h3>
            <p>{stats.overdueBooks ?? '...'}</p>
            <span className="stat-label">Need Attention</span>
          </div>
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
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
                  <p className="activity-meta">
                    {activity.student && `Student: ${activity.student}`} <br />
                    <span className="activity-date">{activity.date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
