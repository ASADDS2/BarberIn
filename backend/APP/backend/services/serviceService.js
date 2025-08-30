class ServiceService {
    constructor(db) {
        this.db = db;
    }

    async createService(serviceData) {
        const { 
            barbershop_id, name, description, price, duration_minutes,
            category, image_url
        } = serviceData;
        
        const query = `
            INSERT INTO services (barbershop_id, name, description, price, duration_minutes,
            category, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id, name, description, price,
                duration_minutes, category, image_url], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve({ service_id: result.insertId, name });
                });
        });
    }

    async getServicesByBarbershop(barbershop_id) {
        const query = `
            SELECT * FROM services 
            WHERE barbershop_id = ? AND is_active = TRUE 
            ORDER BY category, name
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [barbershop_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    async getServiceById(id) {
        const query = 'SELECT * FROM services WHERE service_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async updateService(id, serviceData) {
        const { 
            name, description, price, duration_minutes, category, image_url
        } = serviceData;
        
        const query = `
            UPDATE services 
            SET name = ?, description = ?, price = ?, duration_minutes = ?,
                category = ?, image_url = ?
            WHERE service_id = ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [name, description, price, duration_minutes,
                category, image_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    async deleteService(id) {
        const query = 'UPDATE services SET is_active = FALSE WHERE service_id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            });
        });
    }
}
export default ServiceService;