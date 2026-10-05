const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose CastError (Invalid Object ID)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field} already exists. Please use a different value.`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation Error', errors);
  }

  // Handle Multer File Upload Errors
  if (err.name === 'MulterError') {
    error = new ApiError(400, `File Upload Error: ${err.message}`);
  }

  // Handle JWT Invalid Token
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid Token. Authentication failed.');
  }

  // Handle JWT Expired Token
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please log in again.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[Error Handler] ${req.method} ${req.url} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development' && !error.statusCode) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
