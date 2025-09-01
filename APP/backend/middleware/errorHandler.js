/**
 * Global Error Handler Middleware
 * This middleware catches all errors thrown in the application and provides
 * appropriate HTTP status codes and error messages based on the error type.
 */

import ResponseHelper from '../utils/responseHelper.js';

/**
 * Global error handler function
 * @param {Error} err - The error object thrown in the application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
    // Log the error stack trace for debugging purposes
    console.error(err.stack);

    // Handle MySQL database errors
    if (err.code === 'ER_DUP_ENTRY') {
        // Duplicate entry error (e.g., trying to insert a record that already exists)
        return ResponseHelper.error(res, 'Record already exists', 409);
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        // Foreign key constraint error (referenced record doesn't exist)
        return ResponseHelper.error(res, 'Invalid data reference', 400);
    }

    if (err.code === 'ECONNREFUSED') {
        // Database connection refused error
        return ResponseHelper.error(res, 'Database connection error', 503);
    }

    // Handle JWT (JSON Web Token) authentication errors
    if (err.name === 'JsonWebTokenError') {
        // Invalid token format or signature
        return ResponseHelper.unauthorized(res, 'Invalid token');
    }
    
    if (err.name === 'TokenExpiredError') {
        // Token has expired
        return ResponseHelper.unauthorized(res, 'Token has expired');
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        // Data validation failed
        return ResponseHelper.validationError(res, [err.message]);
    }

    // Default error handler for any unhandled errors
    // Returns a generic server error message
    ResponseHelper.error(res, 'Internal server error');
}

// Export the error handler middleware
export default errorHandler;
