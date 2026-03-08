const jwt = require('jsonwebtoken');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  // Check for session-based auth first
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Check for localStorage-based auth (for API calls)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  // Check for user email in localStorage (fallback for frontend)
  const userEmail = req.headers['x-user-email'];
  if (userEmail) {
    // Verify user exists and is verified
    const db = require('../db');
    db.query('SELECT * FROM users WHERE email = ? AND isVerified = true', [userEmail], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      req.user = results[0];
      return next();
    });
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ message: 'Email verification required' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireVerified
};