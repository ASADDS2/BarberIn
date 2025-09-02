/**
 * Barbershop Service
 * Handles all barbershop-related database operations including creation,
 * authentication, profile management, location-based searches, and data retrieval.
 */

import AuthService from './authService.js';

/**
 * BarbershopService class
 * Contains methods for managing barbershop data and operations
 */
class BarbershopService {
    
    /**
     * Constructor for BarbershopService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new barbershop in the database
     * @param {Object} barbershopData - Barbershop data object containing all required fields
     * @returns {Promise<Object>} Created barbershop information (without password)
     * @throws {Error} If barbershop already exists or database operation fails
     */
    async createBarbershop(barbershopData) {
        const { 
            name, email, phone, password, address, latitude, longitude,
            responsible_person, id_document, owner_phone, description
        } = barbershopData;
        
        try {
            // Check if barbershop already exists with the same email
            const existingBarbershop = await this.getBarbershopByEmail(email);
            if (existingBarbershop) {
                throw new Error('Barbershop already exists');
            }

            // Hash the password for secure storage
            const password_hash = await AuthService.hashPassword(password);
            
            // SQL query to insert new barbershop
            const query = `
                INSERT INTO barbershops (name, email, phone, password_hash, address, latitude, longitude,
                responsible_person, id_document, owner_phone, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the insert query
            return new Promise((resolve, reject) => {
                this.db.query(query, [name, email, phone, password_hash, address, latitude, longitude,
                    responsible_person, id_document, owner_phone, description], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ barbershop_id: result.insertId, name, email });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a barbershop by email address
     * @param {string} email - Email address to search for
     * @returns {Promise<Object|null>} Barbershop object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getBarbershopByEmail(email) {
        const query = 'SELECT * FROM barbershops WHERE email = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Retrieves a barbershop by barbershop ID
     * @param {number} id - Barbershop ID to search for
     * @returns {Promise<Object|null>} Barbershop object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getBarbershopById(id) {
        const query = 'SELECT * FROM barbershops WHERE barbershop_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Retrieves all active barbershops with optional location-based filtering
     * @param {Object} filters - Optional filters including latitude, longitude, and radius
     * @returns {Promise<Array>} Array of barbershops matching the criteria
     * @throws {Error} If database operation fails
     */
    async getAllBarbershops(filters = {}) {
        let query = 'SELECT * FROM barbershops WHERE is_active = TRUE';
        const params = [];

        // Add location-based filtering if coordinates and radius are provided
        if (filters.latitude && filters.longitude && filters.radius) {
            // Use Haversine formula to calculate distance between coordinates
            query += ` HAVING (
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) <= ?`;
            params.push(filters.latitude, filters.longitude, filters.latitude, filters.radius);
        }

        // Order by average rating (highest first)
        query += ' ORDER BY rating_average DESC';

        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Updates an existing barbershop's information
     * @param {number} id - Barbershop ID to update
     * @param {Object} barbershopData - Updated barbershop data
     * @returns {Promise<boolean>} True if update was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async updateBarbershop(id, barbershopData) {
        const { 
            name, phone, address, latitude, longitude, responsible_person,
            owner_phone, description, profile_photo_url, cover_photo_url
        } = barbershopData;
        
        // SQL query to update barbershop information
        const query = `
            UPDATE barbershops 
            SET name = ?, phone = ?, address = ?, latitude = ?, longitude = ?,
                responsible_person = ?, owner_phone = ?, description = ?,
                profile_photo_url = ?, cover_photo_url = ?
            WHERE barbershop_id = ?
        `;
        
        // Execute the update query
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, phone, address, latitude, longitude,
                responsible_person, owner_phone, description, profile_photo_url, cover_photo_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    /**
     * Authenticates a barbershop with email and password
     * @param {string} email - Barbershop's email address
     * @param {string} password - Barbershop's plain text password
     * @returns {Promise<Object>} Barbershop information and authentication token
     * @throws {Error} If barbershop not found or password is incorrect
     */
    async loginBarbershop(email, password) {
        try {
            // Find barbershop by email
            const barbershop = await this.getBarbershopByEmail(email);
            if (!barbershop) {
                throw new Error('Barbershop not found');
            }

            // Verify password
            const isValidPassword = await AuthService.comparePassword(password, barbershop.password_hash);
            if (!isValidPassword) {
                throw new Error('Incorrect password');
            }

            // Generate authentication token
            const token = AuthService.generateToken({
                barbershop_id: barbershop.barbershop_id,
                email: barbershop.email,
                type: 'barbershop'
            });

            // Return barbershop data without password hash
            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            return { barbershop: barbershopWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }
}

// Export the BarbershopService class for use throughout the application
export default BarbershopService;