import BarbershopService from '../services/barbershopService.js'; // Incluye la extensión .js
import Validators from '../utils/validators.js';
import ResponseHelper from '../utils/responseHelper.js';


class BarbershopController {
    static async register(req, res) {
        try {
            const { 
                name, email, phone, password, address, latitude, longitude,
                responsible_person, id_document, owner_phone, description
            } = req.body;
            
            // Validaciones
            const errors = [];
            if (!name || name.length < 3) errors.push('Nombre de barbería requerido (mínimo 3 caracteres)');
            if (!Validators.isValidEmail(email)) errors.push('Email inválido');
            if (!Validators.isValidPhone(phone)) errors.push('Teléfono inválido');
            if (!Validators.isValidPassword(password)) errors.push('Contraseña debe tener al menos 6 caracteres');
            if (!address || address.length < 10) errors.push('Dirección requerida (mínimo 10 caracteres)');
            if (!responsible_person || responsible_person.length < 5) errors.push('Persona responsable requerida');
            if (!id_document || id_document.length < 6) errors.push('Documento de identidad requerido');
            if (latitude && (latitude < -90 || latitude > 90)) errors.push('Latitud inválida');
            if (longitude && (longitude < -180 || longitude > 180)) errors.push('Longitud inválida');
            
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            const barbershopService = new BarbershopService(req.db);
            const barbershopData = {
                name: Validators.sanitizeString(name),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                password,
                address: Validators.sanitizeString(address),
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                responsible_person: Validators.sanitizeString(responsible_person),
                id_document: id_document.trim(),
                owner_phone: owner_phone?.trim(),
                description: description ? Validators.sanitizeString(description) : null
            };

            const barbershop = await barbershopService.createBarbershop(barbershopData);
            ResponseHelper.success(res, barbershop, 'Barbería registrada exitosamente', 201);
        } catch (error) {
            if (error.message.includes('ya existe')) {
                return ResponseHelper.error(res, error.message, 409);
            }
            ResponseHelper.error(res, error.message);
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return ResponseHelper.validationError(res, ['Email y contraseña son requeridos']);
            }

            const barbershopService = new BarbershopService(req.db);
            const result = await barbershopService.loginBarbershop(email.toLowerCase().trim(), password);
            ResponseHelper.success(res, result, 'Login exitoso');
        } catch (error) {
            ResponseHelper.error(res, error.message, 401);
        }
    }

    static async getAll(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const { latitude, longitude, radius } = req.query;
            const filters = {};
            
            if (latitude && longitude) {
                filters.latitude = parseFloat(latitude);
                filters.longitude = parseFloat(longitude);
                filters.radius = parseFloat(radius) || 10;
            }
            
            const barbershops = await barbershopService.getAllBarbershops(filters);
            ResponseHelper.success(res, { barbershops }, 'Barberías obtenidas');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async getById(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const barbershop = await barbershopService.getBarbershopById(req.params.id);
            if (!barbershop) {
                return ResponseHelper.notFound(res, 'Barbería no encontrada');
            }
            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            ResponseHelper.success(res, { barbershop: barbershopWithoutPassword }, 'Barbería obtenida');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async getProfile(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const barbershop = await barbershopService.getBarbershopById(req.barbershop.barbershop_id);
            if (!barbershop) {
                return ResponseHelper.notFound(res, 'Barbería no encontrada');
            }
            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            ResponseHelper.success(res, { barbershop: barbershopWithoutPassword }, 'Perfil obtenido');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async updateProfile(req, res) {
        try {
            const { 
                name, phone, address, latitude, longitude, responsible_person,
                owner_phone, description, profile_photo_url, cover_photo_url
            } = req.body;
            
            // Validaciones
            const errors = [];
            if (name && name.length < 3) errors.push('Nombre debe tener al menos 3 caracteres');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Teléfono inválido');
            if (address && address.length < 10) errors.push('Dirección debe tener al menos 10 caracteres');
            if (latitude && (latitude < -90 || latitude > 90)) errors.push('Latitud inválida');
            if (longitude && (longitude < -180 || longitude > 180)) errors.push('Longitud inválida');
            
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            const barbershopService = new BarbershopService(req.db);
            const barbershopData = {
                name: name ? Validators.sanitizeString(name) : undefined,
                phone: phone?.trim(),
                address: address ? Validators.sanitizeString(address) : undefined,
                latitude: latitude ? parseFloat(latitude) : undefined,
                longitude: longitude ? parseFloat(longitude) : undefined,
                responsible_person: responsible_person ? Validators.sanitizeString(responsible_person) : undefined,
                owner_phone: owner_phone?.trim(),
                description: description ? Validators.sanitizeString(description) : undefined,
                profile_photo_url,
                cover_photo_url
            };

            // Remove undefined values
            Object.keys(barbershopData).forEach(key => 
                barbershopData[key] === undefined && delete barbershopData[key]
            );

            const updated = await barbershopService.updateBarbershop(req.barbershop.barbershop_id, barbershopData);
            if (!updated) {
                return ResponseHelper.notFound(res, 'Barbería no encontrada');
            }
            ResponseHelper.success(res, null, 'Perfil actualizado correctamente');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }
}

export default BarbershopController;