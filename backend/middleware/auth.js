import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header and correct Bearer token format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from decoded token, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token or invalid header format
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

// Usage: Authorization: Bearer <token>