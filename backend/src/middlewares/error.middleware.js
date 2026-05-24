export function createHttpError(message, statusCode = 500, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

export function notFoundMiddleware(req, res) {
  res.status(404).json({
    error: true,
    message: 'Route not found',
    details: `${req.method} ${req.originalUrl}`
  });
}

export function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message: err.message || 'Unexpected server error',
    ...(err.details ? { details: err.details } : {})
  });
}
