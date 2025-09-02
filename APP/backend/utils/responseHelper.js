/**
 * Response Helper Utility Class
 * Provides standardized response methods for consistent API responses across the application.
 * All methods return properly formatted JSON responses with appropriate HTTP status codes.
 */

/**
 * ResponseHelper class
 * Contains static methods for creating standardized HTTP responses
 */
class ResponseHelper {
    
    /**
     * Creates a successful response
     * @param {Object} res - Express response object
     * @param {*} data - Data to be returned in the response
     * @param {string} message - Success message (default: 'Operation successful')
     * @param {number} statusCode - HTTP status code (default: 200)
     * @returns {Object} JSON response with success status
     */
    static success(res, data, message = 'Operation successful', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Creates an error response
     * @param {Object} res - Express response object
     * @param {string} message - Error message (default: 'Internal server error')
     * @param {number} statusCode - HTTP status code (default: 500)
     * @param {Array} errors - Array of detailed error messages (optional)
     * @returns {Object} JSON response with error status
     */
    static error(res, message = 'Internal server error', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    /**
     * Creates a validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - Array of validation error messages
     * @returns {Object} JSON response with 400 status and validation errors
     */
    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors
        });
    }

    /**
     * Creates a not found error response
     * @param {Object} res - Express response object
     * @param {string} message - Not found message (default: 'Resource not found')
     * @returns {Object} JSON response with 404 status
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    /**
     * Creates an unauthorized error response
     * @param {Object} res - Express response object
     * @param {string} message - Unauthorized message (default: 'Unauthorized')
     * @returns {Object} JSON response with 401 status
     */
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    /**
     * Creates a forbidden error response
     * @param {Object} res - Express response object
     * @param {string} message - Forbidden message (default: 'Access denied')
     * @returns {Object} JSON response with 403 status
     */
    static forbidden(res, message = 'Access denied') {
        return res.status(403).json({
            success: false,
            message
        });
    }
}

// Export the ResponseHelper class for use throughout the application
export default ResponseHelper;