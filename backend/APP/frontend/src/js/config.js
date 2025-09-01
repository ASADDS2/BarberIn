// Configuración centralizada para la aplicación BARBERIN
const CONFIG = {
    // URLs del backend
    API_BASE_URL: 'http://localhost:3000/api',
    BACKEND_URL: 'http://localhost:3000',
    
    // Endpoints específicos
    ENDPOINTS: {
        // Usuarios
        USER_LOGIN: '/users/login',
        USER_REGISTER: '/users/register',
        USER_PROFILE: '/users/profile',
        
        // Barberías
        BARBERSHOP_LOGIN: '/barbershops/login',
        BARBERSHOP_REGISTER: '/barbershops/register',
        BARBERSHOP_PROFILE: '/barbershops/profile/me',
        BARBERSHOP_LIST: '/barbershops',
        
        // Barberos
        BARBER_LIST: '/barbers',
        BARBER_BY_SHOP: '/barbers/barbershop',
        
        // Citas
        APPOINTMENTS: '/appointments',
        USER_APPOINTMENTS: '/appointments/user',
        
        // Servicios
        SERVICES: '/services',
        SERVICES_BY_SHOP: '/services/barbershop',
        
        // Reseñas
        REVIEWS: '/reviews'
    },
    
    // Configuración de la aplicación
    APP_NAME: 'BARBERIN',
    VERSION: '1.0.0'
};

// Función helper para construir URLs completas
function buildApiUrl(endpoint) {
    return `${CONFIG.API_BASE_URL}${endpoint}`;
}

// Función helper para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
    const url = buildApiUrl(endpoint);
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    // Agregar token si existe
    const token = localStorage.getItem('token');
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}
