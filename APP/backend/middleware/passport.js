import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserService from '../services/userService.js';
import db from '../config/database.js';

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userService = new UserService(db);
        
        // Search if user already exists by email or google_id
        let user = await userService.getUserByGoogleId(profile.id);
        
        if (!user) {
            // If doesn't exist, search by email
            user = await userService.getUserByEmail(profile.emails[0].value);
            
            if (user) {
                // If exists by email, update with google_id
                await userService.updateGoogleId(user.user_id, profile.id);
                user.google_id = profile.id;
            } else {
                // Create new user
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
        console.error('Error in Google Strategy:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from session
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