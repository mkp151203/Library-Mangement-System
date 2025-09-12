import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ icons
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    role: 'student', 
    specialCode: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
        <h2>Register Account</h2>
        {loading && <div className="spinner"></div>}

        {/* Username */}
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

        {/* Password */}
        <div className="form-group password-group">
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            disabled={loading}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <span 
            className="toggle-eye" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="form-group password-group">
          <label>Confirm Password:</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            disabled={loading}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
          <span 
            className="toggle-eye" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Role */}
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

        {/* Special Code (only for admin) */}
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
