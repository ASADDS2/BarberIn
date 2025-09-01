# 🪒 BARBERIN - Barbershop Appointment Booking System

A comprehensive web application for managing barbershop appointments, built with Node.js, Express, MySQL, and vanilla JavaScript.

![BARBERIN Logo](https://img.shields.io/badge/BARBERIN-Barbershop%20Appointment%20System-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-5.x-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

BARBERIN is a full-stack web application designed to streamline the appointment booking process for barbershops. The system allows users to discover nearby barbershops, book appointments with their preferred barbers, and manage their grooming services efficiently.

### Key Benefits:
- **For Customers**: Easy appointment booking, barber selection, and service management
- **For Barbershops**: Complete business management, schedule optimization, and customer relationship tools
- **For Barbers**: Individual profile management, portfolio showcase, and availability control

## ✨ Features

### 🔐 Authentication & User Management
- **Dual User Types**: Separate registration and login for customers and barbershops
- **JWT Authentication**: Secure token-based authentication system
- **Profile Management**: Complete user and barbershop profile customization
- **Password Security**: Bcrypt hashing for secure password storage

### 🏪 Barbershop Management
- **Business Profiles**: Complete barbershop information with photos and descriptions
- **Location Services**: GPS coordinates for map integration
- **Service Catalog**: Manage haircuts, beard trims, styling, and treatments
- **Rating System**: Customer reviews and rating aggregation
- **Business Analytics**: Appointment tracking and performance metrics

### 👨‍💼 Barber Management
- **Individual Profiles**: Personal barber profiles with specialties and qualifications
- **Portfolio Showcase**: Gallery of previous work and haircut styles
- **Schedule Management**: Flexible working hours and availability settings
- **Real-time Status**: Live availability updates (available, busy, break, offline)
- **Performance Tracking**: Rating averages and review management

### 📅 Appointment System
- **Smart Booking**: Real-time availability checking and slot reservation
- **Service Selection**: Choose from available services with pricing
- **Status Tracking**: Complete appointment lifecycle (pending, confirmed, in-progress, completed, cancelled)
- **Reminder System**: Automated appointment notifications
- **Cancellation Management**: Flexible booking modifications

### 🗺️ Location & Discovery
- **Google Maps Integration**: Interactive map for barbershop discovery
- **Geolocation Services**: Find nearby barbershops based on location
- **Search Functionality**: Advanced search with filters and preferences
- **Favorites System**: Save preferred barbershops and barbers

### ⭐ Review & Rating System
- **Customer Reviews**: Post-appointment feedback and ratings
- **Quality Assurance**: Maintain service standards through feedback
- **Rating Aggregation**: Automatic calculation of average ratings
- **Review Management**: Moderation and response capabilities

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 5.x
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt.js
- **CORS**: Cross-Origin Resource Sharing enabled

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with modern design principles
- **Maps**: Google Maps API integration
- **UI/UX**: Responsive design with mobile-first approach

### Database
- **RDBMS**: MySQL with optimized schema design
- **Indexing**: Performance-optimized database indexes
- **Triggers**: Automated rating calculations
- **Foreign Keys**: Referential integrity enforcement

## 📁 Project Structure

```
BarberIn/
├── backend/
│   └── APP/
│       ├── backend/
│       │   ├── app.js                 # Main server file
│       │   ├── config/
│       │   │   └── database.js        # Database configuration
│       │   ├── controllers/           # Business logic controllers
│       │   ├── middleware/            # Authentication & validation
│       │   ├── routes/                # API route definitions
│       │   ├── services/              # Business logic services
│       │   └── utils/                 # Helper functions
│       ├── frontend/
│       │   ├── src/
│       │   │   ├── css/              # Stylesheets
│       │   │   └── js/               # JavaScript files
│       │   └── views/                # HTML templates
│       ├── public/                   # Static assets
│       └── schemas/
│           └── DatabaseBarberin.sql  # Database schema
├── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- MySQL 8.0 or higher
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/barberin.git
cd barberin
```

### Step 2: Install Dependencies
```bash
cd backend/APP/backend
npm install
```

### Step 3: Database Setup
```bash
# Create and configure MySQL database
mysql -u root -p < ../schemas/DatabaseBarberin.sql
```

### Step 4: Environment Configuration
Create a `.env` file in `backend/APP/backend/`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Barberin

# Server Configuration
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_2024

# Frontend Configuration
FRONTEND_URL=http://localhost:3001
```

### Step 5: Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🗄️ Database Setup

The application uses a comprehensive MySQL schema with the following main tables:

### Core Tables
- **users**: Customer profiles and authentication
- **barbershops**: Business information and management
- **barbers**: Individual barber profiles and schedules
- **services**: Service catalog with pricing
- **appointments**: Booking management and status tracking
- **reviews**: Customer feedback and ratings

### Supporting Tables
- **barber_schedules**: Working hours and availability
- **barber_portfolio**: Work showcase and gallery
- **user_favorites**: Saved preferences
- **barber_availability**: Real-time status tracking
- **products**: Product catalog management

### Database Features
- **Referential Integrity**: Foreign key constraints
- **Performance Optimization**: Strategic indexing
- **Automated Calculations**: Triggers for rating updates
- **Data Validation**: Check constraints and enums

## ⚙️ Configuration

### Backend Configuration
The application supports multiple configuration options:

```javascript
// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Qwe.123*',
    database: process.env.DB_NAME || 'Barberin',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};
