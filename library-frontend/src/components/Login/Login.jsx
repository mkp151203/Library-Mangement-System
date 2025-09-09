import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false); // ⏳ login loader
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loader when login starts

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_id', data.id);

        navigate(`/${data.role}`);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false); // hide loader after response
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
        <h2>Library Management System</h2>

        {loading && <div className="spinner"></div>} {/* show loader on login */}

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            disabled={loading}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            disabled={loading}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={credentials.role}
            disabled={loading}
            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}

export default Login;
