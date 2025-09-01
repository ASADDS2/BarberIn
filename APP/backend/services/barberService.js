class BarberService {
    constructor(db) {
        this.db = db;
    }

    async createBarber(barberData) {
        const { 
            barbershop_id, name, email, phone, description, specialties,
            qualification, profile_photo_url
        } = barberData;
        
        const query = `
            INSERT INTO barbers (barbershop_id, name, email, phone, description, specialties,
            qualification, profile_photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id, name, email, phone, description,
                specialties, qualification, profile_photo_url], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve({ barber_id: result.insertId, name });
                });
        });
    }

    async getBarbersByBarbershop(barbershop_id) {
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

    async getBarberById(id) {
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

    async updateBarber(id, barberData) {
        const { 
            name, email, phone, description, specialties, qualification,
            profile_photo_url, is_available
        } = barberData;
        
        const query = `
            UPDATE barbers 
            SET name = ?, email = ?, phone = ?, description = ?, specialties = ?,
                qualification = ?, profile_photo_url = ?, is_available = ?
            WHERE barber_id = ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, email, phone, description, specialties,
                qualification, profile_photo_url, is_available, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    async updateBarberAvailability(barber_id, status) {
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

    async getBarberSchedule(barber_id) {
        const query = 'SELECT * FROM barber_schedules WHERE barber_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barber_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    async setBarberSchedule(barber_id, schedules) {
        try {
            // First, deactivate all existing schedules
            await new Promise((resolve, reject) => {
                this.db.query('UPDATE barber_schedules SET is_active = FALSE WHERE barber_id = ?', 
                    [barber_id], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
            });

            // Insert new schedules
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

export default BarberService;