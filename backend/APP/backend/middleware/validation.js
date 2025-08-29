const Validators = require('../utils/validators');
const ResponseHelper = require('../utils/responseHelper');

class ValidationMiddleware {
    static validateAppointment(req, res, next) {
        const { barber_id, barbershop_id, appointment_date, appointment_time } = req.body;
        const errors = [];

        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('ID de barbero requerido y debe ser numérico');
        }
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('ID de barbería requerido y debe ser numérico');
        }
        if (!Validators.isValidDate(appointment_date)) {
            errors.push('Fecha de cita inválida o en el pasado');
        }
        if (!Validators.isValidTime(appointment_time)) {
            errors.push('Hora de cita inválida (formato HH:MM)');
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
            errors.push('Nombre de servicio requerido (mínimo 3 caracteres)');
        }
        if (!price || price < 0) {
            errors.push('Precio requerido y debe ser mayor a 0');
        }
        if (!duration_minutes || duration_minutes < 15) {
            errors.push('Duración requerida y debe ser al menos 15 minutos');
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
            errors.push('ID de cita requerido');
        }
        if (!barber_id || !Number.isInteger(parseInt(barber_id))) {
            errors.push('ID de barbero requerido');
        }
        if (!barbershop_id || !Number.isInteger(parseInt(barbershop_id))) {
            errors.push('ID de barbería requerido');
        }
        if (!Validators.isValidRating(parseInt(rating))) {
            errors.push('Calificación debe ser un número entre 1 y 5');
        }

        if (errors.length > 0) {
            return ResponseHelper.validationError(res, errors);
        }
        next();
    }
}

module.exports = ValidationMiddleware;