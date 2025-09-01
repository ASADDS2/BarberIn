import AuthService from './authService.js';

class UserService {
    constructor(db) {
        this.db = db;
    }

    async createUser(userData) {
        const { first_name, last_name, email, phone, password, address, age_range } = userData;
        
        try {
            // Check if user already exists
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }

            const password_hash = await AuthService.hashPassword(password);
            
            const query = `
                INSERT INTO users (first_name, last_name, email, phone, password_hash, address, age_range)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            return new Promise((resolve, reject) => {
                this.db.query(query, [first_name, last_name, email, phone, password_hash, address, age_range], 
                    (err, result) => {
                        if (err) reject(err);
                        else resolve({ user_id: result.insertId, email, first_name, last_name });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async getUserById(id) {
        const query = 'SELECT * FROM users WHERE user_id = ? AND is_active = TRUE';
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }

    async updateUser(id, userData) {
        const { first_name, last_name, phone, address, age_range, profile_photo_url } = userData;
        
        const query = `
            UPDATE users 
            SET first_name = ?, last_name = ?, phone = ?, address = ?, age_range = ?, profile_photo_url = ?
            WHERE user_id = ?
        `;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, [first_name, last_name, phone, address, age_range, profile_photo_url, id], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.affectedRows > 0);
                });
        });
    }

    async loginUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isValidPassword = await AuthService.comparePassword(password, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Contraseña incorrecta');
            }

            const token = AuthService.generateToken({
                user_id: user.user_id,
                email: user.email,
                type: 'user'
            });

            const { password_hash, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;  // Usar export default
