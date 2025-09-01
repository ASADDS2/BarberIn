import express from 'express';
import passport from '../middleware/passport.js';
import AuthService from '../services/authService.js';

const router = express.Router();

// Ruta para iniciar autenticación con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google OAuth
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        try {
            // Generar token JWT para el usuario autenticado
            const token = AuthService.generateToken({
                user_id: req.user.user_id,
                email: req.user.email,
                type: 'user'
            });

            // Preparar datos del usuario sin información sensible
            const { password_hash, ...userWithoutPassword } = req.user;

            // Crear URL de redirección con datos codificados
            const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const userData = encodeURIComponent(JSON.stringify(userWithoutPassword));
            const encodedToken = encodeURIComponent(token);
            
            // Redirigir al frontend con token y datos del usuario
            res.redirect(`${redirectUrl}/frontend/views/login.html?success=google_auth&token=${encodedToken}&userData=${userData}`);
        } catch (error) {
            console.error('Error en Google callback:', error);
            const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${redirectUrl}/frontend/views/login.html?error=auth_failed`);
        }
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