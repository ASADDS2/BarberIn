const express = require('express');
const router = express.Router();
const BarbershopController = require('../controllers/barbershopController');
const { authenticateBarbershop } = require('../middleware/auth');

router.post('/register', BarbershopController.register);
router.post('/login', BarbershopController.login);
router.get('/', BarbershopController.getAll);
router.get('/:id', BarbershopController.getById);
router.get('/profile/me', authenticateBarbershop, BarbershopController.getProfile);
router.put('/profile', authenticateBarbershop, BarbershopController.updateProfile);

module.exports = router;