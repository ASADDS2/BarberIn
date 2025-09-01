/**
 * User Controller
 * Handles all HTTP requests related to user operations including
 * registration, login, profile management, and data retrieval.
 */

import UserService from '../services/userService.js';
import Validators from '../utils/validators.js';
import ResponseHelper from '../utils/responseHelper.js';

/**
 * UserController class
 * Contains static methods for handling user-related HTTP requests
 */
class UserController {
    
    /**
     * Registers a new user
     * Validates input data and creates a new user account
     * 
     * @param {Object} req - Express request object containing user data
     * @param {Object} res - Express response object
     */
    static async register(req, res) {
        try {
            // Extract user data from request body
            const { first_name, last_name, email, phone, password, address, age_range } = req.body;
            
            // Validate all required fields and data formats
            const errors = [];
            if (!first_name || first_name.length < 2) errors.push('First name required (minimum 2 characters)');
            if (!last_name || last_name.length < 2) errors.push('Last name required (minimum 2 characters)');
            if (!Validators.isValidEmail(email)) errors.push('Invalid email');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            if (!Validators.isValidPassword(password)) errors.push('Password must have at least 6 characters');
            
            // If validation fails, return validation errors
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            // Create user service instance and prepare user data
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

            // Create user and return success response
            const user = await userService.createUser(userData);
            ResponseHelper.success(res, user, 'User registered successfully', 201);
        } catch (error) {
            // Handle duplicate entry errors specifically
            if (error.message.includes('already exists')) {
                return ResponseHelper.error(res, error.message, 409);
            }
            // Handle other errors
            ResponseHelper.error(res, error.message);
        }
    }

    /**
     * Authenticates a user
     * Validates credentials and returns authentication token
     * 
     * @param {Object} req - Express request object containing login credentials
     * @param {Object} res - Express response object
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate that both email and password are provided
            if (!email || !password) {
                return ResponseHelper.validationError(res, ['Email and password are required']);
            }

            // Authenticate user and return login result
            const userService = new UserService(req.db);
            const result = await userService.loginUser(email.toLowerCase().trim(), password);
            ResponseHelper.success(res, result, 'Login successful');
        } catch (error) {
            // Handle authentication errors
            ResponseHelper.error(res, error.message, 401);
        }
    }

    /**
     * Retrieves the profile of the currently authenticated user
     * Uses JWT token to identify the user
     * 
     * @param {Object} req - Express request object with authenticated user info
     * @param {Object} res - Express response object
     */
    static async getProfile(req, res) {
        try {
            const userService = new UserService(req.db);
            const user = await userService.getUserById(req.user.user_id);
            
            // Check if user exists
            if (!user) {
                return ResponseHelper.notFound(res, 'User not found');
            }
            
            // Remove password hash from response for security
            const { password_hash, ...userWithoutPassword } = user;
            ResponseHelper.success(res, { user: userWithoutPassword }, 'Profile retrieved');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    /**
     * Updates the profile of the currently authenticated user
     * Validates input data and updates only provided fields
     * 
     * @param {Object} req - Express request object with profile update data
     * @param {Object} res - Express response object
     */
    static async updateProfile(req, res) {
        try {
            // Extract updateable fields from request body
            const { first_name, last_name, phone, address, age_range, profile_photo_url } = req.body;
            
            // Validate provided data
            const errors = [];
            if (first_name && first_name.length < 2) errors.push('First name must have at least 2 characters');
            if (last_name && last_name.length < 2) errors.push('Last name must have at least 2 characters');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            
            // If validation fails, return validation errors
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            // Prepare update data with validation and sanitization
            const userService = new UserService(req.db);
            const userData = {
                first_name: first_name ? Validators.sanitizeString(first_name) : undefined,
                last_name: last_name ? Validators.sanitizeString(last_name) : undefined,
                phone: phone?.trim(),
                address: address ? Validators.sanitizeString(address) : undefined,
                age_range,
                profile_photo_url
            };

            // Remove undefined values to avoid overwriting with null
            Object.keys(userData).forEach(key => 
                userData[key] === undefined && delete userData[key]
            );

            // Update user profile
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

export default UserController; // Use export default