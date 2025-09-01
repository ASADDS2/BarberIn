import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserService from '../services/userService.js';
import db from '../config/database.js';

// Configuración de la estrategia de Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userService = new UserService(db);
        
        // Buscar si el usuario ya existe por email o google_id
        let user = await userService.getUserByGoogleId(profile.id);
        
        if (!user) {
            // Si no existe, buscar por email
            user = await userService.getUserByEmail(profile.emails[0].value);
            
            if (user) {
                // Si existe por email, actualizar con google_id
                await userService.updateGoogleId(user.user_id, profile.id);
                user.google_id = profile.id;
            } else {
                // Crear nuevo usuario
                const userData = {
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    google_id: profile.id,
                    profile_photo_url: profile.photos[0]?.value,
                    provider: 'google'
                };
                
                user = await userService.createGoogleUser(userData);
            }
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Error en Google Strategy:', error);
        return done(error, null);
    }
}));

// Serializar usuario para la sesión
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserializar usuario de la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const userService = new UserService(db);
        const user = await userService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;