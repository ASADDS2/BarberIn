/**
 * Service Service
 * Handles all service-related database operations for barbershops including
 * creation, retrieval, updates, and deletion of services offered by barbershops.
 */

/**
 * ServiceService class
 * Contains methods for managing barbershop service data and operations
 */
class ServiceService {
    
    /**
     * Constructor for ServiceService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new service for a barbershop
     * @param {Object} serviceData - Service data object containing all required fields
     * @returns {Promise<Object>} Created service information
     * @throws {Error} If database operation fails
     */
    async createService(serviceData) {
        const { 
            barbershop_id, name, description, price, duration_minutes,
            category, image_url
        } = serviceData;
        
        // SQL query to insert new service
        const query = `
            INSERT INTO services (barbershop_id, name, description, price, duration_minutes,
            category, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Execute the insert query
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id, name, description, price,
                duration_minutes, category, image_url], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve({ service_id: result.insertId, name });
                });
        });
    }

    /**
     * Retrieves all active services for a specific barbershop
     * @param {number} barbershop_id - ID of the barbershop to get services for
     * @returns {Promise<Array>} Array of services offered by the barbershop
     * @throws {Error} If database operation fails
     */
    async getServicesByBarbershop(barbershop_id) {
        // SQL query to get services by barbershop, ordered by category and name
        const query = `
            SELECT * FROM services 
            WHERE barbershop_id = ? AND is_active = TRUE 
            ORDER BY category, name
        `;
        
        // Execute the select query
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Retrieves a specific service by ID
     * @param {number} id - Service ID to search for
     * @returns {Promise<Object|null>} Service object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getServiceById(id) {
        const query = 'SELECT * FROM services WHERE service_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Updates an existing service's information
     * @param {number} id - Service ID to update
     * @param {Object} serviceData - Updated service data
     * @returns {Promise<boolean>} True if update was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async updateService(id, serviceData) {
        const { 
            name, description, price, duration_minutes, category, image_url
        } = serviceData;
        
        // SQL query to update service information
        const query = `
            UPDATE services 
            SET name = ?, description = ?, price = ?, duration_minutes = ?,
                category = ?, image_url = ?
            WHERE service_id = ?
        `;
        
        // Execute the update query
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, description, price, duration_minutes,
                category, image_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    /**
     * Soft deletes a service by setting is_active to FALSE
     * @param {number} id - Service ID to delete
     * @returns {Promise<boolean>} True if deletion was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async deleteService(id) {
        // Soft delete by setting is_active to FALSE instead of removing the record
        const query = 'UPDATE services SET is_active = FALSE WHERE service_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            });
        });
    }
}

// Export the ServiceService class for use throughout the application
export default ServiceService;