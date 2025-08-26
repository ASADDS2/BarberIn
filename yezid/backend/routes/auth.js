// imports
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
// imports google
import passport from "passport";
import "../passport.js"; // import config of passport.js

const router = express.Router();

// local registers
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "INSERT INTO users (email, password_hash, provider, name) VALUES (?, ?, 'local', ?)",
            [email, hashedPassword, name]
        );
        res.json({ id: result.insertId, email });
    } catch (err) {
        res.status(400).json({ error: "El usuario ya existe o error en registro" });
    }
});

// Login local
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Iniciar login con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback de Google
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    // Generar JWT
    const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    //verificar el token generado
    console.log("taken: ", token);

    // Redirigir al frontend con el token
    res.redirect(`http://localhost:3000?token=${token}`);
}
);

export default router;