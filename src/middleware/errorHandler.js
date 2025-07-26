// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      message: 'Validation Error',
      errors: message,
      statusCode: 400
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      message: `${field} zaten kullanılıyor`,
      statusCode: 409
    };
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = {
      message: 'Geçersiz ID formatı',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Geçersiz token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token süresi dolmuş',
      statusCode: 401
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Sunucu hatası';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.errors && { errors: error.errors })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} bulunamadı`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
}; 