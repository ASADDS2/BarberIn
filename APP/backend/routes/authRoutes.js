import express from 'express';
import passport from '../middleware/passport.js';
import AuthService from '../services/authService.js';

const router = express.Router();

// Route to initiate Google authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        try {
            // Generate JWT token for authenticated user
            const token = AuthService.generateToken({
                user_id: req.user.user_id,
                email: req.user.email,
                type: 'user'
            });

            // Prepare user data without sensitive information
            const { password_hash, ...userWithoutPassword } = req.user;

            // Create redirect URL with encoded data
            const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const userData = encodeURIComponent(JSON.stringify(userWithoutPassword));
            const encodedToken = encodeURIComponent(token);
            
            // Redirect to frontend with token and user data
            res.redirect(`${redirectUrl}/frontend/views/login.html?success=google_auth&token=${encodedToken}&userData=${userData}`);
        } catch (error) {
            console.error('Error in Google callback:', error);
            const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${redirectUrl}/frontend/views/login.html?error=auth_failed`);
        }
    }
);

// Logout route
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error destroying session' });
            }
            res.json({ success: true, message: 'Session closed successfully' });
        });
    });
});

// Route to check authentication status
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