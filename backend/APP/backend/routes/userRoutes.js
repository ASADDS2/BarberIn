const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', authenticateUser, UserController.getProfile);
router.put('/profile', authenticateUser, UserController.updateProfile);

module.exports = router;
