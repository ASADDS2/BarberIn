const ResponseHelper = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return ResponseHelper.error(res, 'El registro ya existe', 409);
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return ResponseHelper.error(res, 'Referencia inválida en los datos', 400);
    }

    if (err.code === 'ECONNREFUSED') {
        return ResponseHelper.error(res, 'Error de conexión a la base de datos', 503);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ResponseHelper.unauthorized(res, 'Token inválido');
    }
    
    if (err.name === 'TokenExpiredError') {
        return ResponseHelper.unauthorized(res, 'Token expirado');
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return ResponseHelper.validationError(res, [err.message]);
    }

    // Default error
    ResponseHelper.error(res, 'Error interno del servidor');
};

module.exports = errorHandler;