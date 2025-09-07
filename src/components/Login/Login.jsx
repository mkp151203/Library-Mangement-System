import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Store role and optionally username or ID
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username); // optional
        localStorage.setItem('user_id', data.id);        // optional
      
        // ✅ Log role, username, and id
        console.log("Logged in as:");
        console.log("Role:", data.role);
        console.log("Username:", data.username);
        console.log("User ID:", data.id);
      
        alert("Login successful!");
      
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
        
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Library Management System</h2>
        
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={credentials.role}
            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </form>
      

    </div>
  );
}

export default Login;
