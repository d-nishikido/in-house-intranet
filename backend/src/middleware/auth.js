const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  console.warn('Warning: Using default JWT secret in development mode');
  return 'dev-secret-key-change-in-production';
})();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Middleware to check if user exists in database
const verifyUser = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, department, organization_id, position, extension FROM employees WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = { ...req.user, ...result.rows[0] };
    next();
  } catch (error) {
    console.error('User verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Combined middleware for full authentication
const authenticate = [authenticateToken, verifyUser];

module.exports = {
  authenticateToken,
  verifyUser,
  authenticate
};