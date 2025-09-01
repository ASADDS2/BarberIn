/**
 * Authentication Service
 * Handles all authentication-related operations including password hashing,
 * password comparison, JWT token generation, and token verification.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * AuthService class
 * Contains static methods for handling authentication operations
 */
class AuthService {
    
    /**
     * Hashes a password using bcrypt with salt rounds
     * @param {string} password - Plain text password to hash
     * @returns {Promise<string>} Hashed password
     */
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Compares a plain text password with a hashed password
     * @param {string} password - Plain text password to compare
     * @param {string} hash - Hashed password to compare against
     * @returns {Promise<boolean>} True if passwords match, false otherwise
     */
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Generates a JWT token with the provided payload
     * @param {Object} payload - Data to be encoded in the JWT token
     * @returns {string} JWT token with 24-hour expiration
     */
    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });
    }

    /**
     * Verifies and decodes a JWT token
     * @param {string} token - JWT token to verify
     * @returns {Object} Decoded token payload
     * @throws {Error} If token is invalid or expired
     */
    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    }
}

// Export the AuthService class for use throughout the application
export default AuthService;
