const express = require('express');
const router = express.Router();
const ReviewService = require('../services/reviewService');
const { authenticateUser } = require('../middleware/auth');

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

module.exports = router;