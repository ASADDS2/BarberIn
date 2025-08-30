class ResponseHelper {
    static success(res, data, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Error interno del servidor', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors
        });
    }

    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    static forbidden(res, message = 'Acceso denegado') {
        return res.status(403).json({
            success: false,
            message
        });
    }
}

export default ResponseHelper;