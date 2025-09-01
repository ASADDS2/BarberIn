// js/login.js

const API_BASE_URL = 'http://localhost:3000/api';

// Variable para almacenar el tipo de usuario seleccionado
let selectedUserType = 'User'; // Por defecto User

document.addEventListener("DOMContentLoaded", () => {
    checkGoogleAuthResult();
    initializeLoginForm();
});

function initializeLoginForm() {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Validaciones básicas
        if (!email || !password) {
            showMessage("Por favor, completa todos los campos", 'error');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Por favor, ingresa un email válido", 'error');
            return;
        }

        // Cambiar el texto del botón mientras procesa
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Iniciando sesión...";

        try {
            // Determinar el endpoint según el tipo de usuario seleccionado
            const endpoint = selectedUserType === 'Barber' 
                ? '/barbershops/login' 
                : '/users/login';
            
            console.log(`Intentando login como ${selectedUserType} en endpoint: ${endpoint}`);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (response.ok && data.success) {
                showMessage(data.message, 'success');
                
                // Almacenar datos de autenticación
                if (selectedUserType === 'Barber') {
                    // Datos del barbershop
                    if (data.data && data.data.token) {
                        localStorage.setItem("authToken", data.data.token);
                        localStorage.setItem("barbershopData", JSON.stringify(data.data.barbershop));
                        localStorage.setItem("userType", "barbershop");
                    }
                } else {
                    // Datos del user
                    if (data.data && data.data.token) {
                        localStorage.setItem("authToken", data.data.token);
                        localStorage.setItem("userData", JSON.stringify(data.data.user));
                        localStorage.setItem("userType", "user");
                    }
                }
                
                // Redirigir al dashboard correspondiente
                setTimeout(() => {
                    if (selectedUserType === 'Barber') {
                        window.location.href = "dashboard_barbers.html";
                    } else {
                        window.location.href = "dashboard_users.html";
                    }
                }, 1000);
                
            } else {
                // Manejar errores del backend
                let errorMessage = "Credenciales inválidas";
                
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(", ");
                }
                
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            showMessage("No se pudo conectar al servidor. Verifica que el backend esté corriendo en puerto 3000", 'error');
        } finally {
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Función para seleccionar tipo de usuario (modificada para funcionar con el HTML actual)
function selectUserType(type) {
    selectedUserType = type;
    console.log("Tipo de usuario seleccionado:", type);
    
    // Actualizar el texto del selector para mostrar la selección actual
    const selector = document.getElementById("userTypeSelector");
    const emailInput = document.getElementById("usuario");
    
    
    if (type === 'Barber') {
        selector.style.backgroundColor = '#ff6b35';
        selector.style.color = 'white';
        emailInput.placeholder = "barbershop@email.com";
    } else {
        selector.style.backgroundColor = '#f0f0f0';
        selector.style.color = '#333';
        emailInput.placeholder = "user@email.com";
    }
    
    // Cerrar dropdown
    const dropdown = document.getElementById("userTypeDropdown");
    dropdown.classList.remove("show");
}

// Función para mostrar mensajes
function showMessage(message, type = 'error') {
    const container = document.getElementById('message-container') || document.body;
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message ${type}`;
    messageDiv.style.cssText = `
        padding: 12px;
        margin: 10px 0;
        border-radius: 6px;
        font-size: 14px;
        position: relative;
        z-index: 1000;
        font-family: 'Montserrat', sans-serif;
        ${type === 'error' ? 'background: #fee; border: 1px solid #fcc; color: #c00;' : 
          type === 'success' ? 'background: #efe; border: 1px solid #cfc; color: #060;' :
          'background: #e7f3ff; border: 1px solid #b3d9ff; color: #0066cc;'}
    `;
    messageDiv.textContent = message;
    
    // Limpiar mensajes previos
    const oldMessages = document.querySelectorAll('.login-message');
    oldMessages.forEach(msg => msg.remove());
    
    // Agregar nuevo mensaje
    if (container.id === 'message-container') {
        container.appendChild(messageDiv);
    } else {
        container.insertBefore(messageDiv, container.firstChild);
    }
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Verificar si el usuario viene desde Google Auth
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const user = urlParams.get('user');
    
    if (error === 'auth_failed') {
        showMessage('Error en la autenticación con Google. Por favor intenta nuevamente.', 'error');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (user) {
        // El usuario fue autenticado exitosamente con Google
        showMessage('Login con Google exitoso! Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard_users.html';
        }, 1500);
    }
}

// Función para manejar login con Google
function handleGoogleLogin() {
    console.log('Iniciando login con Google...');
    
    const googleBtn = document.querySelector('.google-login');
    if (googleBtn) {
        googleBtn.innerHTML = '...';
        googleBtn.disabled = true;
    }
    
    window.location.href = 'http://localhost:3000/auth/google';
}

// Funciones de utilidad para manejo de autenticación
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}

function getUserType() {
    return localStorage.getItem("userType");
}

function getCurrentUser() {
    const userType = getUserType();
    if (userType === 'barbershop') {
        return JSON.parse(localStorage.getItem("barbershopData") || '{}');
    } else {
        return JSON.parse(localStorage.getItem("userData") || '{}');
    }
}

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("barbershopData");
    localStorage.removeItem("userType");
    window.location.href = "login.html";
}

// Función para proteger rutas (usar en dashboards)
function protectRoute(requiredUserType = null) {
    if (!isAuthenticated()) {
        showMessage('Debes iniciar sesión para acceder a esta página', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    if (requiredUserType && getUserType() !== requiredUserType) {
        showMessage('No tienes permisos para acceder a esta página', 'error');
        setTimeout(() => {
            logout();
        }, 2000);
        return false;
    }
    
    return true;
}

// Función auxiliar para hacer peticiones autenticadas al API
async function makeAuthenticatedRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    if (response.status === 401) {
        logout();
        throw new Error('Session expired');
    }
    
    return response;
}