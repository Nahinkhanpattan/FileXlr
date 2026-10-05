const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - Allows FRONTEND_URL from environment
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'fileXlr Metadata Analyzer',
    timestamp: new Date().toISOString(),
    frontendAllowed: frontendUrl,
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/metadata', require('./routes/metadataRoutes'));

// 404 Route Handler for undefined routes
app.use('*', (req, res, next) => {
  const ApiError = require('./utils/ApiError');
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 fileXlr Backend Server running on port ${PORT}`);
  console.log(`🔗 Allowed Frontend URL: ${frontendUrl}`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection Warning] ${err.message}`);
});
