// js/register.js

const API_BASE_URL = 'http://localhost:3000/api';

let isUserMode = true;

function toggleRegisterMode() {
    const userPanel = document.getElementById('user-register');
    const barberPanel = document.getElementById('barber-register');
    const toggleText = document.getElementById('toggle-text');
    const navLeft = document.querySelector('.nav-left');

    if (isUserMode) {
        // Switch to barber mode
        userPanel.classList.add('hidden');
        barberPanel.classList.remove('hidden');
        toggleText.textContent = 'Registrar Usuarios';
        navLeft.textContent = 'Registro de Barberías';
        isUserMode = false;
    } else {
        // Switch to user mode
        barberPanel.classList.add('hidden');
        userPanel.classList.remove('hidden');
        toggleText.textContent = 'Registrar Barberias';
        navLeft.textContent = 'Registro de Usuario';
        isUserMode = true; // 🔧 CORREGIDO: era "Mode = true"
    }
}

// 🆕 FUNCIÓN NUEVA: Manejar registro con Google
function handleGoogleRegister() {
    console.log('🎯 Iniciando registro con Google...');
    // Redirigir a la ruta de autenticación de Google
    window.location.href = 'http://localhost:3000/auth/google';
}

// Función para mostrar errores
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
    background: #fee;
    border: 1px solid #fcc;
    color: #c00;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 14px;
  `;
    errorDiv.textContent = message;

    // Agregar al formulario activo
    const activeForm = isUserMode ?
        document.querySelector('#user-register .form-section') :
        document.querySelector('#barber-register .form-section');

    // Remover errores previos
    const oldErrors = activeForm.querySelectorAll('.error-message');
    oldErrors.forEach(err => err.remove());

    // Agregar nuevo error al inicio del formulario
    activeForm.insertBefore(errorDiv, activeForm.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
    background: #efe;
    border: 1px solid #cfc;
    color: #060;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 14px;
  `;
    successDiv.textContent = message;

    // Agregar al formulario activo
    const activeForm = isUserMode ?
        document.querySelector('#user-register .form-section') :
        document.querySelector('#barber-register .form-section');

    // Remover mensajes previos
    const oldMessages = activeForm.querySelectorAll('.success-message, .error-message');
    oldMessages.forEach(msg => msg.remove());

    // Agregar nuevo mensaje al inicio del formulario
    activeForm.insertBefore(successDiv, activeForm.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// 🔧 FUNCIÓN MEJORADA: Obtener datos del formulario de usuario
function getUserFormData() {
    const userFormSection = document.querySelector('#user-register .form-section');
    const inputs = userFormSection.querySelectorAll('input');
    const select = userFormSection.querySelector('select');

    // Mapeo basado en el orden exacto del HTML
    const formData = {
        first_name: inputs[0].value.trim(),    // Primer input: Nombres
        last_name: inputs[1].value.trim(),     // Segundo input: Apellidos  
        email: inputs[2].value.trim(),         // Tercer input: Email
        phone: inputs[3].value.trim(),         // Cuarto input: Teléfono
        password: inputs[4].value,             // Quinto input: Contraseña
        address: inputs[5].value.trim(),       // Sexto input: Dirección
        age_range: select.value                // Select: Edad
    };

    console.log('Datos usuario recolectados:', formData);
    return formData;
}

// 🔧 FUNCIÓN MEJORADA: Obtener datos del formulario de barbería
function getBarbershopFormData() {
    const barberFormSection = document.querySelector('#barber-register .form-section');
    const inputs = barberFormSection.querySelectorAll('input');
    const textarea = barberFormSection.querySelector('textarea');

    const formData = {
        name: inputs[0].value.trim(),          // Nombre Barbería
        email: inputs[1].value.trim(),         // Email Barbería
        phone: inputs[2].value.trim(),         // Teléfono Barbería
        password: inputs[3].value,             // Contraseña
        owner_name: inputs[4].value.trim(),    // Nombre Responsable
        owner_id: inputs[5].value.trim(),      // ID Documento
        owner_phone: inputs[6].value.trim(),   // Teléfono Propietario
        address: textarea.value.trim()         // Dirección Barbería
    };

    console.log('Datos barbería recolectados:', formData);
    return formData;
}

// Función para registrar usuario
async function registerUser(formData) {
    try {
        console.log('🚀 Enviando datos al backend:', formData);

        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('📡 Status de respuesta:', response.status);

        const data = await response.json();
        console.log('📡 Datos de respuesta:', data);

        if (response.ok && data.success) {
            showSuccess('¡Usuario registrado exitosamente!');
            resetUserForm();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorMessage = data.message || data.error || 'Error en el registro';
            showError(errorMessage);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        showError('Error de conexión con el servidor. Verifica que el backend esté corriendo en puerto 3000');
    }
}

function resetUserForm() {
    document.querySelectorAll(
        '#user-register .form-section input, #user-register .form-section textarea, #user-register .form-section select'
    ).forEach(el => {
        if (el.tagName === "SELECT") {
            el.selectedIndex = 0; // vuelve al primer <option>
        } else {
            el.value = ""; // limpia inputs y textareas
        }
    });
}

// Función para registrar barbería
async function registerBarbershop(formData) {
    try {
        console.log('🚀 Enviando datos barbería al backend:', formData);

        const response = await fetch(`${API_BASE_URL}/barbershops/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('📡 Status de respuesta barbería:', response.status);

        const data = await response.json();
        console.log('📡 Datos de respuesta barbería:', data);

        if (response.ok && data.success) {
            showSuccess('¡Barbería registrada exitosamente!');
            document.querySelectorAll('#barber-register .form-section input, #barber-register .form-section textarea, #barber-register .form-section select')
                .forEach(el => el.value = '');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorMessage = data.message || data.error || 'Error en el registro';
            showError(errorMessage);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showError('Error de conexión con el servidor');
    }
}

// 🔧 VALIDACIONES MEJORADAS
function validateUserForm(formData) {
    const errors = [];

    if (!formData.first_name) errors.push('Nombres es requerido');
    if (!formData.last_name) errors.push('Apellidos es requerido');
    if (!formData.email) errors.push('Email es requerido');
    if (!formData.password) errors.push('Contraseña es requerida');
    if (!formData.age_range || formData.age_range === 'Seleccione...') {
        errors.push('Debe seleccionar un rango de edad');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Formato de email inválido');
    }

    // Validar longitud de contraseña
    if (formData.password && formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return errors;
}

function validateBarbershopForm(formData) {
    const errors = [];

    if (!formData.name) errors.push('Nombre de barbería es requerido');
    if (!formData.email) errors.push('Email de barbería es requerido');
    if (!formData.password) errors.push('Contraseña es requerida');
    if (!formData.owner_name) errors.push('Nombre del responsable es requerido');

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Formato de email inválido');
    }

    // Validar longitud de contraseña
    if (formData.password && formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return errors;
}

// 🆕 FUNCIÓN NUEVA: Verificar parámetros de URL después de Google OAuth
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'auth_failed') {
        showError('Error en la autenticación con Google. Por favor intenta nuevamente.');
    }
    
    // Si llegamos desde Google Auth exitoso, el usuario ya estaría redirigido al dashboard
    // pero por si acaso, podemos manejar un parámetro de éxito
    const authSuccess = urlParams.get('auth_success');
    if (authSuccess === 'true') {
        showSuccess('¡Registro con Google exitoso!');
    }
}

// Event listeners cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
    
    // 🆕 NUEVO: Verificar resultado de Google Auth al cargar la página
    checkGoogleAuthResult();

    // 🔧 REGISTRO DE USUARIO - CORREGIDO
    const userRegisterBtn = document.querySelector('#user-register .btn-login');
    if (userRegisterBtn) {
        userRegisterBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar conflictos con otros listeners

            console.log('🎯 Botón de registro de usuario clickeado');

            const originalText = this.textContent;

            // Deshabilitar botón durante el registro
            this.disabled = true;
            this.textContent = 'REGISTRANDO...';

            try {
                const formData = getUserFormData();

                // Validar datos
                const errors = validateUserForm(formData);
                if (errors.length > 0) {
                    showError(errors.join('. '));
                    return;
                }

                await registerUser(formData);
            } finally {
                // Rehabilitar botón
                this.disabled = false;
                this.textContent = originalText;
            }
        });
    } else {
        console.error('❌ No se encontró el botón de registro de usuario');
    }

    // 🔧 REGISTRO DE BARBERÍA - CORREGIDO
    const barberRegisterBtn = document.querySelector('#barber-register .register-btn');
    if (barberRegisterBtn) {
        barberRegisterBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar conflictos con otros listeners

            console.log('🎯 Botón de registro de barbería clickeado');

            const originalText = this.textContent;

            // Deshabilitar botón durante el registro
            this.disabled = true;
            this.textContent = 'REGISTRANDO...';

            try {
                const formData = getBarbershopFormData();

                // Validar datos
                const errors = validateBarbershopForm(formData);
                if (errors.length > 0) {
                    showError(errors.join('. '));
                    return;
                }

                await registerBarbershop(formData);
            } finally {
                // Rehabilitar botón
                this.disabled = false;
                this.textContent = originalText;
            }
        });
    } else {
        console.error('❌ No se encontró el botón de registro de barbería');
    }

    // Event listener para links de login
    const loginLinks = document.querySelectorAll('.login-link a');
    loginLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });

    // 🆕 ACTUALIZADO: Event listener para botones de Google OAuth
    const googleBtns = document.querySelectorAll('.btn-signup');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Botón de Google OAuth clickeado');
            
            // Cambiar texto del botón mientras redirige
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="google-icon">G</span> Redirigiendo...';
            this.disabled = true;
            
            // Llamar función de Google OAuth
            handleGoogleRegister();
        });
    });

    console.log('✅ Event listeners registrados correctamente');
    console.log('🔗 Google OAuth URL: http://localhost:3000/auth/google');
});