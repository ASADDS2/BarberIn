/**
 * User Service
 * Handles all user-related database operations including user creation,
 * authentication, profile management, and data retrieval.
 */

import AuthService from './authService.js';

/**
 * UserService class
 * Contains methods for managing user data and operations
 */
class UserService {
    
    /**
     * Constructor for UserService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new user in the database
     * @param {Object} userData - User data object containing all required fields
     * @returns {Promise<Object>} Created user information (without password)
     * @throws {Error} If user already exists or database operation fails
     */
    async createUser(userData) {
        const { first_name, last_name, email, phone, password, address, age_range } = userData;
        
        try {
            // Check if user already exists with the same email
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash the password for secure storage
            const password_hash = await AuthService.hashPassword(password);
            
            // SQL query to insert new user
            const query = `
                INSERT INTO users (first_name, last_name, email, phone, password_hash, address, age_range)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the insert query
            return new Promise((resolve, reject) => {
                this.db.query(query, [first_name, last_name, email, phone, password_hash, address, age_range], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ user_id: result.insertId, email, first_name, last_name });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a user by email address
     * @param {string} email - Email address to search for
     * @returns {Promise<Object|null>} User object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Retrieves a user by user ID
     * @param {number} id - User ID to search for
     * @returns {Promise<Object|null>} User object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getUserById(id) {
        const query = 'SELECT * FROM users WHERE user_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Updates an existing user's information
     * @param {number} id - User ID to update
     * @param {Object} userData - Updated user data
     * @returns {Promise<boolean>} True if update was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async updateUser(id, userData) {
        const { first_name, last_name, phone, address, age_range, profile_photo_url } = userData;
        
        // SQL query to update user information
        const query = `
            UPDATE users 
            SET first_name = ?, last_name = ?, phone = ?, address = ?, age_range = ?, profile_photo_url = ?
            WHERE user_id = ?
        `;
        
        // Execute the update query
        return new Promise((resolve, reject) => {
            this.db.query(query, [first_name, last_name, phone, address, age_range, profile_photo_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    /**
     * Authenticates a user with email and password
     * @param {string} email - User's email address
     * @param {string} password - User's plain text password
     * @returns {Promise<Object>} User information and authentication token
     * @throws {Error} If user not found or password is incorrect
     */
    async loginUser(email, password) {
        try {
            // Find user by email
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify password
            const isValidPassword = await AuthService.comparePassword(password, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Incorrect password');
            }

            // Generate authentication token
            const token = AuthService.generateToken({
                user_id: user.user_id,
                email: user.email,
                type: 'user'
            });

            // Return user data without password hash
            const { password_hash, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }
}

// Export the UserService class for use throughout the application
export default UserService;
