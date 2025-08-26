// backend/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verificar si ya existe usuario con este google_id
        const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [profile.id]);
        let user = rows[0];

        if (!user) {
          // Si no existe, crearlo o vincular por email
          const email = profile.emails[0].value;
          const name = profile.displayName;
          const avatar = profile.photos[0].value;

          const [result] = await pool.query(
            `INSERT INTO users (email, provider, google_id, name, avatar_url, email_verified) 
             VALUES (?, 'google', ?, ?, ?, 1)
             ON DUPLICATE KEY UPDATE google_id = VALUES(google_id), provider = 'google'`,
            [email, profile.id, name, avatar]
          );

          const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId || result.insertId]);
          user = newUser[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
