// Configuración de la API
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
    toggleText.textContent = 'Register for Users';
    navLeft.textContent = 'Register BarberShops';
    isUserMode = false;
  } else {
    // Switch to user mode
    barberPanel.classList.add('hidden');
    userPanel.classList.remove('hidden');
    toggleText.textContent = 'Register for Barber Shops';
    navLeft.textContent = 'Register user';
    isUserMode = true;
  }
}

// Función para mostrar errores
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// Función para limpiar errores
function clearErrors(form) {
  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.style.display = 'none';
    element.textContent = '';
  });
}

// Función para mostrar mensaje de éxito
function showSuccess(elementId, message) {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 5000);
  }
}

// Función para registrar usuario
async function registerUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      showSuccess('user-success', 'Usuario registrado exitosamente!');
      document.getElementById('user-form').reset();
      // Opcional: redirigir al login después de un delay
      setTimeout(() => {
        alert('Registro exitoso! Redirigiendo al login...');
        // window.location.href = 'login.html';
      }, 2000);
    } else {
      showError('user-error', data.error || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('user-error', 'Error de conexión con el servidor');
  }
}

// Función para registrar barbería
async function registerBarbershop(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/barbershops/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      showSuccess('barber-success', 'Barbería registrada exitosamente!');
      document.getElementById('barber-form').reset();
      // Opcional: redirigir al login después de un delay
      setTimeout(() => {
        alert('Registro exitoso! Redirigiendo al login...');
        // window.location.href = 'login.html';
      }, 2000);
    } else {
      showError('barber-error', data.error || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('barber-error', 'Error de conexión con el servidor');
  }
}

// Event listeners cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
  // Formulario de usuario
  document.getElementById('user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.register-btn');
    
    // Limpiar errores previos
    clearErrors(form);
    
    // Deshabilitar botón durante el registro
    submitBtn.disabled = true;
    submitBtn.textContent = 'REGISTERING...';
    form.classList.add('loading');
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData);
    
    try {
      await registerUser(userData);
    } finally {
      // Rehabilitar botón
      submitBtn.disabled = false;
      submitBtn.textContent = 'REGISTER';
      form.classList.remove('loading');
    }
  });

  // Formulario de barbería
  document.getElementById('barber-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.register-btn');
    
    // Limpiar errores previos
    clearErrors(form);
    
    // Deshabilitar botón durante el registro
    submitBtn.disabled = true;
    submitBtn.textContent = 'REGISTERING...';
    form.classList.add('loading');
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const barbershopData = Object.fromEntries(formData);
    
    try {
      await registerBarbershop(barbershopData);
    } finally {
      // Rehabilitar botón
      submitBtn.disabled = false;
      submitBtn.textContent = 'REGISTER';
      form.classList.remove('loading');
    }
  });
  
  // Event listeners para login links
  const loginLinks = document.querySelectorAll('.login-link');
  loginLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Cambiar por la ruta real de tu página de login
      window.location.href = 'login.html';
    });
  });
  
  // Event listener para Google buttons (por implementar)
  const googleBtns = document.querySelectorAll('.google-btn');
  googleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      alert('Funcionalidad de Google OAuth por implementar');
    });
  });
});