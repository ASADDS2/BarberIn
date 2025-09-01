/**
 * Service Routes
 * Defines all HTTP endpoints related to barbershop service operations including
 * creation, retrieval, updates, and deletion of services offered by barbershops.
 */

import express from 'express';  // We use `import` for express
import ServiceService from '../services/serviceService.js';  // Change `require` to `import` with .js extension
import { authenticateBarbershop } from '../middleware/auth.js';  // Change `require` to `import` with .js extension

// Create Express router instance
const router = express.Router();

/**
 * POST /
 * Creates a new service for the authenticated barbershop
 * Requires barbershop authentication via JWT token
 * 
 * Request body should include: name, price, duration_minutes, description (optional)
 */
router.post('/', authenticateBarbershop, async (req, res) => {
    try {
        // Create service service instance and prepare service data
        const serviceService = new ServiceService(req.db);
        const serviceData = { ...req.body, barbershop_id: req.barbershop.barbershop_id };
        
        // Create the service and return success response
        const service = await serviceService.createService(serviceData);
        res.status(201).json({ success: true, service });
    } catch (error) {
        // Handle creation errors
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /barbershop/:barbershop_id
 * Retrieves all services offered by a specific barbershop
 * No authentication required (public endpoint)
 * 
 * Path parameters: barbershop_id - ID of the barbershop to get services for
 */
router.get('/barbershop/:barbershop_id', async (req, res) => {
    try {
        // Retrieve services for the specified barbershop
        const serviceService = new ServiceService(req.db);
        const services = await serviceService.getServicesByBarbershop(req.params.barbershop_id);
        res.json({ success: true, services });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /:id
 * Retrieves a specific service by ID
 * No authentication required (public endpoint)
 * 
 * Path parameters: id - ID of the service to retrieve
 */
router.get('/:id', async (req, res) => {
    try {
        // Retrieve the specific service by ID
        const serviceService = new ServiceService(req.db);
        const service = await serviceService.getServiceById(req.params.id);
        
        // Check if service exists
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        // Return the service data
        res.json({ success: true, service });
    } catch (error) {
        // Handle retrieval errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /:id
 * Updates an existing service
 * Requires barbershop authentication via JWT token
 * 
 * Path parameters: id - ID of the service to update
 * Request body should include: name, price, duration_minutes, description (optional)
 */
router.put('/:id', authenticateBarbershop, async (req, res) => {
    try {
        // Update the service with new data
        const serviceService = new ServiceService(req.db);
        const updated = await serviceService.updateService(req.params.id, req.body);
        
        // Check if service exists
        if (!updated) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        // Return success response
        res.json({ success: true, message: 'Service updated successfully' });
    } catch (error) {
        // Handle update errors
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /:id
 * Deletes an existing service
 * Requires barbershop authentication via JWT token
 * 
 * Path parameters: id - ID of the service to delete
 */
router.delete('/:id', authenticateBarbershop, async (req, res) => {
    try {
        // Delete the service
        const serviceService = new ServiceService(req.db);
        const deleted = await serviceService.deleteService(req.params.id);
        
        // Check if service exists
        if (!deleted) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        // Return success response
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        // Handle deletion errors
        res.status(500).json({ error: error.message });
    }
});

// Export the router for use in the main application
export default router;  // Use `export default` to export the router
