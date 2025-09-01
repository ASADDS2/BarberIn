// js/dashboard_barbers.js

// Importar funciones de login.js (asegúrate de que login.js se cargue primero)
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Proteger la ruta - solo barbershops pueden acceder
    if (!protectRoute('barbershop')) {
        return;
    }
    
    // Inicializar el dashboard
    initializeBarbershopDashboard();
});

async function initializeBarbershopDashboard() {
    try {
        // Obtener datos del barbershop desde localStorage
        const barbershopData = getCurrentUser();
        
        if (!barbershopData || !barbershopData.barbershop_id) {
            console.error('No se encontraron datos del barbershop');
            logout();
            return;
        }
        
        // Actualizar el nombre del barbershop en el header
        updateBarbershopHeader(barbershopData);
        
        // Cargar datos del dashboard
        await loadDashboardData(barbershopData.barbershop_id);
        
        console.log('Dashboard inicializado correctamente para:', barbershopData.name);
        
    } catch (error) {
        console.error('Error inicializando dashboard:', error);
        showDashboardError('Error cargando el dashboard. Por favor, intenta nuevamente.');
    }
}

function updateBarbershopHeader(barbershopData) {
    const barberNameContainer = document.querySelector('.barber-name');
    if (barberNameContainer) {
        barberNameContainer.textContent = barbershopData.name || 'BARBERSHOP';
    }
    
    // También podemos actualizar el título de la página
    document.title = `BARBERIN - ${barbershopData.name || 'Dashboard'}`;
}

async function loadDashboardData(barbershopId) {
    try {
        // Cargar citas del barbershop
        await loadAppointments(barbershopId);
        
        // Cargar barberos del barbershop
        await loadBarbers(barbershopId);
        
        // Cargar productos/servicios
        await loadServices(barbershopId);
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        throw error;
    }
}

async function loadAppointments(barbershopId) {
    try {
        const response = await makeAuthenticatedRequest(`/appointments/barbershop/${barbershopId}`);
        
        if (response.ok) {
            const data = await response.json();
            updateAppointmentsColumn(data.data?.appointments || []);
        } else {
            console.error('Error cargando citas');
            updateAppointmentsColumn([]);
        }
    } catch (error) {
        console.error('Error en loadAppointments:', error);
        updateAppointmentsColumn([]);
    }
}

function updateAppointmentsColumn(appointments) {
    const appointmentsColumn = document.querySelector('.appointments-column');
    
    // Limpiar citas existentes (excepto el título)
    const existingCards = appointmentsColumn.querySelectorAll('.appointment-card');
    existingCards.forEach(card => card.remove());
    
    if (appointments.length === 0) {
        const noAppointmentsDiv = document.createElement('div');
        noAppointmentsDiv.className = 'no-appointments';
        noAppointmentsDiv.style.cssText = `
            padding: 20px;
            text-align: center;
            color: #666;
            font-style: italic;
        `;
        noAppointmentsDiv.textContent = 'No hay citas programadas';
        appointmentsColumn.appendChild(noAppointmentsDiv);
        return;
    }
    
    // Crear cards para las citas
    appointments.slice(0, 5).forEach(appointment => { // Mostrar máximo 5
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        
        const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
        const appointmentTime = appointment.appointment_time;
        
        appointmentCard.innerHTML = `
            <span>${appointmentDate} - ${appointmentTime}</span>
            <button class="btn-view" onclick="viewAppointment(${appointment.appointment_id})">View</button>
        `;
        
        appointmentsColumn.appendChild(appointmentCard);
    });
}

async function loadBarbers(barbershopId) {
    try {
        const response = await makeAuthenticatedRequest(`/barbers/barbershop/${barbershopId}`);
        
        if (response.ok) {
            const data = await response.json();
            updateBarbersSection(data.data?.barbers || []);
        } else {
            console.error('Error cargando barberos');
            updateBarbersSection([]);
        }
    } catch (error) {
        console.error('Error en loadBarbers:', error);
        updateBarbersSection([]);
    }
}

