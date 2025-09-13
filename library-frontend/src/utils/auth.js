import { jwtDecode } from 'jwt-decode'; // if the module exports it this way


export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token); // exp is in seconds
    return Date.now() >= exp * 1000; // convert to ms
  } catch {
    return true; // invalid token
  }
};
