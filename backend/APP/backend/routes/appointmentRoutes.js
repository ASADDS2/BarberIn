const express = require('express');
const router = express.Router();
const AppointmentService = require('../services/appointmentService');
const { authenticateUser, authenticateBarbershop } = require('../middleware/auth');

// Create appointment (user)
router.post('/', authenticateUser, async (req, res) => {
    try {
        const appointmentService = new AppointmentService(req.db);
        const appointmentData = { ...req.body, user_id: req.user.user_id };
        const appointment = await appointmentService.createAppointment(appointmentData);
        res.status(201).json({ success: true, appointment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user appointments
router.get('/user', authenticateUser, async (req, res) => {
    try {
        const { status } = req.query;
        const appointmentService = new AppointmentService(req.db);
        const appointments = await appointmentService.getUserAppointments(req.user.user_id, status);
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get barbershop appointments
router.get('/barbershop', authenticateBarbershop, async (req, res) => {
    try {
        const { date } = req.query;
        const appointmentService = new AppointmentService(req.db);
        const appointments = await appointmentService.getBarbershopAppointments(
            req.barbershop.barbershop_id, 
            date
        );
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appointment status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentService = new AppointmentService(req.db);
        const updated = await appointmentService.updateAppointmentStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.json({ success: true, message: 'Estado de la cita actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
