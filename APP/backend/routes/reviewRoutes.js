/**
 * Review Routes
 * Defines all HTTP endpoints related to review operations including
 * creation and retrieval of reviews for barbers and barbershops.
 */

import express from 'express';  // We use `import` for express
import ReviewService from '../services/reviewService.js';  // Change `require` to `import` with .js extension
import { authenticateUser } from '../middleware/auth.js';  // Change `require` to `import` with .js extension

// Create Express router instance
const router = express.Router();

/**
 * POST /
 * Creates a new review for a barber or barbershop
 * Requires user authentication via JWT token
 * 
 * Request body should include: appointment_id, barber_id, barbershop_id, rating, comment (optional)
 */
router.post('/', authenticateUser, async (req, res) => {
    try {
        // Create review service instance and prepare review data
        const reviewService = new ReviewService(req.db);
        const reviewData = { ...req.body, user_id: req.user.user_id };
        
        // Create the review and return success response
        const review = await reviewService.createReview(reviewData);
        res.status(201).json({ success: true, review });
    } catch (error) {
        // Handle creation errors
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /barber/:barber_id
 * Retrieves reviews for a specific barber
 * No authentication required (public endpoint)
 * 
 * Query parameters: limit (optional) - maximum number of reviews to return (default: 10)
 * Path parameters: barber_id - ID of the barber to get reviews for
 */
router.get('/barber/:barber_id', async (req, res) => {
    try {
        // Extract limit from query parameters with default value
        const { limit } = req.query;
        
        // Retrieve barber reviews with optional limit
        const reviewService = new ReviewService(req.db);
        const reviews = await reviewService.getBarberReviews(
            req.params.barber_id, 
            parseInt(limit) || 10
        );
        res.json({ success: true, reviews });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /barbershop/:barbershop_id
 * Retrieves reviews for a specific barbershop
 * No authentication required (public endpoint)
 * 
 * Query parameters: limit (optional) - maximum number of reviews to return (default: 10)
 * Path parameters: barbershop_id - ID of the barbershop to get reviews for
 */
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        // Extract limit from query parameters with default value
        const { limit } = req.query;
        
        // Retrieve barbershop reviews with optional limit
        const reviewService = new ReviewService(req.db);
        const reviews = await reviewService.getBarbershopReviews(
            req.params.barbershop_id, 
            parseInt(limit) || 10
        );
        res.json({ success: true, reviews });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

// Export the router for use in the main application
export default router;