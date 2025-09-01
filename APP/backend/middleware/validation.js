const Validators = require('../utils/validators');
const ResponseHelper = require('../utils/responseHelper');

class ValidationMiddleware {
    static validateAppointment(req, res, next) {
        const { barber_id, barbershop_id, appointment_date, appointment_time } = req.body;
        const errors = [];

        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('Barber ID required and must be numeric');
        }
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('Barbershop ID required and must be numeric');
        }
        if (!Validators.isValidDate(appointment_date)) {
            errors.push('Invalid appointment date or date in the past');
        }
        if (!Validators.isValidTime(appointment_time)) {
            errors.push('Invalid appointment time (HH:MM format)');
        }

        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        next();
    }

    static validateService(req, res, next) {
        const { name, price, duration_minutes } = req.body;
        const errors = [];

        if (!name || name.length < 3) {
            errors.push('Service name required (minimum 3 characters)');
        }
        if (!price || price < 0) {
            errors.push('Price required and must be greater than 0');
        }
        if (!duration_minutes || duration_minutes < 15) {
            errors.push('Duration required and must be at least 15 minutes');
        }

        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        next();
    }

    static validateReview(req, res, next) {
        const { appointment_id, barber_id, barbershop_id, rating } = req.body;
        const errors = [];

        if (!appointment_id || !Number.isInteger(parseInt(appointment_id))) {
            errors.push('Appointment ID required');
        }
        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('Barber ID required');
        }
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('Barbershop ID required');
        }
        if (!Validators.isValidRating(parseInt(rating))) {
            errors.push('Rating must be a number between 1 and 5');
        }

        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        next();
    }
}

export default ValidationMiddleware;