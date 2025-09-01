/**
 * Review Service
 * Handles all review-related database operations including creation,
 * retrieval, and management of reviews for barbers and barbershops.
 */

/**
 * ReviewService class
 * Contains methods for managing review data and operations
 */
class ReviewService {
    
    /**
     * Constructor for ReviewService
     * @param {Object} db - Database connection object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * Creates a new review for an appointment
     * @param {Object} reviewData - Review data object containing all required fields
     * @returns {Promise<Object>} Created review information
     * @throws {Error} If review already exists for the appointment or database operation fails
     */
    async createReview(reviewData) {
        const { 
            appointment_id, user_id, barber_id, barbershop_id,
            rating, comment
        } = reviewData;
        
        try {
            // Check if review already exists for this appointment
            const existingReview = await this.getReviewByAppointment(appointment_id);
            if (existingReview) {
                throw new Error('A review already exists for this appointment');
            }

            // SQL query to insert new review
            const query = `
                INSERT INTO reviews (appointment_id, user_id, barber_id, barbershop_id,
                rating, comment)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the insert query
            return new Promise((resolve, reject) => {
                this.db.query(query, [appointment_id, user_id, barber_id, barbershop_id,
                    rating, comment], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ review_id: result.insertId });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a review by appointment ID
     * @param {number} appointment_id - Appointment ID to search for
     * @returns {Promise<Object|null>} Review object if found, null otherwise
     * @throws {Error} If database operation fails
     */
    async getReviewByAppointment(appointment_id) {
        const query = 'SELECT * FROM reviews WHERE appointment_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [appointment_id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    /**
     * Retrieves reviews for a specific barber with user information
     * @param {number} barber_id - Barber ID to get reviews for
     * @param {number} limit - Maximum number of reviews to return (default: 10)
     * @returns {Promise<Array>} Array of reviews with user information
     * @throws {Error} If database operation fails
     */
    async getBarberReviews(barber_id, limit = 10) {
        // SQL query to get barber reviews with user information, ordered by creation date
        const query = `
            SELECT r.*, u.first_name, u.last_name, u.profile_photo_url
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.barber_id = ?
            ORDER BY r.created_at DESC
            LIMIT ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barber_id, limit], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Retrieves reviews for a specific barbershop with user and barber information
     * @param {number} barbershop_id - Barbershop ID to get reviews for
     * @param {number} limit - Maximum number of reviews to return (default: 10)
     * @returns {Promise<Array>} Array of reviews with user and barber information
     * @throws {Error} If database operation fails
     */
    async getBarbershopReviews(barbershop_id, limit = 10) {
        // SQL query to get barbershop reviews with user and barber information, ordered by creation date
        const query = `
            SELECT r.*, u.first_name, u.last_name, u.profile_photo_url,
                   b.name as barber_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            JOIN barbers b ON r.barber_id = b.barber_id
            WHERE r.barbershop_id = ?
            ORDER BY r.created_at DESC
            LIMIT ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id, limit], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

// Export the ReviewService class for use throughout the application
export default ReviewService;
