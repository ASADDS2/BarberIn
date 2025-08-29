const express = require('express');
const router = express.Router();
const ServiceService = require('../services/serviceService');
const { authenticateBarbershop } = require('../middleware/auth');

// Create service
router.post('/', authenticateBarbershop, async (req, res) => {
    try {
        const serviceService = new ServiceService(req.db);
        const serviceData = { ...req.body, barbershop_id: req.barbershop.barbershop_id };
        const service = await serviceService.createService(serviceData);
        res.status(201).json({ success: true, service });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get services by barbershop
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        const serviceService = new ServiceService(req.db);
        const services = await serviceService.getServicesByBarbershop(req.params.barbershop_id);
        res.json({ success: true, services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const serviceService = new ServiceService(req.db);
        const service = await serviceService.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json({ success: true, service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update service
router.put('/:id', authenticateBarbershop, async (req, res) => {
    try {
        const serviceService = new ServiceService(req.db);
        const updated = await serviceService.updateService(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json({ success: true, message: 'Servicio actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete service
router.delete('/:id', authenticateBarbershop, async (req, res) => {
    try {
        const serviceService = new ServiceService(req.db);
        const deleted = await serviceService.deleteService(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json({ success: true, message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
