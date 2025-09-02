import UserService from '../services/userService.js';
import Validators from '../utils/validators.js';
import ResponseHelper from '../utils/responseHelper.js';

class UserController {
    static async register(req, res) {
        try {
            const { first_name, last_name, email, phone, password, address, age_range } = req.body;
            
            // Validations
            const errors = [];
            if (!first_name || first_name.length < 2) errors.push('First name required (minimum 2 characters)');
            if (!last_name || last_name.length < 2) errors.push('Last name required (minimum 2 characters)');
            if (!Validators.isValidEmail(email)) errors.push('Invalid email');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            if (!Validators.isValidPassword(password)) errors.push('Password must have at least 6 characters');
            
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
            ResponseHelper.success(res, user, 'User registered successfully', 201);
        } catch (error) {
            if (error.message.includes('already exists')) {
                return ResponseHelper.error(res, error.message, 409);
            }
            ResponseHelper.error(res, error.message);
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return ResponseHelper.validationError(res, ['Email and password are required']);
            }

            const userService = new UserService(req.db);
            const result = await userService.loginUser(email.toLowerCase().trim(), password);
            ResponseHelper.success(res, result, 'Login successful');
        } catch (error) {
            ResponseHelper.error(res, error.message, 401);
        }
    }

    static async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const userService = new UserService(req.db);
            const users = await userService.getAllUsers(parseInt(page), parseInt(limit));
            ResponseHelper.success(res, users, 'Users retrieved successfully');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async getProfile(req, res) {
        try {
            const userService = new UserService(req.db);
            const user = await userService.getUserById(req.user.user_id);
            if (!user) {
                return ResponseHelper.notFound(res, 'User not found');
            }
            const { password_hash, ...userWithoutPassword } = user;
            ResponseHelper.success(res, { user: userWithoutPassword }, 'Profile retrieved');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    static async updateProfile(req, res) {
        try {
            const { first_name, last_name, phone, address, age_range, profile_photo_url } = req.body;
            
            // Validations
            const errors = [];
            if (first_name && first_name.length < 2) errors.push('First name must have at least 2 characters');
            if (last_name && last_name.length < 2) errors.push('Last name must have at least 2 characters');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            
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
                return ResponseHelper.notFound(res, 'User not found');
            }
            ResponseHelper.success(res, null, 'Profile updated successfully');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }
}

export default UserController;