import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
const API_URL = import.meta.env.VITE_API_URL;
function StudentDashboard() {
  const [booksBorrowed, setBooksBorrowed] = useState(0);
  const [nextDueDate, setNextDueDate] = useState('Loading...');
  const userId = localStorage.getItem('user_id'); // Make sure this is set at login

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard/student/${userId}`);
        setBooksBorrowed(res.data.booksIssued);
        setNextDueDate(res.data.nextDueDate || 'No active books');
      } catch (err) {
        console.error('❌ Failed to fetch dashboard stats:', err);
      }
    };

    fetchDashboardStats();
  }, [userId]);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Student Dashboard</h1>
        <div className="nav-links">
          <Link to="/books">View Books</Link>
          <Link to="/issued-books">My Books</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome, Student!</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Books Borrowed</h3>
            <p>{booksBorrowed}</p>
          </div>
          <div className="stat-card">
            <h3>Next Due Date</h3>
            <p>{nextDueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
