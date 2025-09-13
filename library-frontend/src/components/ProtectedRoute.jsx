import { Navigate } from "react-router-dom";
import { isTokenExpired } from '../utils/auth.js';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || isTokenExpired()) {
    localStorage.clear(); // clear expired token
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
