/**
 * Appointment Service
 * Handles all appointment-related database operations including creation,
 * scheduling, availability checking, and management of appointments between users and barbers.
 */

/**
 * AppointmentService class
 * Contains methods for managing appointment data and operations
 */
class AppointmentService {
    
    /**
     * Constructor for AppointmentService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new appointment
     * @param {Object} appointmentData - Appointment data object containing all required fields
     * @returns {Promise<Object>} Created appointment information
     * @throws {Error} If time slot is not available or database operation fails
     */
    async createAppointment(appointmentData) {
        const { 
            user_id, barber_id, barbershop_id, service_id,
            appointment_date, appointment_time, notes
        } = appointmentData;
        
        try {
            // Check if the requested time slot is available for the barber
            const isAvailable = await this.checkTimeSlotAvailability(
                barber_id, appointment_date, appointment_time
            );
            
            if (!isAvailable) {
                throw new Error('The time slot is not available');
            }

            // Get service price if service_id is provided
            let total_price = 0;
            if (service_id) {
                const service = await this.getServiceById(service_id);
                total_price = service?.price || 0;
            }

            // SQL query to insert new appointment
            const query = `
                INSERT INTO appointments (user_id, barber_id, barbershop_id, service_id,
                appointment_date, appointment_time, total_price, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the insert query
            return new Promise((resolve, reject) => {
                this.db.query(query, [user_id, barber_id, barbershop_id, service_id,
                    appointment_date, appointment_time, total_price, notes], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ appointment_id: result.insertId });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if a specific time slot is available for a barber
     * @param {number} barber_id - Barber ID to check availability for
     * @param {string} date - Date to check (YYYY-MM-DD format)
     * @param {string} time - Time to check (HH:MM format)
     * @returns {Promise<boolean>} True if time slot is available, false otherwise
     * @throws {Error} If database operation fails
     */
    async checkTimeSlotAvailability(barber_id, date, time) {
        // SQL query to check if time slot is already booked
        const query = `
            SELECT COUNT(*) as count 
            FROM appointments 
            WHERE barber_id = ? AND appointment_date = ? AND appointment_time = ? 
            AND status NOT IN ('cancelled', 'no_show')
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barber_id, date, time], (err, results) => {
                if (err) reject(err);
                else resolve(results[0].count === 0);
            });
        });
    }

    /**
     * Retrieves a service by ID
     * @param {number} service_id - Service ID to search for
     * @returns {Promise<Object|null>} Service object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getServiceById(service_id) {
        const query = 'SELECT * FROM services WHERE service_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [service_id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Retrieves all appointments for a specific user with optional status filtering
     * @param {number} user_id - User ID to get appointments for
     * @param {string} status - Optional status filter (e.g., 'confirmed', 'completed', 'cancelled')
     * @returns {Promise<Array>} Array of appointments with barber, barbershop, and service information
     * @throws {Error} If database operation fails
     */
    async getUserAppointments(user_id, status = null) {
        // Base query to get appointments with related information
        let query = `
            SELECT a.*, b.name as barber_name, bs.name as barbershop_name,
                   s.name as service_name, s.price as service_price
            FROM appointments a
            JOIN barbers b ON a.barber_id = b.barber_id
            JOIN barbershops bs ON a.barbershop_id = bs.barbershop_id
            LEFT JOIN services s ON a.service_id = s.service_id
            WHERE a.user_id = ?
        `;
        
        const params = [user_id];
        
        // Add status filter if provided
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }
        
        // Order by date and time (most recent first)
        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Retrieves all appointments for a specific barbershop with optional date filtering
     * @param {number} barbershop_id - Barbershop ID to get appointments for
     * @param {string} date - Optional date filter (YYYY-MM-DD format)
     * @returns {Promise<Array>} Array of appointments with barber, user, and service information
     * @throws {Error} If database operation fails
     */
    async getBarbershopAppointments(barbershop_id, date = null) {
        // Base query to get appointments with related information
        let query = `
            SELECT a.*, b.name as barber_name, u.first_name, u.last_name, u.phone,
                   s.name as service_name
            FROM appointments a
            JOIN barbers b ON a.barber_id = b.barber_id
            JOIN users u ON a.user_id = u.user_id
            LEFT JOIN services s ON a.service_id = s.service_id
            WHERE a.barbershop_id = ?
        `;
        
        const params = [barbershop_id];
        
        // Add date filter if provided
        if (date) {
            query += ' AND a.appointment_date = ?';
            params.push(date);
        }
        
        // Order by date and time (earliest first)
        query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Updates the status of an existing appointment
     * @param {number} appointment_id - Appointment ID to update
     * @param {string} status - New appointment status
     * @returns {Promise<boolean>} True if update was successful, false otherwise
     * @throws {Error} If database operation fails
     */
    async updateAppointmentStatus(appointment_id, status) {
        const query = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [status, appointment_id], (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            });
        });
    }

    /**
     * Gets available time slots for a barber on a specific date
     * @param {number} barber_id - Barber ID to get available slots for
     * @param {string} date - Date to check (YYYY-MM-DD format)
     * @returns {Promise<Array>} Array of available time slots in HH:MM format
     * @throws {Error} If database operation fails
     */
    async getBarberAvailableSlots(barber_id, date) {
        // Get the day of the week for the specified date
        const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' });
        
        // Get barber's schedule for the specific day of the week
        const scheduleQuery = `
            SELECT start_time, end_time 
            FROM barber_schedules 
            WHERE barber_id = ? AND day_of_week = ? AND is_active = TRUE
        `;
        
        const schedule = await new Promise((resolve, reject) => {
            this.db.query(scheduleQuery, [barber_id, dayOfWeek], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });

        // If no schedule exists for this day, return empty array
        if (!schedule) {
            return [];
        }

        // Get existing appointments for the barber on the specified date
        const appointmentsQuery = `
            SELECT appointment_time 
            FROM appointments 
            WHERE barber_id = ? AND appointment_date = ? 
            AND status NOT IN ('cancelled', 'no_show')
        `;
        
        const appointments = await new Promise((resolve, reject) => {
            this.db.query(appointmentsQuery, [barber_id, date], (err, results) => {
                if (err) reject(err);
                else resolve(results.map(r => r.appointment_time));
            });
        });

        // Generate available time slots (assuming 30-minute intervals)
        const availableSlots = [];
        const start = new Date(`2000-01-01 ${schedule.start_time}`);
        const end = new Date(`2000-01-01 ${schedule.end_time}`);
        
        // Iterate through time slots and check availability
        while (start < end) {
            const timeString = start.toTimeString().slice(0, 5);
            const isBooked = appointments.some(apt => 
                apt.toString().slice(0, 5) === timeString
            );
            
            // Add time slot if it's not already booked
            if (!isBooked) {
                availableSlots.push(timeString);
            }
            
            // Move to next 30-minute slot
            start.setMinutes(start.getMinutes() + 30);
        }

        return availableSlots;
    }
}

// Export the AppointmentService class for use throughout the application
export default AppointmentService;