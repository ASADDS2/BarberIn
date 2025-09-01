// js/login.js

// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Obtener valores de los campos (cambiado de 'usuario' a email)
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

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
                alert("✅ " + data.message);
                
                // Almacenar el token si existe
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));
                }
                
                // Redirigir al dashboard según el tipo de usuario
                // Por ahora redirigiremos a una página general
                window.location.href = "dashboard_users.html";
                
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
}