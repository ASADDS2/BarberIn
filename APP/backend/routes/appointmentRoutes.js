/**
 * Appointment Routes
 * Defines all HTTP endpoints related to appointment operations including
 * creation, retrieval, and status management for both users and barbershops.
 */

import express from 'express';  // Make sure to use ESM syntax here too
import AppointmentService from '../services/appointmentService.js';  // Change require to import
import { authenticateUser, authenticateBarbershop } from '../middleware/auth.js';  // Make sure auth.js uses import too

// Create Express router instance
const router = express.Router();

/**
 * POST /
 * Creates a new appointment
 * Requires user authentication via JWT token
 * 
 * Request body should include: barber_id, barbershop_id, appointment_date, appointment_time
 */
router.post('/', authenticateUser, async (req, res) => {
    try {
        // Create appointment service instance and prepare appointment data
        const appointmentService = new AppointmentService(req.db);
        const appointmentData = { ...req.body, user_id: req.user.user_id };
        
        // Create the appointment and return success response
        const appointment = await appointmentService.createAppointment(appointmentData);
        res.status(201).json({ success: true, appointment });
    } catch (error) {
        // Handle creation errors
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /user
 * Retrieves appointments for the currently authenticated user
 * Requires user authentication via JWT token
 * 
 * Query parameters: status (optional) - filter by appointment status
 */
router.get('/user', authenticateUser, async (req, res) => {
    try {
        // Extract status filter from query parameters
        const { status } = req.query;
        
        // Retrieve user appointments with optional status filtering
        const appointmentService = new AppointmentService(req.db);
        const appointments = await appointmentService.getUserAppointments(req.user.user_id, status);
        res.json({ success: true, appointments });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /barbershop
 * Retrieves appointments for the currently authenticated barbershop
 * Requires barbershop authentication via JWT token
 * 
 * Query parameters: date (optional) - filter by specific date
 */
router.get('/barbershop', authenticateBarbershop, async (req, res) => {
    try {
        // Extract date filter from query parameters
        const { date } = req.query;
        
        // Retrieve barbershop appointments with optional date filtering
        const appointmentService = new AppointmentService(req.db);
        const appointments = await appointmentService.getBarbershopAppointments(
            req.barbershop.barbershop_id, 
            date
        );
        res.json({ success: true, appointments });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /:id/status
 * Updates the status of an existing appointment
 * No authentication required (can be called by external systems)
 * 
 * Request body should include: status (new appointment status)
 */
router.put('/:id/status', async (req, res) => {
    try {
        // Extract new status from request body
        const { status } = req.body;
        
        // Update appointment status
        const appointmentService = new AppointmentService(req.db);
        const updated = await appointmentService.updateAppointmentStatus(req.params.id, status);
        
        // Check if appointment exists
        if (!updated) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        // Return success response
        res.json({ success: true, message: 'Appointment status updated' });
    } catch (error) {
        // Handle update errors
        res.status(500).json({ error: error.message });
    }
});

// Export the router for use in the main application
export default router;
