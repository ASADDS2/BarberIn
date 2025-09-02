// js/dashboard_barbers.js

// Import functions from login.js (make sure login.js loads first)
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Protect route - only barbershops can access
    if (!protectRoute('barbershop')) {
        return;
    }
    
    // Initialize dashboard
    initializeBarbershopDashboard();
});

async function initializeBarbershopDashboard() {
    try {
        // Get barbershop data from localStorage
        const barbershopData = getCurrentUser();
        
        if (!barbershopData || !barbershopData.barbershop_id) {
            console.error('Barbershop data not found');
            logout();
            return;
        }
        
        // Update barbershop name in header
        updateBarbershopHeader(barbershopData);
        
        // Load dashboard data
        await loadDashboardData(barbershopData.barbershop_id);
        
        console.log('Dashboard initialized successfully for:', barbershopData.name);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showDashboardError('Error loading dashboard. Please try again.');
    }
}

function updateBarbershopHeader(barbershopData) {
    const barberNameContainer = document.querySelector('.barber-name');
    if (barberNameContainer) {
        barberNameContainer.textContent = barbershopData.name || 'BARBERSHOP';
    }
    
    // Also update page title
    document.title = `BARBERIN - ${barbershopData.name || 'Dashboard'}`;
}

async function loadDashboardData(barbershopId) {
    try {
        // Load barbershop appointments
        await loadAppointments(barbershopId);
        
        // Load barbershop barbers
        await loadBarbers(barbershopId);
        
        // Load products/services
        await loadServices(barbershopId);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
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
            console.error('Error loading appointments');
            updateAppointmentsColumn([]);
        }
    } catch (error) {
        console.error('Error in loadAppointments:', error);
        updateAppointmentsColumn([]);
    }
}

function updateAppointmentsColumn(appointments) {
    const appointmentsColumn = document.querySelector('.appointments-column');
    
    // Clear existing appointments (except title)
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
        noAppointmentsDiv.textContent = 'No scheduled appointments';
        appointmentsColumn.appendChild(noAppointmentsDiv);
        return;
    }
    
    // Create cards for appointments
    appointments.slice(0, 5).forEach(appointment => { // Show maximum 5
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
            console.error('Error loading barbers');
            updateBarbersSection([]);
        }
    } catch (error) {
        console.error('Error in loadBarbers:', error);
        updateBarbersSection([]);
    }
}

function updateBarbersSection(barbers) {
    const barbersContainer = document.querySelector('.barbers-profiles');
    
    // Clear existing barbers
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
        noBarbers.textContent = 'No registered barbers';
        barbersContainer.appendChild(noBarbers);
        return;
    }
    
    // Create barber profiles
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
    
    // Add "add barber" button if there are less than 4
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
            console.error('Error loading services');
            updateProductsSection([]);
        }
    } catch (error) {
        console.error('Error in loadServices:', error);
        updateProductsSection([]);
    }
}

function updateProductsSection(services) {
    const productsGrid = document.querySelector('.products-grid');
    
    // Clear existing products
    productsGrid.innerHTML = '';
    
    // Create product/service items
    services.slice(0, 8).forEach(service => { // Maximum 8 services
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div class="product-icon" title="${service.service_name}">🛍️</div>
            <div class="product-actions">
                <div class="action-icon" onclick="editService(${service.service_id})">✏️</div>
                <div class="action-icon" onclick="viewService(${service.service_id})">📋</div>
            </div>
        `;
        
        productsGrid.appendChild(productItem);
    });
    
    // Add "add product" button
    const addProduct = document.createElement('div');
    addProduct.className = 'add-product';
    addProduct.innerHTML = '<div class="add-product-icon" onclick="addNewService()">+</div>';
    productsGrid.appendChild(addProduct);
}

// Interaction functions
function viewAppointment(appointmentId) {
    console.log('View appointment:', appointmentId);
    // Implement logic to view appointment details
    alert(`View appointment details ${appointmentId}`);
}

function viewBarberProfile(barberId) {
    console.log('View barber profile:', barberId);
    window.location.href = `dashboard_profile_barber.html?barberId=${barberId}`;
}

function editBarber(barberId) {
    console.log('Edit barber:', barberId);
    // Implement logic to edit barber
    alert(`Edit barber ${barberId}`);
}

function addNewBarber() {
    console.log('Add new barber');
    // Implement logic to add barber
    alert('Function to add new barber');
}

function editService(serviceId) {
    console.log('Edit service:', serviceId);
    // Implement logic to edit service
    alert(`Edit service ${serviceId}`);
}

function viewService(serviceId) {
    console.log('View service:', serviceId);
    // Implement logic to view service
    alert(`View service details ${serviceId}`);
}

function addNewService() {
    console.log('Add new service');
    // Implement logic to add service
    alert('Function to add new service');
}

// Function to show dashboard errors
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

// Function to refresh dashboard data
async function refreshDashboard() {
    const barbershopData = getCurrentUser();
    if (barbershopData && barbershopData.barbershop_id) {
        await loadDashboardData(barbershopData.barbershop_id);
    }
}

// Dashboard-specific logout function
function logoutFromDashboard() {
    if (confirm('Are you sure you want to log out?')) {
        logout();
    }
}