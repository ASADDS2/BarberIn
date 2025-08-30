import UserService from '../services/userService.js';
import Validators from '../utils/validators.js';
import ResponseHelper from '../utils/responseHelper.js';

class UserController {
    static async register(req, res) {
        try {
            const { first_name, last_name, email, phone, password, address, age_range } = req.body;
            
            // Validaciones
            const errors = [];
            if (!first_name || first_name.length < 2) errors.push('Nombre requerido (mínimo 2 caracteres)');
            if (!last_name || last_name.length < 2) errors.push('Apellido requerido (mínimo 2 caracteres)');
            if (!Validators.isValidEmail(email)) errors.push('Email inválido');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Teléfono inválido');
            if (!Validators.isValidPassword(password)) errors.push('Contraseña debe tener al menos 6 caracteres');
            
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            const userService = new UserService(req.db);
            const userData = {
                first_name: Validators.sanitizeString(first_name),
                last_name: Validators.sanitizeString(last_name),
                email: email.toLowerCase().trim(),
                phone: phone?.trim(),
                password,
                address: Validators.sanitizeString(address),
                age_range
            };

            const user = await userService.createUser(userData);
            ResponseHelper.success(res, user, 'Usuario registrado exitosamente', 201);
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

            const userService = new UserService(req.db);
            const result = await userService.loginUser(email.toLowerCase().trim(), password);
            ResponseHelper.success(res, result, 'Login exitoso');
        } catch (error) {
            ResponseHelper.error(res, error.message, 401);
        }
    }

    static async getProfile(req, res) {
        try {
            const userService = new UserService(req.db);
            const user = await userService.getUserById(req.user.user_id);
            if (!user) {
                return ResponseHelper.notFound(res, 'Usuario no encontrado');
            }
            const { password_hash, ...userWithoutPassword } = user;
            ResponseHelper.success(res, { user: userWithoutPassword }, 'Perfil obtenido');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async updateProfile(req, res) {
        try {
            const { first_name, last_name, phone, address, age_range, profile_photo_url } = req.body;
            
            // Validaciones
            const errors = [];
            if (first_name && first_name.length < 2) errors.push('Nombre debe tener al menos 2 caracteres');
            if (last_name && last_name.length < 2) errors.push('Apellido debe tener al menos 2 caracteres');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Teléfono inválido');
            
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            const userService = new UserService(req.db);
            const userData = {
                first_name: first_name ? Validators.sanitizeString(first_name) : undefined,
                last_name: last_name ? Validators.sanitizeString(last_name) : undefined,
                phone: phone?.trim(),
                address: address ? Validators.sanitizeString(address) : undefined,
                age_range,
                profile_photo_url
            };

            // Remove undefined values
            Object.keys(userData).forEach(key => 
                userData[key] === undefined && delete userData[key]
            );

            const updated = await userService.updateUser(req.user.user_id, userData);
            if (!updated) {
                return ResponseHelper.notFound(res, 'Usuario no encontrado');
            }
            ResponseHelper.success(res, null, 'Perfil actualizado correctamente');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }
}

export default UserController; // Usar export default
