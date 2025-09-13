import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header received:', authHeader); // <-- log incoming header

  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Token successfully verified, payload:', user); // <-- log decoded payload
    req.user = user; // decoded payload: id, username, role
    next();
  });
}
