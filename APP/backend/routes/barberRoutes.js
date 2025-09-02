/**
 * Barber Routes
 * Defines all HTTP endpoints related to barber operations including
 * creation, management, availability, and scheduling for barbershops.
 */

import express from 'express';
const router = express.Router();
import BarberService from '../services/barberService.js';
import { authenticateBarbershop } from '../middleware/auth.js';

/**
 * POST /
 * Creates a new barber for the authenticated barbershop
 * Requires barbershop authentication via JWT token
 * 
 * Request body should include: first_name, last_name, email, phone, specialties (optional)
 */
router.post('/', authenticateBarbershop, async (req, res) => {
    try {
        // Create barber service instance and prepare barber data
        const barberService = new BarberService(req.db);
        const barberData = { ...req.body, barbershop_id: req.barbershop.barbershop_id };
        
        // Create the barber and return success response
        const barber = await barberService.createBarber(barberData);
        res.status(201).json({ success: true, barber });
    } catch (error) {
        // Handle creation errors
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /barbershop/:barbershop_id
 * Retrieves all barbers working at a specific barbershop
 * No authentication required (public endpoint)
 * 
 * Path parameters: barbershop_id - ID of the barbershop to get barbers for
 */
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        // Retrieve barbers for the specified barbershop
        const barberService = new BarberService(req.db);
        const barbers = await barberService.getBarbersByBarbershop(req.params.barbershop_id);
        res.json({ success: true, barbers });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /:id
 * Retrieves a specific barber by ID
 * No authentication required (public endpoint)
 * 
 * Path parameters: id - ID of the barber to retrieve
 */
router.get('/:id', async (req, res) => {
    try {
        // Retrieve the specific barber by ID
        const barberService = new BarberService(req.db);
        const barber = await barberService.getBarberById(req.params.id);
        
        // Check if barber exists
        if (!barber) {
            return res.status(404).json({ error: 'Barber not found' });
        }
        
        // Return the barber data
        res.json({ success: true, barber });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /:id
 * Updates an existing barber's information
 * Requires barbershop authentication via JWT token
 * 
 * Path parameters: id - ID of the barber to update
 * Request body should include: first_name, last_name, email, phone, specialties (optional)
 */
router.put('/:id', authenticateBarbershop, async (req, res) => {
    try {
        // Update the barber with new data
        const barberService = new BarberService(req.db);
        const updated = await barberService.updateBarber(req.params.id, req.body);
        
        // Check if barber exists
        if (!updated) {
            return res.status(404).json({ error: 'Barber not found' });
        }
        
        // Return success response
        res.json({ success: true, message: 'Barber updated successfully' });
    } catch (error) {
        // Handle update errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /:id/availability
 * Updates a barber's availability status (active/inactive)
 * Requires barbershop authentication via JWT token
 * 
 * Path parameters: id - ID of the barber to update availability for
 * Request body should include: status (active/inactive)
 */
router.put('/:id/availability', authenticateBarbershop, async (req, res) => {
    try {
        // Extract availability status from request body
        const { status } = req.body;
        
        // Update barber availability
        const barberService = new BarberService(req.db);
        await barberService.updateBarberAvailability(req.params.id, status);
        
        // Return success response
        res.json({ success: true, message: 'Availability updated' });
    } catch (error) {
        // Handle update errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /:id/schedule
 * Retrieves a barber's working schedule
 * No authentication required (public endpoint)
 * 
 * Path parameters: id - ID of the barber to get schedule for
 */
router.get('/:id/schedule', async (req, res) => {
    try {
        // Retrieve barber's working schedule
        const barberService = new BarberService(req.db);
        const schedule = await barberService.getBarberSchedule(req.params.id);
        res.json({ success: true, schedule });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /:id/schedule
 * Sets a barber's working schedule
 * Requires barbershop authentication via JWT token
 * 
 * Path parameters: id - ID of the barber to set schedule for
 * Request body should include: schedules (array of working hours)
 */
router.post('/:id/schedule', authenticateBarbershop, async (req, res) => {
    try {
        // Extract schedule data from request body
        const { schedules } = req.body;
        
        // Set barber's working schedule
        const barberService = new BarberService(req.db);
        await barberService.setBarberSchedule(req.params.id, schedules);
        
        // Return success response
        res.json({ success: true, message: 'Schedule set successfully' });
    } catch (error) {
        // Handle schedule setting errors
        res.status(500).json({ error: error.message });
    }
});

// Export the router for use in the main application
export default router;
