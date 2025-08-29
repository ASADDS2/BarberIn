class AppointmentService {
    constructor(db) {
        this.db = db;
    }

    async createAppointment(appointmentData) {
        const { 
            user_id, barber_id, barbershop_id, service_id,
            appointment_date, appointment_time, notes
        } = appointmentData;
        
        try {
            // Check if the time slot is available
            const isAvailable = await this.checkTimeSlotAvailability(
                barber_id, appointment_date, appointment_time
            );
            
            if (!isAvailable) {
                throw new Error('El horario no está disponible');
            }

            // Get service price if provided
            let total_price = 0;
            if (service_id) {
                const service = await this.getServiceById(service_id);
                total_price = service?.price || 0;
            }

            const query = `
                INSERT INTO appointments (user_id, barber_id, barbershop_id, service_id,
                appointment_date, appointment_time, total_price, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
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

    async checkTimeSlotAvailability(barber_id, date, time) {
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

    async getServiceById(service_id) {
        const query = 'SELECT * FROM services WHERE service_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [service_id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async getUserAppointments(user_id, status = null) {
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
        
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    async getBarbershopAppointments(barbershop_id, date = null) {
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
        
        if (date) {
            query += ' AND a.appointment_date = ?';
            params.push(date);
        }
        
        query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    async updateAppointmentStatus(appointment_id, status) {
        const query = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [status, appointment_id], (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            });
        });
    }

    async getBarberAvailableSlots(barber_id, date) {
        // Get barber schedule for the day
        const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'long' });
        
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

        if (!schedule) {
            return [];
        }

        // Get existing appointments for that day
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
        
        while (start < end) {
            const timeString = start.toTimeString().slice(0, 5);
            const isBooked = appointments.some(apt => 
                apt.toString().slice(0, 5) === timeString
            );
            
            if (!isBooked) {
                availableSlots.push(timeString);
            }
            
            start.setMinutes(start.getMinutes() + 30);
        }

        return availableSlots;
    }
}

module.exports = AppointmentService;