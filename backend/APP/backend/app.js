const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Barberin',
    acquireTimeout: 60000,
    timeout: 60000
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos MySQL');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'BARBERIN API'
    });
});

// Make db available to routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const barbershopRoutes = require('./routes/barbershopRoutes');
const barberRoutes = require('./routes/barberRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/users', userRoutes);
app.use('/api/barbershops', barbershopRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    db.end(() => {
        console.log('Conexión a base de datos cerrada.');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor BARBERIN corriendo en puerto ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;