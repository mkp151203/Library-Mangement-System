import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import Books from './components/Books/Books';
import IssueBook from './components/Books/IssueBook';
import ReturnBook from './components/Books/ReturnBook';
import IssuedBooks from './components/Books/IssuedBooks';
import UserProfile from './components/Profile/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issue-book"
            element={
              <ProtectedRoute role="admin">
                <IssueBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/return-book"
            element={
              <ProtectedRoute role="admin">
                <ReturnBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issued-books"
            element={
              <ProtectedRoute >
                <IssuedBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
