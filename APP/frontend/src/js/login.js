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