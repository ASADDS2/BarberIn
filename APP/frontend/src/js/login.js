// js/login.js

// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    // Verificar resultado de Google Auth al cargar
    checkGoogleAuthResult();
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Obtener valores de los campos
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Cambiar el texto del botón mientras procesa
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Iniciando sesión...";

        try {
            // Llamada al endpoint del backend
            const response = await fetch(`${API_BASE_URL}/users/login`, {
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

            if (response.ok && data.success) {
                alert("✅ " + data.message);
                
                // Almacenar el token si existe
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));
                }
                
                // Redirigir al dashboard
                window.location.href = "../views/dashboard_users.html";
                
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

// Verificar si el usuario viene desde Google Auth
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const user = urlParams.get('user');
    
    if (error === 'auth_failed') {
        alert('❌ Error en la autenticación con Google. Por favor intenta nuevamente.');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (user) {
        // El usuario fue autenticado exitosamente con Google
        alert('✅ Login con Google exitoso! Redirigiendo...');
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = "../views/dashboard_users.html";
        }, 1500);
    }
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

// Función para obtener el token
function getAuthToken() {
    return localStorage.getItem("authToken");
}