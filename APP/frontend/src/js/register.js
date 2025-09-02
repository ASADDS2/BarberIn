// js/register.js

const API_BASE_URL = 'http://localhost:3000/api';

let isUserMode = true;

// Función unificada para mostrar mensajes
function showMessage(message, type = 'info') {
    // Remover mensajes anteriores
    const oldMessages = document.querySelectorAll('.success-message, .error-message');
    oldMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    
    // Estilos base
    messageDiv.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-size: 14px;
    `;
    
    // Aplicar estilo según el tipo
    if (type === 'success') {
        messageDiv.style.background = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.background = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    } else {
        messageDiv.style.background = '#d1ecf1';
        messageDiv.style.color = '#0c5460';
        messageDiv.style.border = '1px solid #bee5eb';
    }

    messageDiv.textContent = message;

    // Insertar en el panel activo
    const activeForm = isUserMode 
        ? document.querySelector('#user-register .form-section')
        : document.querySelector('#barber-register .form-section');
        
    activeForm.insertBefore(messageDiv, activeForm.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Toggle entre modos de registro
function toggleRegisterMode() {
    const userPanel = document.getElementById('user-register');
    const barberPanel = document.getElementById('barber-register');
    const toggleText = document.getElementById('toggle-text');
    const navLeft = document.querySelector('.nav-left');

    if (isUserMode) {
        // Cambiar a modo barbershop
        userPanel.classList.add('hidden');
        barberPanel.classList.remove('hidden');
        toggleText.textContent = 'Register Users';
        navLeft.textContent = 'Barbershop Registration';
        isUserMode = false;
    } else {
        // Cambiar a modo user
        barberPanel.classList.add('hidden');
        userPanel.classList.remove('hidden');
        toggleText.textContent = 'Register Barbershops';
        navLeft.textContent = 'User Registration';
        isUserMode = true;
    }
}

// Obtener datos del formulario de usuario
function getUserFormData() {
    const userFormSection = document.querySelector('#user-register .form-section');
    const inputs = userFormSection.querySelectorAll('input');
    const select = userFormSection.querySelector('select');

    return {
        first_name: inputs[0].value.trim(),
        last_name: inputs[1].value.trim(),
        email: inputs[2].value.trim(),
        phone: inputs[3].value.trim(),
        password: inputs[4].value,
        address: inputs[5].value.trim(),
        age_range: select.value
    };
}

// Obtener datos del formulario de barbershop (desde el HTML con form)
function getBarbershopFormData() {
    const form = document.getElementById('barbershop-register-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Convertir valores vacíos a null para campos opcionales
    Object.keys(data).forEach(key => {
        if (data[key] === '') {
            data[key] = null;
        }
    });
    
    // Convertir latitude y longitude a números si existen
    if (data.latitude) data.latitude = parseFloat(data.latitude);
    if (data.longitude) data.longitude = parseFloat(data.longitude);
    
    return data;
}

// Validaciones
function validateUserForm(formData) {
    const errors = [];

    if (!formData.first_name) errors.push('First name is required');
    if (!formData.last_name) errors.push('Last name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.password) errors.push('Password is required');
    if (!formData.age_range || formData.age_range === 'Select...') {
        errors.push('You must select an age range');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Invalid email format');
    }

    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

function validateBarbershopForm(formData) {
    const errors = [];

    if (!formData.name) errors.push('Barbershop name is required');
    if (!formData.email) errors.push('Barbershop email is required');
    if (!formData.password) errors.push('Password is required');
    if (!formData.responsible_person) errors.push('Responsible person is required');
    if (!formData.id_document) errors.push('ID document is required');
    if (!formData.address) errors.push('Address is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Invalid email format');
    }

    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

// Función genérica para hacer peticiones al API
async function makeApiRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, data: result };
        } else {
            return { 
                success: false, 
                message: result.errors && Array.isArray(result.errors) 
                    ? 'Validation errors: ' + result.errors.join(', ')
                    : result.message || 'Registration failed'
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Connection error. Please try again.' };
    }
}

// Registrar usuario
async function registerUser(formData) {
    const result = await makeApiRequest('/users/register', formData);
    
    if (result.success) {
        showMessage('User registered successfully! Redirecting to login...', 'success');
        resetForm('#user-register');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showMessage(result.message, 'error');
    }
}

// Registrar barbershop
async function registerBarbershop(formData) {
    const result = await makeApiRequest('/barbershops/register', formData);
    
    if (result.success) {
        showMessage('Barbershop registered successfully! Redirecting to login...', 'success');
        document.getElementById('barbershop-register-form').reset();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showMessage(result.message, 'error');
    }
}

// Limpiar formulario
function resetForm(panelSelector) {
    document.querySelectorAll(`${panelSelector} input, ${panelSelector} textarea, ${panelSelector} select`)
        .forEach(el => {
            if (el.tagName === "SELECT") {
                el.selectedIndex = 0;
            } else {
                el.value = "";
            }
        });
}

// Función auxiliar para manejar botones durante el submit
function setButtonState(button, loading = false) {
    if (loading) {
        button.originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Registering...';
    } else {
        button.disabled = false;
        button.textContent = button.originalText || 'Register';
    }
}

// Manejo de autenticación con Google
function handleGoogleRegister() {
    window.location.href = 'http://localhost:3000/auth/google';
}

function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'auth_failed') {
        showMessage('Google authentication failed. Please try again.', 'error');
    }

    const authSuccess = urlParams.get('auth_success');
    if (authSuccess === 'true') {
        showMessage('Successfully registered with Google!', 'success');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    checkGoogleAuthResult();

    // Botón de registro de usuario
    const userRegisterBtn = document.querySelector('#user-register .btn-login');
    if (userRegisterBtn) {
        userRegisterBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            
            setButtonState(this, true);

            try {
                const formData = getUserFormData();
                const errors = validateUserForm(formData);
                
                if (errors.length > 0) {
                    showMessage(errors.join('. '), 'error');
                    return;
                }

                await registerUser(formData);
            } finally {
                setButtonState(this, false);
            }
        });
    }

    // Formulario de registro de barbershop
    const barbershopForm = document.getElementById('barbershop-register-form');
    if (barbershopForm) {
        barbershopForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const registerBtn = document.getElementById('register-btn');
            setButtonState(registerBtn, true);

            try {
                const formData = getBarbershopFormData();
                const errors = validateBarbershopForm(formData);
                
                if (errors.length > 0) {
                    showMessage(errors.join('. '), 'error');
                    return;
                }

                await registerBarbershop(formData);
            } finally {
                setButtonState(registerBtn, false);
            }
        });
    }

    // Enlaces a login
    const loginLinks = document.querySelectorAll('.login-link a');
    loginLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });
});