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

      // Find user by ID from decoded token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};