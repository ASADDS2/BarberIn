// js/login.js

// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    // Verificar resultado de Google Auth al cargar
    checkGoogleAuthResult();
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

<<<<<<< HEAD
<<<<<<< HEAD
        // Get field values (changed from 'usuario' to email)
=======
        // Obtener valores de los campos
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
=======
        // Obtener valores de los campos (cambiado de 'usuario' a email)
>>>>>>> parent of 1ceb5ea (Feat: translate)
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Cambiar el texto del botón mientras procesa
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Iniciando sesión...";

        try {
<<<<<<< HEAD
<<<<<<< HEAD
            // Correct call to backend login endpoint
=======
            // Llamada al endpoint del backend
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
=======
            // Llamada corregida al endpoint del backend
>>>>>>> parent of 1ceb5ea (Feat: translate)
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,  // Cambiado de 'username' a 'email'
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("✅ " + data.message);
                
                // Almacenar el token si existe
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));
                }
<<<<<<< HEAD
<<<<<<< HEAD

                // Redirect to user dashboard
                window.location.href = "dashboard_users.html";

=======
                
                // Redirigir al dashboard
                window.location.href = "../views/dashboard_users.html";
                
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
=======
                
                // Redirigir al dashboard según el tipo de usuario
                // Por ahora redirigiremos a una página general
                window.location.href = "dashboard_users.html";
                
>>>>>>> parent of 1ceb5ea (Feat: translate)
            } else {
                // Manejar errores del backend
                let errorMessage = "Credenciales inválidas";
                
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(", ");
                }
                
                alert("❌ Error: " + errorMessage);
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("⚠️ No se pudo conectar al servidor. Verifica que el backend esté corriendo en puerto 3000");
        } finally {
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

<<<<<<< HEAD
<<<<<<< HEAD
// Check if user is authenticated
=======
// Función para verificar si el usuario está autenticado
>>>>>>> parent of 1ceb5ea (Feat: translate)
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

// Función para obtener el token
function getAuthToken() {
    return localStorage.getItem("authToken");
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "login.html";
}


// Función para mostrar mensajes en el login
function showMessage(message, type = 'error') {
    const container = document.getElementById('message-container') || document.body;
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message ${type}`;
    messageDiv.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-size: 14px;
        position: relative;
        z-index: 1000;
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

document.addEventListener("DOMContentLoaded", () => {
    // Verificar resultado de Google Auth al cargar
    checkGoogleAuthResult();
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Obtener valores de los campos (cambiado de 'usuario' a email)
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Validaciones básicas
        if (!email || !password) {
            showMessage("Por favor, completa todos los campos", 'error');
            return;
        }

        // Cambiar el texto del botón mientras procesa
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Iniciando sesión...";

        try {
            // Llamada corregida al endpoint del backend
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,  // Cambiado de 'username' a 'email'
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showMessage(data.message, 'success');
                
                // Almacenar el token si existe
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));
                    
                    // También almacenar el tipo de usuario si está disponible
                    const userType = data.data.user.user_type || 'user';
                    localStorage.setItem("userType", userType);
                }
                
                // Redirigir al dashboard según el tipo de usuario
                setTimeout(() => {
                    window.location.href = "dashboard_users.html";
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
});

// Función para manejar login con Google (llamada desde HTML)
function handleGoogleLogin() {
    console.log('Iniciando login con Google...');
    
    // Cambiar texto del botón mientras redirige
    const googleBtn = document.querySelector('.google-login');
    if (googleBtn) {
        googleBtn.innerHTML = '...';
        googleBtn.disabled = true;
    }
    
    // Redirigir a la ruta de autenticación de Google
    window.location.href = 'http://localhost:3000/auth/google';
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

// Función para obtener el token
function getAuthToken() {
    return localStorage.getItem("authToken");
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "login.html";
<<<<<<< HEAD
}
=======
// Función para obtener parámetros de la URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    success: params.get("success"),
    token: params.get("token"),
    userData: params.get("userData")
  };
}

function saveAuthData() {
  const { success, token, userData } = getQueryParams();

  if (success === "google_auth" && token && userData) {
    // Guardar token
    localStorage.setItem("authToken", token);

    // Guardar información del usuario (como objeto)
    const user = JSON.parse(decodeURIComponent(userData));
    localStorage.setItem("userData", JSON.stringify(user));

    console.log("✅ Datos guardados en localStorage:", user);

    // (Opcional) Redirigir al home o dashboard
    window.location.href = "/frontend/views/dashboard_users.html";
  }
}
// Llamar a la función al cargar la página
saveAuthData();
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
=======
}
>>>>>>> parent of 1ceb5ea (Feat: translate)