function updateBarbersSection(barbers) {
    const barbersContainer = document.querySelector('.barbers-profiles');
    
    // Limpiar barberos existentes
    barbersContainer.innerHTML = '';
    
    if (barbers.length === 0) {
        const noBarbers = document.createElement('div');
        noBarbers.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 20px;
        `;
        noBarbers.textContent = 'No hay barberos registrados';
        barbersContainer.appendChild(noBarbers);
        return;
    }
    
    // Crear perfiles de barberos
    barbers.forEach(barber => {
        const barberProfile = document.createElement('div');
        barberProfile.className = 'barber-profile';
        
        barberProfile.innerHTML = `
            <div class="profile-edit" onclick="editBarber(${barber.barber_id})">✏️</div>
            <div class="avatar">👤</div>
            <button class="btn-profile" onclick="viewBarberProfile(${barber.barber_id})">
                ${barber.first_name || 'Profile'}
            </button>
        `;
        
        barbersContainer.appendChild(barberProfile);
    });
    
    // Agregar botón de añadir barbero si hay menos de 4
    if (barbers.length < 4) {
        const addBarber = document.createElement('div');
        addBarber.className = 'add-barber';
        addBarber.innerHTML = '<div class="add-icon" onclick="addNewBarber()">+</div>';
        barbersContainer.appendChild(addBarber);
    }
}

async function loadServices(barbershopId) {
    try {
        const response = await makeAuthenticatedRequest(`/services/barbershop/${barbershopId}`);
        
        if (response.ok) {
            const data = await response.json();
            updateProductsSection(data.data?.services || []);
        } else {
            console.error('Error cargando servicios');
            updateProductsSection([]);
        }
    } catch (error) {
        console.error('Error en loadServices:', error);
        updateProductsSection([]);
    }
}

function updateProductsSection(services) {
    const productsGrid = document.querySelector('.products-grid');
    
    // Limpiar productos existentes
    productsGrid.innerHTML = '';
    
    // Crear items de productos/servicios
    services.slice(0, 8).forEach(service => { // Máximo 8 servicios
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div class="product-icon" title="${service.service_name}">🛍️</div>
            <div class="product-actions">
                <div class="action-icon" onclick="editService(${service.service_id})">✏️</div>
                <div class="action-icon" onclick="viewService(${service.service_id})">🔍</div>
            </div>
        `;
        
        productsGrid.appendChild(productItem);
    });
    
    // Agregar botón de añadir producto
    const addProduct = document.createElement('div');
    addProduct.className = 'add-product';
    addProduct.innerHTML = '<div class="add-product-icon" onclick="addNewService()">+</div>';
    productsGrid.appendChild(addProduct);
}

// Funciones de interacción
function viewAppointment(appointmentId) {
    console.log('Ver cita:', appointmentId);
    // Implementar lógica para ver detalles de la cita
    alert(`Ver detalles de la cita ${appointmentId}`);
}

function viewBarberProfile(barberId) {
    console.log('Ver perfil del barbero:', barberId);
    window.location.href = `dashboard_profile_barber.html?barberId=${barberId}`;
}

function editBarber(barberId) {
    console.log('Editar barbero:', barberId);
    // Implementar lógica para editar barbero
    alert(`Editar barbero ${barberId}`);
}

function addNewBarber() {
    console.log('Añadir nuevo barbero');
    // Implementar lógica para añadir barbero
    alert('Función para añadir nuevo barbero');
}

function editService(serviceId) {
    console.log('Editar servicio:', serviceId);
    // Implementar lógica para editar servicio
    alert(`Editar servicio ${serviceId}`);
}

function viewService(serviceId) {
    console.log('Ver servicio:', serviceId);
    // Implementar lógica para ver servicio
    alert(`Ver detalles del servicio ${serviceId}`);
}

function addNewService() {
    console.log('Añadir nuevo servicio');
    // Implementar lógica para añadir servicio
    alert('Función para añadir nuevo servicio');
}

// Función para mostrar errores en el dashboard
function showDashboardError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee;
        border: 1px solid #fcc;
        color: #c00;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Función para refrescar datos del dashboard
async function refreshDashboard() {
    const barbershopData = getCurrentUser();
    if (barbershopData && barbershopData.barbershop_id) {
        await loadDashboardData(barbershopData.barbershop_id);
    }
}

// Función para logout específica del dashboard
function logoutFromDashboard() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
    }
}