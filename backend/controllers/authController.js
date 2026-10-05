const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Helper to check DB connection
const isDbConnected = () => User.db && User.db.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide name, email, and password'));
    }

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return next(new ApiError(400, 'User with this email already exists'));
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      const token = user.getSignedJwtToken();

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // In-memory / DB fallback mode
      const mockToken = 'mock_jwt_token_' + Date.now();
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (In-Memory Mode)',
        token: mockToken,
        user: {
          id: 'user_' + Date.now(),
          name,
          email,
          role: 'user',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return next(new ApiError(401, 'Invalid email or password'));
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ApiError(401, 'Invalid email or password'));
      }

      const token = user.getSignedJwtToken();

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // In-memory fallback mode
      const mockToken = 'mock_jwt_token_' + Date.now();
      return res.status(200).json({
        success: true,
        message: 'Login successful (In-Memory Mode)',
        token: mockToken,
        user: {
          id: 'user_demo_123',
          name: email.split('@')[0] || 'Demo User',
          email,
          role: 'user',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, 'User not found or unauthenticated'));
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
