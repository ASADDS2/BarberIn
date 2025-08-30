import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

// Desactivar los warnings de Node.js
process.emitWarning = () => {};

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
    password: process.env.DB_PASSWORD || 'Qwe.123*',
    database: process.env.DB_NAME || 'Barberin'
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

// Función para cargar rutas de forma asíncrona
async function loadRoutes() {
    try {
        // Cargar todas las rutas usando imports dinámicos
        const [
            userRoutes,
            barbershopRoutes,
            barberRoutes,
            appointmentRoutes,
            serviceRoutes,
            reviewRoutes
        ] = await Promise.all([
            import('./routes/userRoutes.js'),
            import('./routes/barbershopRoutes.js'),
            import('./routes/barberRoutes.js'),
            import('./routes/appointmentRoutes.js'),
            import('./routes/serviceRoutes.js'),
            import('./routes/reviewRoutes.js')
        ]);

        // Registrar las rutas
        app.use('/api/users', userRoutes.default);
        app.use('/api/barbershops', barbershopRoutes.default);
        app.use('/api/barbers', barberRoutes.default);
        app.use('/api/appointments', appointmentRoutes.default);
        app.use('/api/services', serviceRoutes.default);
        app.use('/api/reviews', reviewRoutes.default);

        console.log('✅ Todas las rutas cargadas correctamente');

        // 404 handler
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint no encontrado',
                path: req.originalUrl,
                method: req.method
            });
        });

        // Error handling middleware
        app.use(errorHandler);

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor BARBERIN corriendo en puerto ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('Error cargando rutas:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    db.end(() => {
        console.log('Conexión a base de datos cerrada.');
        process.exit(0);
    });
});

// Cargar rutas y iniciar servidor
loadRoutes();

export default app;