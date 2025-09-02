/**
 * Barbershop Routes
 * Defines all HTTP endpoints related to barbershop operations including
 * registration, authentication, profile management, and data retrieval.
 */

import express from 'express';
import BarbershopController from '../controllers/barbershopController.js';
import { authenticateBarbershop } from '../middleware/auth.js';

// Create Express router instance
const router = express.Router();

/**
 * POST /register
 * Registers a new barbershop account
 * No authentication required
 */
router.post('/register', BarbershopController.register);

/**
 * POST /login
 * Authenticates a barbershop and returns JWT token
 * No authentication required
 */
router.post('/login', BarbershopController.login);

/**
 * GET /profile/me
 * Retrieves the current barbershop's profile information
 * Requires barbershop authentication via JWT token
 */
router.get('/profile/me', authenticateBarbershop, BarbershopController.getProfile);

/**
 * PUT /profile
 * Updates the current barbershop's profile information
 * Requires barbershop authentication via JWT token
 */
router.put('/profile', authenticateBarbershop, BarbershopController.updateProfile);

/**
 * GET /
 * Retrieves all barbershops with optional location filtering
 * No authentication required
 */
router.get('/', BarbershopController.getAll);

/**
 * GET /:id
 * Retrieves a specific barbershop by ID
 * No authentication required
 */
router.get('/:id', BarbershopController.getById);

// Export the router for use in the main application
export default router;