import express from 'express';  // Usamos `import` para express
import ReviewService from '../services/reviewService.js';  // Cambiar `require` por `import` con la extensión .js
import { authenticateUser } from '../middleware/auth.js';  // Cambiar `require` por `import` con la extensión .js

const router = express.Router();


// Create review
router.post('/', authenticateUser, async (req, res) => {
    try {
        const reviewService = new ReviewService(req.db);
        const reviewData = { ...req.body, user_id: req.user.user_id };
        const review = await reviewService.createReview(reviewData);
        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get barber reviews
router.get('/barber/:barber_id', async (req, res) => {
    try {
        const { limit } = req.query;
        const reviewService = new ReviewService(req.db);
        const reviews = await reviewService.getBarberReviews(
            req.params.barber_id, 
            parseInt(limit) || 10
        );
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get barbershop reviews
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        const { limit } = req.query;
        const reviewService = new ReviewService(req.db);
        const reviews = await reviewService.getBarbershopReviews(
            req.params.barbershop_id, 
            parseInt(limit) || 10
        );
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;