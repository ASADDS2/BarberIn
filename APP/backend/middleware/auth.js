import AuthService from '../services/authService.js';

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = AuthService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const authenticateBarbershop = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = AuthService.verifyToken(token);
        if (decoded.type !== 'barbershop') {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.barbershop = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Change to export default
export { authenticateUser, authenticateBarbershop };
