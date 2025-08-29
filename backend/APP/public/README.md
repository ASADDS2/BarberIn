# BARBERIN Backend

Backend para la aplicación BARBERIN - Sistema de reservas de citas para barberías.

## Características

- **Autenticación**: Login/registro para usuarios y barberías
- **Gestión de Barberías**: CRUD completo para barberías
- **Gestión de Barberos**: Manejo de barberos, horarios y disponibilidad
- **Sistema de Citas**: Reserva, confirmación y gestión de citas
- **Servicios**: Catálogo de servicios por barbería
- **Reseñas**: Sistema de calificaciones y comentarios
- **API RESTful**: Endpoints bien estructurados

## Instalación

1. Clona el repositorio:
\`\`\`bash
git clone [tu-repositorio]
cd barberin-backend
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configura la base de datos:
   - Crear la base de datos MySQL usando el archivo `DatabaseBarberin.sql`
   - Copiar `.env.example` a `.env` y configurar las variables

4. Ejecuta el servidor:
\`\`\`bash
# Desarrollo
npm run dev

# Producción
npm start
\`\`\`

## Estructura del Proyecto

\`\`\`
backend/
├── app.js              # Archivo principal
├── config/
│   └── database.js     # Configuración de base de datos
├── middleware/
│   └── auth.js         # Middleware de autenticación
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
\`\`\`

## Endpoints API

### Usuarios
- \`POST /api/users/register\` - Registrar usuario
- \`POST /api/users/login\` - Login usuario
- \`GET /api/users/profile\` - Obtener perfil (requiere auth)
- \`PUT /api/users/profile\` - Actualizar perfil (requiere auth)

### Barberías
- \`POST /api/barbershops/register\` - Registrar barbería
- \`POST /api/barbershops/login\` - Login barbería
- \`GET /api/barbershops\` - Listar barberías
- \`GET /api/barbershops/:id\` - Obtener barbería por ID
- \`GET /api/barbershops/profile/me\` - Perfil barbería (requiere auth)
- \`PUT /api/barbershops/profile\` - Actualizar perfil barbería (requiere auth)

### Barberos
- \`POST /api/barbers\` - Crear barbero (requiere auth barbería)
- \`GET /api/barbers/barbershop/:id\` - Barberos por barbería
- \`GET /api/barbers/:id\` - Obtener barbero por ID
- \`PUT /api/barbers/:id\` - Actualizar barbero (requiere auth)
- \`PUT /api/barbers/:id/availability\` - Actualizar disponibilidad
- \`GET /api/barbers/:id/schedule\` - Obtener horario barbero
- \`POST /api/barbers/:id/schedule\` - Establecer horario barbero
- \`GET /api/barbers/:id/availability/:date\` - Slots disponibles

### Citas
- \`POST /api/appointments\` - Crear cita (requiere auth usuario)
- \`GET /api/appointments/user\` - Citas del usuario (requiere auth)
- \`GET /api/appointments/barbershop\` - Citas de la barbería (requiere auth)
- \`PUT /api/appointments/:id/status\` - Actualizar estado de cita

### Servicios
- \`POST /api/services\` - Crear servicio (requiere auth barbería)
- \`GET /api/services/barbershop/:id\` - Servicios por barbería
- \`GET /api/services/:id\` - Obtener servicio por ID
- \`PUT /api/services/:id\` - Actualizar servicio (requiere auth)
- \`DELETE /api/services/:id\` - Eliminar servicio (requiere auth)

### Reseñas
- \`POST /api/reviews\` - Crear reseña (requiere auth usuario)
- \`GET /api/reviews/barber/:id\` - Reseñas de barbero
- \`GET /api/reviews/barbershop/:id\` - Reseñas de barbería

## Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Variables de Entorno

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=Barberin
JWT_SECRET=tu_clave_secreta_jwt
PORT=3000
\`\`\`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

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
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
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
    res.status(500).json({ error: 'Algo salió mal!' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});