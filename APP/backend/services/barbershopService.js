import AuthService from './authService.js';

class BarbershopService {
    constructor(db) {
        this.db = db;
    }

    async createBarbershop(barbershopData) {
        const { 
            name, email, phone, password, address, latitude, longitude,
            responsible_person, id_document, owner_phone, description
        } = barbershopData;
        
        try {
            const existingBarbershop = await this.getBarbershopByEmail(email);
            if (existingBarbershop) {
                throw new Error('La barbería ya existe');
            }

            const password_hash = await AuthService.hashPassword(password);
            
            const query = `
                INSERT INTO barbershops (name, email, phone, password_hash, address, latitude, longitude,
                responsible_person, id_document, owner_phone, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            return new Promise((resolve, reject) => {
                this.db.query(query, [name, email, phone, password_hash, address, latitude, longitude,
                    responsible_person, id_document, owner_phone, description], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ barbershop_id: result.insertId, name, email });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    async getBarbershopByEmail(email) {
        const query = 'SELECT * FROM barbershops WHERE email = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async getBarbershopById(id) {
        const query = 'SELECT * FROM barbershops WHERE barbershop_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async getAllBarbershops(filters = {}) {
        let query = 'SELECT * FROM barbershops WHERE is_active = TRUE';
        const params = [];

        if (filters.latitude && filters.longitude && filters.radius) {
            query += ` HAVING (
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) <= ?`;
            params.push(filters.latitude, filters.longitude, filters.latitude, filters.radius);
        }

        query += ' ORDER BY rating_average DESC';

        return new Promise((resolve, reject) => {
            this.db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    async updateBarbershop(id, barbershopData) {
        const { 
            name, phone, address, latitude, longitude, responsible_person,
            owner_phone, description, profile_photo_url, cover_photo_url
        } = barbershopData;
        
        const query = `
            UPDATE barbershops 
            SET name = ?, phone = ?, address = ?, latitude = ?, longitude = ?,
                responsible_person = ?, owner_phone = ?, description = ?,
                profile_photo_url = ?, cover_photo_url = ?
            WHERE barbershop_id = ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, phone, address, latitude, longitude,
                responsible_person, owner_phone, description, profile_photo_url, cover_photo_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    async loginBarbershop(email, password) {
        try {
            const barbershop = await this.getBarbershopByEmail(email);
            if (!barbershop) {
                throw new Error('Barbería no encontrada');
            }

            const isValidPassword = await AuthService.comparePassword(password, barbershop.password_hash);
            if (!isValidPassword) {
                throw new Error('Contraseña incorrecta');
            }

            const token = AuthService.generateToken({
                barbershop_id: barbershop.barbershop_id,
                email: barbershop.email,
                type: 'barbershop'
            });

            const { password_hash, ...barbershopWithoutPassword } = barbershop;
            return { barbershop: barbershopWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }
}

export default BarbershopService;