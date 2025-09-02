/**
 * Barbershop Controller
 * Handles all HTTP requests related to barbershop operations including
 * registration, login, profile management, and data retrieval.
 */

import BarbershopService from '../services/barbershopService.js'; // Include .js extension
import Validators from '../utils/validators.js';
import ResponseHelper from '../utils/responseHelper.js';


/**
 * BarbershopController class
 * Contains static methods for handling barbershop-related HTTP requests
 */
class BarbershopController {
    
    /**
     * Registers a new barbershop
     * Validates input data and creates a new barbershop account
     * 
     * @param {Object} req - Express request object containing barbershop data
     * @param {Object} res - Express response object
     */
    static async register(req, res) {
        try {
            // Extract barbershop data from request body
            const { 
                name, email, phone, password, address, latitude, longitude,
                responsible_person, id_document, owner_phone, description
            } = req.body;
            
            // Validate all required fields and data formats
            const errors = [];
            if (!name || name.length < 3) errors.push('Barbershop name required (minimum 3 characters)');
            if (!Validators.isValidEmail(email)) errors.push('Invalid email');
            if (!Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            if (!Validators.isValidPassword(password)) errors.push('Password must have at least 6 characters');
            if (!address || address.length < 10) errors.push('Address required (minimum 10 characters)');
            if (!responsible_person || responsible_person.length < 5) errors.push('Responsible person required');
            if (!id_document || id_document.length < 6) errors.push('Identity document required');
            if (latitude && (latitude < -90 || latitude > 90)) errors.push('Invalid latitude');
            if (longitude && (longitude < -180 || longitude > 180)) errors.push('Invalid longitude');
            
            // If validation fails, return validation errors
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            // Create barbershop service instance and prepare data
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

            // Create barbershop and return success response
            const barbershop = await barbershopService.createBarbershop(barbershopData);
            ResponseHelper.success(res, barbershop, 'Barbershop registered successfully', 201);
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
     * Authenticates a barbershop user
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

            // Authenticate barbershop and return login result
            const barbershopService = new BarbershopService(req.db);
            const result = await barbershopService.loginBarbershop(email.toLowerCase().trim(), password);
            ResponseHelper.success(res, result, 'Login successful');
        } catch (error) {
            // Handle authentication errors
            ResponseHelper.error(res, error.message, 401);
        }
    }

    /**
     * Retrieves all barbershops with optional location filtering
     * Can filter by geographic coordinates and radius for location-based searches
     * 
     * @param {Object} req - Express request object with optional query parameters
     * @param {Object} res - Express response object
     */
    static async getAll(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const { latitude, longitude, radius } = req.query;
            const filters = {};
            
            // If coordinates are provided, add location-based filtering
            if (latitude && longitude) {
                filters.latitude = parseFloat(latitude);
                filters.longitude = parseFloat(longitude);
                filters.radius = parseFloat(radius) || 10; // Default radius: 10 units
            }
            
            // Retrieve and return barbershops
            const barbershops = await barbershopService.getAllBarbershops(filters);
            ResponseHelper.success(res, { barbershops }, 'Barbershops retrieved');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    /**
     * Retrieves a specific barbershop by ID
     * Returns barbershop data excluding sensitive information like password
     * 
     * @param {Object} req - Express request object with barbershop ID parameter
     * @param {Object} res - Express response object
     */
    static async getById(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const barbershop = await barbershopService.getBarbershopById(req.params.id);
            
            // Check if barbershop exists
            if (!barbershop) {
                return ResponseHelper.notFound(res, 'Barbershop not found');
            }
            
            // Remove password hash from response for security
            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            ResponseHelper.success(res, { barbershop: barbershopWithoutPassword }, 'Barbershop retrieved');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    /**
     * Retrieves the profile of the currently authenticated barbershop
     * Uses JWT token to identify the barbershop
     * 
     * @param {Object} req - Express request object with authenticated barbershop info
     * @param {Object} res - Express response object
     */
    static async getProfile(req, res) {
        try {
            const barbershopService = new BarbershopService(req.db);
            const barbershop = await barbershopService.getBarbershopById(req.barbershop.barbershop_id);
            
            // Check if barbershop exists
            if (!barbershop) {
                return ResponseHelper.notFound(res, 'Barbershop not found');
            }
            
            // Remove password hash from response for security
            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            ResponseHelper.success(res, { barbershop: barbershopWithoutPassword }, 'Profile retrieved');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }

    /**
     * Updates the profile of the currently authenticated barbershop
     * Validates input data and updates only provided fields
     * 
     * @param {Object} req - Express request object with profile update data
     * @param {Object} res - Express response object
     */
    static async updateProfile(req, res) {
        try {
            // Extract updateable fields from request body
            const { 
                name, phone, address, latitude, longitude, responsible_person,
                owner_phone, description, profile_photo_url, cover_photo_url
            } = req.body;
            
            // Validate provided data
            const errors = [];
            if (name && name.length < 3) errors.push('Name must have at least 3 characters');
            if (phone && !Validators.isValidPhone(phone)) errors.push('Invalid phone number');
            if (address && address.length < 10) errors.push('Address must have at least 10 characters');
            if (latitude && (latitude < -90 || latitude > 90)) errors.push('Invalid latitude');
            if (longitude && (longitude < -180 || longitude > 180)) errors.push('Invalid longitude');
            
            // If validation fails, return validation errors
            if (errors.length > 0) {
                return ResponseHelper.validationError(res, errors);
            }

            // Prepare update data with validation and sanitization
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

            // Remove undefined values to avoid overwriting with null
            Object.keys(barbershopData).forEach(key => 
                barbershopData[key] === undefined && delete barbershopData[key]
            );

            // Update barbershop profile
            const updated = await barbershopService.updateBarbershop(req.barbershop.barbershop_id, barbershopData);
            if (!updated) {
                return ResponseHelper.notFound(res, 'Barbershop not found');
            }
            ResponseHelper.success(res, null, 'Profile updated successfully');
        } catch (error) {
            ResponseHelper.error(res, error.message);
        }
    }
}

export default BarbershopController;