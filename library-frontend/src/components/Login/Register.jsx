import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reuse login styles

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'student', specialCode: '' });
  const [loading, setLoading] = useState(false); // ⏳ loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loader

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false); // hide loader after response
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
        <h2>Register Account</h2>

        {loading && <div className="spinner"></div>} {/* spinner when loading */}

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={form.username}
            disabled={loading}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={form.password}
            disabled={loading}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            value={form.role}
            disabled={loading}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {form.role === 'admin' && (
          <div className="form-group">
            <label>Special Code:</label>
            <input
              type="password"
              value={form.specialCode}
              disabled={loading}
              onChange={(e) => setForm({ ...form, specialCode: e.target.value })}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}

export default Register;
