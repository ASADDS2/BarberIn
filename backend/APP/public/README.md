BARBERIN Backend

Backend for the BARBERIN application - Appointment booking system for barbershops.

Features

Authentication: Login/registration for users and barbershops

Barbershop Management: Full CRUD for barbershops

Barber Management: Manage barbers, schedules, and availability

Appointment System: Booking, confirmation, and appointment management

Services: Service catalog by barbershop

Reviews: Rating and commenting system

RESTful API: Well-structured endpoints

Installation

Clone the repository:

git clone [your-repository]
cd barberin-backend


Install dependencies:

npm install


Set up the database:

Create the MySQL database using the DatabaseBarberin.sql file

Copy .env.example to .env and configure the variables

Run the server:

# Development
npm run dev

# Production
npm start

Project Structure
backend/
├── app.js              # Main file
├── config/
│   └── database.js     # Database configuration
├── middleware/
│   └── auth.js         # Authentication middleware
├── routes/
│   ├── userRoutes.js
│   ├── barbershopRoutes.js
│   ├── barberRoutes.js
│   ├── appointmentRoutes.js
│   ├── serviceRoutes.js
│   └── reviewRoutes.js
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── barbershopService.js
│   ├── barberService.js
│   ├── appointmentService.js
│   ├── serviceService.js
│   └── reviewService.js
├── utils/
│   ├── validators.js
│   └── responseHelper.js
├── package.json
├── .env
└── README.md

API Endpoints
Users

POST /api/users/register - Register user

POST /api/users/login - User login

GET /api/users/profile - Get profile (auth required)

PUT /api/users/profile - Update profile (auth required)

Barbershops

POST /api/barbershops/register - Register barbershop

POST /api/barbershops/login - Barbershop login

GET /api/barbershops - List barbershops

GET /api/barbershops/:id - Get barbershop by ID

GET /api/barbershops/profile/me - Barbershop profile (auth required)

PUT /api/barbershops/profile - Update barbershop profile (auth required)

Barbers

POST /api/barbers - Create barber (auth required for barbershop)

GET /api/barbers/barbershop/:id - Get barbers by barbershop

GET /api/barbers/:id - Get barber by ID

PUT /api/barbers/:id - Update barber (auth required)

PUT /api/barbers/:id/availability - Update availability

GET /api/barbers/:id/schedule - Get barber schedule

POST /api/barbers/:id/schedule - Set barber schedule

GET /api/barbers/:id/availability/:date - Available slots

Appointments

POST /api/appointments - Create appointment (auth required for user)

GET /api/appointments/user - User appointments (auth required)

GET /api/appointments/barbershop - Barbershop appointments (auth required)

PUT /api/appointments/:id/status - Update appointment status

Services

POST /api/services - Create service (auth required for barbershop)

GET /api/services/barbershop/:id - Get services by barbershop

GET /api/services/:id - Get service by ID

PUT /api/services/:id - Update service (auth required)

DELETE /api/services/:id - Delete service (auth required)

Reviews

POST /api/reviews - Create review (auth required for user)

GET /api/reviews/barber/:id - Get reviews of barber

GET /api/reviews/barbershop/:id - Get reviews of barbershop

Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the header:

Authorization: Bearer <token>

Environment Variables
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Barberin
JWT_SECRET=your_jwt_secret_key
PORT=3000

Contribution

Fork the project

Create a branch for your feature (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

##// backend/app.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Barberin'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


📦 To Install

Install dependencies:

npm install express mysql2 cors bcryptjs jsonwebtoken dotenv
npm install --save-dev nodemon


Set up the .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Barberin
JWT_SECRET=your_jwt_secret_key
PORT=3000


Run the server:

npm run dev  # For development
npm start    # For production


🔗 Main Endpoints

Users: /api/users/*
Barbershops: /api/barbershops/*
Barbers: /api/barbers/*
Appointments: /api/appointments/*
Services: /api/services/*
Reviews: /api/reviews/*

The backend is fully ready to connect with your frontend in vanilla JavaScript, CSS, and HTML. All endpoints return JSON with a consistent structure and appropriate error handling.