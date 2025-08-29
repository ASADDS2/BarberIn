const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    }
}

module.exports = AuthService;