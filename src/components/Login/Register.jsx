import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse login styles

function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'student', specialCode: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/register', {
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
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register Account</h2>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            value={form.role}
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
              onChange={(e) => setForm({ ...form, specialCode: e.target.value })}
              required
            />
          </div>
        )}

        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
}

export default Register;
