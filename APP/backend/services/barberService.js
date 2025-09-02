/**
 * Barber Service
 * Handles all barber-related database operations including creation,
 * management, availability updates, and schedule management for barbershops.
 */

/**
 * BarberService class
 * Contains methods for managing barber data and operations
 */
class BarberService {
    
    /**
     * Constructor for BarberService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new barber for a barbershop
     * @param {Object} barberData - Barber data object containing all required fields
     * @returns {Promise<Object>} Created barber information
     * @throws {Error} If database operation fails
     */
    async createBarber(barberData) {
        const { 
            barbershop_id, name, email, phone, description, specialties,
            qualification, profile_photo_url
        } = barberData;
        
        // SQL query to insert new barber
        const query = `
            INSERT INTO barbers (barbershop_id, name, email, phone, description, specialties,
            qualification, profile_photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Execute the insert query
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id, name, email, phone, description,
                specialties, qualification, profile_photo_url], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve({ barber_id: result.insertId, name });
                });
        });
    }

    /**
     * Retrieves all active barbers for a specific barbershop with availability status
     * @param {number} barbershop_id - ID of the barbershop to get barbers for
     * @returns {Promise<Array>} Array of barbers with availability information
     * @throws {Error} If database operation fails
     */
    async getBarbersByBarbershop(barbershop_id) {
        // SQL query to get barbers with availability status, ordered by ranking and rating
        const query = `
            SELECT b.*, ba.status as availability_status
            FROM barbers b
            LEFT JOIN barber_availability ba ON b.barber_id = ba.barber_id
            WHERE b.barbershop_id = ? AND b.is_active = TRUE
            ORDER BY b.ranking_position ASC, b.rating_average DESC
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Retrieves a specific barber by ID with availability status
     * @param {number} id - Barber ID to search for
     * @returns {Promise<Object|null>} Barber object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getBarberById(id) {
        // SQL query to get barber with availability status
        const query = `
            SELECT b.*, ba.status as availability_status
            FROM barbers b
            LEFT JOIN barber_availability ba ON b.barber_id = ba.barber_id
            WHERE b.barber_id = ? AND b.is_active = TRUE
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Updates an existing barber's information
     * @param {number} id - Barber ID to update
     * @param {Object} barberData - Updated barber data
     * @returns {Promise<boolean>} True if update was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async updateBarber(id, barberData) {
        const { 
            name, email, phone, description, specialties, qualification,
            profile_photo_url, is_available
        } = barberData;
        
        // SQL query to update barber information
        const query = `
            UPDATE barbers 
            SET name = ?, email = ?, phone = ?, description = ?, specialties = ?,
                qualification = ?, profile_photo_url = ?, is_available = ?
            WHERE barber_id = ?
        `;
        
        // Execute the update query
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, email, phone, description, specialties,
                qualification, profile_photo_url, is_available, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    /**
     * Updates a barber's availability status
     * @param {number} barber_id - Barber ID to update availability for
     * @param {string} status - New availability status (active/inactive)
     * @returns {Promise<boolean>} True if update was successful
     * @throws {Error} If database operation fails
     */
    async updateBarberAvailability(barber_id, status) {
        // SQL query to insert or update availability status using ON DUPLICATE KEY
        const query = `
            INSERT INTO barber_availability (barber_id, status) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barber_id, status], (err, result) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    /**
     * Retrieves a barber's working schedule
     * @param {number} barber_id - Barber ID to get schedule for
     * @returns {Promise<Array>} Array of schedule entries for the barber
     * @throws {Error} If database operation fails
     */
    async getBarberSchedule(barber_id) {
        const query = 'SELECT * FROM barber_schedules WHERE barber_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barber_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Sets a barber's working schedule by replacing existing schedules
     * @param {number} barber_id - Barber ID to set schedule for
     * @param {Array} schedules - Array of schedule objects with day_of_week, start_time, end_time
     * @returns {Promise<boolean>} True if schedule was set successfully
     * @throws {Error} If database operation fails
     */
    async setBarberSchedule(barber_id, schedules) {
        try {
            // First, deactivate all existing schedules for the barber
            await new Promise((resolve, reject) => {
                this.db.query('UPDATE barber_schedules SET is_active = FALSE WHERE barber_id = ?', 
                    [barber_id], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
            });

            // Insert new schedules for the barber
            for (const schedule of schedules) {
                const query = `
                    INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    start_time = VALUES(start_time), 
                    end_time = VALUES(end_time), 
                    is_active = TRUE
                `;
                
                await new Promise((resolve, reject) => {
                    this.db.query(query, [barber_id, schedule.day_of_week, 
                        schedule.start_time, schedule.end_time], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}

// Export the BarberService class for use throughout the application
export default BarberService;