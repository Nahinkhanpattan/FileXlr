const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route. Please provide a token.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in DB (if DB available)
    if (User.db && User.db.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    }
    
    // Fallback if DB isn't connected or user object populated
    if (!req.user) {
      req.user = { id: decoded.id, role: decoded.role || 'user' };
    }

    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route. Token verification failed.'));
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role || 'user' };
    } catch (err) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
