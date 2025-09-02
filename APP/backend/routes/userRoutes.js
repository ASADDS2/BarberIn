/**
 * User Routes
 * Defines all HTTP endpoints related to user operations including
 * authentication, profile management, and user data.
 */

import express from 'express';
import UserController from '../controllers/userController.js';


// Create Express router instance
const router = express.Router();

/**
 * GET /
 * Get all users with pagination (for admin purposes)
 * Requires authentication (consider adding admin role check)
 */
router.get('/',  UserController.getAllUsers);

/**
 * POST /register
 * Registers a new user account
 * No authentication required
 */
router.post('/register', UserController.register);

/**
 * POST /login
 * Authenticates a user and returns JWT token
 * No authentication required
 */
router.post('/login', UserController.login);

/**
 * GET /profile
 * Retrieves the current user's profile information
 * Requires user authentication via JWT token
 */
router.get('/profile',  UserController.getProfile);

/**
 * PUT /profile
 * Updates the current user's profile information
 * Requires user authentication via JWT token
 */
router.put('/profile',  UserController.updateProfile);

// Export the router for use in the main application
export default router;