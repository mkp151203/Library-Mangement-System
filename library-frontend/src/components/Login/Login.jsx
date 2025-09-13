import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ icon
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDummyCreds, setShowDummyCreds] = useState(false); // New state to control dialog visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        localStorage.setItem('token', data.token);
        navigate(`/${data.role}`);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
        <h2>Library Management System</h2>

        {loading && <div className="spinner"></div>}

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            disabled={loading}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group password-group">
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            disabled={loading}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />

          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
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



        {/* New button to show dummy credentials */}
        <button
          type="button"
          className="show-creds-btn"
          onClick={() => setShowDummyCreds(true)}
        >
          Show Demo Accounts
        </button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>

      {/* Dummy credentials dialog box */}
      {showDummyCreds && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Demo Login Credentials</h3>
            <p>
              <strong>Student:</strong>
              <br />
              Username: <code>student</code>
              <br />
              Password: <code>student123</code>
            </p>
            <p>
              <strong>Admin:</strong>
              <br />
              Username: <code>admin</code>
              <br />
              Password: <code>admin123</code>
            </p>
            <p>
              <br />
              Special Code For New Admin :<code>password123</code>
            </p>
            <button className="close-btn" onClick={() => setShowDummyCreds(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;