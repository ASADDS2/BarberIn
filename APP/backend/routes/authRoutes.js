import express from 'express';
import passport from '../middleware/passport.js';

const router = express.Router();

// Ruta para iniciar autenticación con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google OAuth
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        // CORREGIDO: Redirigir a la ruta correcta del frontend
        const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        // Cambiar la ruta para que coincida con tu estructura
        res.redirect(`${redirectUrl}/src/views/dashboard_users.html?user=${req.user.user_id}`);
    }
);

// Ruta para logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error al destruir sesión' });
            }
            res.json({ success: true, message: 'Sesión cerrada exitosamente' });
        });
    });
});

// Ruta para verificar estado de autenticación
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        const { password_hash, ...userWithoutPassword } = req.user;
        res.json({ 
            authenticated: true, 
            user: userWithoutPassword 
        });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;