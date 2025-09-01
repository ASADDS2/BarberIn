/**
 * Authentication Middleware
 * This middleware handles user authentication and authorization using JWT tokens.
 * It verifies tokens and extracts user/barbershop information for protected routes.
 */

import AuthService from '../services/authService.js';

/**
 * Authenticates regular users
 * Extracts and verifies JWT token from Authorization header
 * Adds user information to req.user for use in subsequent middleware/controllers
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateUser = (req, res, next) => {
    // Extract token from Authorization header (removes 'Bearer ' prefix if present)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token is provided
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        // Verify the JWT token and decode user information
        const decoded = AuthService.verifyToken(token);
        
        // Add user information to request object for use in controllers
        req.user = decoded;
        
        // Continue to the next middleware/controller
        next();
    } catch (error) {
        // Return unauthorized error if token is invalid or expired
        return res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * Authenticates barbershop users
 * Extracts and verifies JWT token from Authorization header
 * Ensures the token belongs to a barbershop user type
 * Adds barbershop information to req.barbershop for use in subsequent middleware/controllers
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateBarbershop = (req, res, next) => {
    // Extract token from Authorization header (removes 'Bearer ' prefix if present)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token is provided
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        // Verify the JWT token and decode user information
        const decoded = AuthService.verifyToken(token);
        
        // Check if the token belongs to a barbershop user
        if (decoded.type !== 'barbershop') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Add barbershop information to request object for use in controllers
        req.barbershop = decoded;
        
        // Continue to the next middleware/controller
        next();
    } catch (error) {
        // Return unauthorized error if token is invalid or expired
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Export both authentication middleware functions
export { authenticateUser, authenticateBarbershop };
