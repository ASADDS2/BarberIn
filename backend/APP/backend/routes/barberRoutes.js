import express from 'express';
const router = express.Router();
import BarberService from '../services/barberService.js';
import { authenticateBarbershop } from '../middleware/auth.js';

// Create barber
router.post('/', authenticateBarbershop, async (req, res) => {
    try {
        const barberService = new BarberService(req.db);
        const barberData = { ...req.body, barbershop_id: req.barbershop.barbershop_id };
        const barber = await barberService.createBarber(barberData);
        res.status(201).json({ success: true, barber });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get barbers by barbershop
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        const barberService = new BarberService(req.db);
        const barbers = await barberService.getBarbersByBarbershop(req.params.barbershop_id);
        res.json({ success: true, barbers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get barber by ID
router.get('/:id', async (req, res) => {
    try {
        const barberService = new BarberService(req.db);
        const barber = await barberService.getBarberById(req.params.id);
        if (!barber) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }
        res.json({ success: true, barber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update barber
router.put('/:id', authenticateBarbershop, async (req, res) => {
    try {
        const barberService = new BarberService(req.db);
        const updated = await barberService.updateBarber(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }
        res.json({ success: true, message: 'Barbero actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update barber availability
router.put('/:id/availability', authenticateBarbershop, async (req, res) => {
    try {
        const { status } = req.body;
        const barberService = new BarberService(req.db);
        await barberService.updateBarberAvailability(req.params.id, status);
        res.json({ success: true, message: 'Disponibilidad actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get barber schedule
router.get('/:id/schedule', async (req, res) => {
    try {
        const barberService = new BarberService(req.db);
        const schedule = await barberService.getBarberSchedule(req.params.id);
        res.json({ success: true, schedule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set barber schedule
router.post('/:id/schedule', authenticateBarbershop, async (req, res) => {
    try {
        const { schedules } = req.body;
        const barberService = new BarberService(req.db);
        await barberService.setBarberSchedule(req.params.id, schedules);
        res.json({ success: true, message: 'Horario establecido correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
