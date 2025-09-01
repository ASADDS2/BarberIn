/**
 * Validation Middleware
 * This middleware provides validation functions for different types of data
 * before processing requests. It ensures data integrity and provides clear
 * error messages for invalid data.
 */

const Validators = require('../utils/validators');
const ResponseHelper = require('../utils/responseHelper');

/**
 * ValidationMiddleware class
 * Contains static methods for validating different types of request data
 */
class ValidationMiddleware {
    
    /**
     * Validates appointment creation/update requests
     * Ensures all required fields are present and valid
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static validateAppointment(req, res, next) {
        const { barber_id, barbershop_id, appointment_date, appointment_time } = req.body;
        const errors = [];

        // Validate barber ID (must be present and numeric)
        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('Barber ID required and must be numeric');
        }
        
        // Validate barbershop ID (must be present and numeric)
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('Barbershop ID required and must be numeric');
        }
        
        // Validate appointment date (must be valid and not in the past)
        if (!Validators.isValidDate(appointment_date)) {
            errors.push('Invalid appointment date or date in the past');
        }
        
        // Validate appointment time (must be in HH:MM format)
        if (!Validators.isValidTime(appointment_time)) {
            errors.push('Invalid appointment time (HH:MM format)');
        }

        // If there are validation errors, return them and stop processing
        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        
        // If validation passes, continue to the next middleware/controller
        next();
    }

    /**
     * Validates service creation/update requests
     * Ensures service data meets business requirements
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static validateService(req, res, next) {
        const { name, price, duration_minutes } = req.body;
        const errors = [];

        // Validate service name (minimum 3 characters)
        if (!name || name.length < 3) {
            errors.push('Service name required (minimum 3 characters)');
        }
        
        // Validate price (must be present and positive)
        if (!price || price < 0) {
            errors.push('Price required and must be greater than 0');
        }
        
        // Validate duration (minimum 15 minutes)
        if (!duration_minutes || duration_minutes < 15) {
            errors.push('Duration required and must be at least 15 minutes');
        }

        // If there are validation errors, return them and stop processing
        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        
        // If validation passes, continue to the next middleware/controller
        next();
    }

    /**
     * Validates review creation requests
     * Ensures review data is complete and valid
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static validateReview(req, res, next) {
        const { appointment_id, barber_id, barbershop_id, rating } = req.body;
        const errors = [];

        // Validate appointment ID (must be present and numeric)
        if (!appointment_id || !Number.isInteger(parseInt(appointment_id))) {
            errors.push('Appointment ID required');
        }
        
        // Validate barber ID (must be present and numeric)
        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('Barber ID required');
        }
        
        // Validate barbershop ID (must be present and numeric)
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('Barbershop ID required');
        }
        
        // Validate rating (must be between 1 and 5)
        if (!Validators.isValidRating(parseInt(rating))) {
            errors.push('Rating must be a number between 1 and 5');
        }

        // If there are validation errors, return them and stop processing
        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        
        // If validation passes, continue to the next middleware/controller
        next();
    }
}

// Export the ValidationMiddleware class
export default ValidationMiddleware;