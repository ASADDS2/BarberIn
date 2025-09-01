import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import db from './config/database.js';

dotenv.config();

// Disable Node.js warnings
process.emitWarning = () => {};

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Database connection is now imported from config/database.js
// The pool is already configured and tested in the database.js file

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

// Function to load routes asynchronously
async function loadRoutes() {
    try {
        // Load all routes using dynamic imports
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

        // Register the routes
        app.use('/api/users', userRoutes.default);
        app.use('/api/barbershops', barbershopRoutes.default);
        app.use('/api/barbers', barberRoutes.default);
        app.use('/api/appointments', appointmentRoutes.default);
        app.use('/api/services', serviceRoutes.default);
        app.use('/api/reviews', reviewRoutes.default);

        console.log('✅ All routes loaded successfully');

        // 404 handler
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint not found',
                path: req.originalUrl,
                method: req.method
            });
        });

        // Error handling middleware
        app.use(errorHandler);

        // Start server
        app.listen(PORT, () => {
            console.log(`BARBERIN server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('Error loading routes:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Closing server...');
    db.end(() => {
        console.log('Connection pool closed.');
        process.exit(0);
    });
});

// Load routes and start server
loadRoutes();

export default app;