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

    if (response.ok && data.success) {
      showSuccess('Usuario registrado exitosamente!');
      document.querySelector('#user-register form').reset();
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      // El backend puede devolver errores en diferentes formatos
      const errorMessage = data.message || data.error || 'Error en el registro';
      
      // Si hay errores específicos (array), mostrar el primero
      if (data.errors && Array.isArray(data.errors)) {
        showError(data.errors.join(', '));
      } else {
        showError(errorMessage);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor. Verifica que el backend esté corriendo en puerto 3000');
  }
}

// Función para registrar barbería (necesitaremos crear este endpoint después)
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

    if (response.ok && data.success) {
      showSuccess('Barbería registrada exitosamente!');
      document.querySelector('#barber-register form').reset();
      
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      const errorMessage = data.message || data.error || 'Error en el registro';
      showError(errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Error de conexión con el servidor');
  }
}

// Event listeners cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // Formulario de usuario
  const userForm = document.querySelector('#user-register form');
  if (userForm) {
    userForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.register-btn');
      const originalText = submitBtn.textContent;
      
      // Deshabilitar botón durante el registro
      submitBtn.disabled = true;
      submitBtn.textContent = 'REGISTERING...';
      
      // Obtener datos del formulario - MAPEADO CORRECTO
      const formData = {
        first_name: this.querySelector('input[placeholder=""]').value.trim(), // Primer input
        last_name: this.querySelectorAll('input[placeholder=""]')[1].value.trim(), // Segundo input
        email: this.querySelector('input[type="email"]').value.trim(),
        phone: this.querySelector('input[type="tel"]').value.trim(),
        password: this.querySelector('input[type="password"]').value,
        address: this.querySelectorAll('input[type="text"]')[2].value.trim(), // Input de dirección
        age_range: this.querySelector('select').value
      };
      
      // Validaciones básicas
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
        showError('Por favor, completa todos los campos obligatorios');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      if (formData.age_range === 'Select...') {
        showError('Por favor, selecciona un rango de edad');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      
      try {
        await registerUser(formData);
      } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Formulario de barbería
  const barberForm = document.querySelector('#barber-register form');
  if (barberForm) {
    barberForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.register-btn');
      const originalText = submitBtn.textContent;
      
      // Deshabilitar botón durante el registro
      submitBtn.disabled = true;
      submitBtn.textContent = 'REGISTERING...';
      
      // Obtener datos del formulario de barbería
      const inputs = this.querySelectorAll('input');
      const textarea = this.querySelector('textarea');
      
      const barbershopData = {
        name: inputs[0].value.trim(), // BARBERSHOP NAME
        email: inputs[1].value.trim(), // BARBERSHOP EMAIL
        phone: inputs[2].value.trim(), // BARBERSHOP CONTACT NUMBER
        password: inputs[3].value, // PASSWORD
        owner_name: inputs[4].value.trim(), // RESPONSIBLE PERSON NAME
        owner_id: inputs[5].value.trim(), // ID DOCUMENT
        owner_phone: inputs[6].value.trim(), // OWNER'S CONTACT PHONE
        address: textarea.value.trim() // BARBERSHOP ADDRESS
      };
      
      // Validaciones básicas
      if (!barbershopData.name || !barbershopData.email || !barbershopData.password || !barbershopData.owner_name) {
        showError('Por favor, completa todos los campos obligatorios');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      
      try {
        await registerBarbershop(barbershopData);
      } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  // Event listener para links de login
  const loginLinks = document.querySelectorAll('.login-link');
  loginLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  });
  
  // Event listener para botones de Google (por implementar)
  const googleBtns = document.querySelectorAll('.google-btn');
  googleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Funcionalidad de Google OAuth por implementar');
    });
  });
});