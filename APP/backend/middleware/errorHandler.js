import ResponseHelper from '../utils/responseHelper.js';

function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return ResponseHelper.error(res, 'Record already exists', 409);
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return ResponseHelper.error(res, 'Invalid data reference', 400);
    }

    if (err.code === 'ECONNREFUSED') {
        return ResponseHelper.error(res, 'Database connection error', 503);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ResponseHelper.unauthorized(res, 'Invalid token');
    }
    
    if (err.name === 'TokenExpiredError') {
        return ResponseHelper.unauthorized(res, 'Token has expired');
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return ResponseHelper.validationError(res, [err.message]);
    }

    // Default error
    ResponseHelper.error(res, 'Internal server error');
}

export default errorHandler;