```

### CORS Configuration
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
```

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication
```http
POST /api/users/register
POST /api/users/login
GET /api/users/profile
PUT /api/users/profile
```

#### Barbershop Authentication
```http
POST /api/barbershops/register
POST /api/barbershops/login
GET /api/barbershops/profile/me
PUT /api/barbershops/profile
```

### Barbershop Management
```http
GET /api/barbershops
GET /api/barbershops/:id
```

### Barber Management
```http
POST /api/barbers
GET /api/barbers/barbershop/:id
GET /api/barbers/:id
PUT /api/barbers/:id
PUT /api/barbers/:id/availability
GET /api/barbers/:id/schedule
POST /api/barbers/:id/schedule
GET /api/barbers/:id/availability/:date
```

### Appointment Management
```http
POST /api/appointments
GET /api/appointments/user
GET /api/appointments/barbershop
PUT /api/appointments/:id/status
```

### Service Management
```http
POST /api/services
GET /api/services/barbershop/:id
GET /api/services/:id
PUT /api/services/:id
DELETE /api/services/:id
```

### Review System
```http
POST /api/reviews
GET /api/reviews/barber/:id
GET /api/reviews/barbershop/:id
```

### Health Check
```http
GET /health
```

## 🎨 Frontend Features

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Interactive Maps**: Google Maps integration for location services
- **Real-time Updates**: Live status updates and notifications

### Key Pages
1. **Login/Register**: Dual authentication system
2. **Dashboard**: User-specific dashboards for customers and barbershops
3. **Barbershop Discovery**: Map-based search and filtering
4. **Appointment Booking**: Streamlined booking process
5. **Profile Management**: Complete profile customization
6. **Review System**: Customer feedback interface

### JavaScript Features
- **ES6+ Syntax**: Modern JavaScript with async/await
- **API Integration**: Centralized API configuration
- **Error Handling**: Comprehensive error management
- **Local Storage**: Token and preference management

## 💻 Usage

### For Customers
1. **Register/Login**: Create account or sign in
2. **Discover Barbershops**: Use map to find nearby locations
3. **Select Services**: Choose from available services
4. **Book Appointments**: Schedule with preferred barbers
5. **Manage Bookings**: View, modify, or cancel appointments
6. **Leave Reviews**: Provide feedback after services

### For Barbershops
1. **Business Registration**: Complete business profile setup
2. **Service Management**: Add and manage service offerings
3. **Barber Management**: Add and configure barber profiles
4. **Schedule Management**: Set working hours and availability
5. **Appointment Tracking**: Monitor and manage bookings
6. **Analytics**: View business performance metrics

### For Barbers
1. **Profile Setup**: Create detailed professional profiles
2. **Portfolio Management**: Showcase work and specialties
3. **Schedule Configuration**: Set availability and working hours
4. **Appointment Management**: Track and manage bookings
5. **Performance Monitoring**: View ratings and reviews

## 🤝 Contributing

We welcome contributions to improve BARBERIN! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add appropriate error handling
- Include comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps API** for location services
- **Express.js** community for the excellent framework
- **MySQL** for robust database management
- **Node.js** ecosystem for development tools

## 📞 Support

For support and questions:
- **Email**: support@barberin.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/barberin/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/barberin/wiki)

---

**Made with ❤️ for the barbershop community**

*BARBERIN - Connecting customers with great barbershops since 2024*