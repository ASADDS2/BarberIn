import express from 'express';
import BarbershopController from '../controllers/barbershopController.js';
import { authenticateBarbershop } from '../middleware/auth.js';

const router = express.Router();

// Rutas específicas PRIMERO (antes de las rutas con parámetros)
router.post('/register', BarbershopController.register);
router.post('/login', BarbershopController.login);
router.get('/profile/me', authenticateBarbershop, BarbershopController.getProfile);
router.put('/profile', authenticateBarbershop, BarbershopController.updateProfile);

// Ruta general para obtener todas las barberías
router.get('/', BarbershopController.getAll);

// Rutas con parámetros AL FINAL
router.get('/:id', BarbershopController.getById);

export default router;