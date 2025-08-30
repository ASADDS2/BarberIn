class ReviewService {
    constructor(db) {
        this.db = db;
    }

    async createReview(reviewData) {
        const { 
            appointment_id, user_id, barber_id, barbershop_id,
            rating, comment
        } = reviewData;
        
        try {
            // Check if review already exists for this appointment
            const existingReview = await this.getReviewByAppointment(appointment_id);
            if (existingReview) {
                throw new Error('Ya existe una reseña para esta cita');
            }

            const query = `
                INSERT INTO reviews (appointment_id, user_id, barber_id, barbershop_id,
                rating, comment)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
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

    async getReviewByAppointment(appointment_id) {
        const query = 'SELECT * FROM reviews WHERE appointment_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [appointment_id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async getBarberReviews(barber_id, limit = 10) {
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

    async getBarbershopReviews(barbershop_id, limit = 10) {
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

export default ReviewService;
