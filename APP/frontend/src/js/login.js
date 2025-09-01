// js/login.js

// Backend base URL
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    // Verificar resultado de Google Auth al cargar
    checkGoogleAuthResult();
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

<<<<<<< HEAD
        // Get field values (changed from 'usuario' to email)
=======
        // Obtener valores de los campos
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Change button text while processing
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {
<<<<<<< HEAD
            // Correct call to backend login endpoint
=======
            // Llamada al endpoint del backend
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
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

                // Store token if present
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));
                }
<<<<<<< HEAD

                // Redirect to user dashboard
                window.location.href = "dashboard_users.html";

=======
                
                // Redirigir al dashboard
                window.location.href = "../views/dashboard_users.html";
                
>>>>>>> 41c168acfdebb79f47791b389bc3c44337390f42
            } else {
                // Handle backend errors
                let errorMessage = "Invalid credentials";

                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(", ");
                }

                alert("❌ Error: " + errorMessage);
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("⚠️ Could not connect to the server. Make sure the backend is running on port 3000.");
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

<<<<<<< HEAD
// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

// Get the auth token
function getAuthToken() {
    return localStorage.getItem("authToken");
}

// Logout function
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "login.html";
}

// Show messages in login
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

    // Remove previous messages
    const oldMessages = document.querySelectorAll('.login-message');
    oldMessages.forEach(msg => msg.remove());

    // Add new message
    if (container.id === 'message-container') {
        container.appendChild(messageDiv);
    } else {
        container.insertBefore(messageDiv, container.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Check if user came from Google Auth
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const user = urlParams.get('user');

    if (error === 'auth_failed') {
        showMessage('Google authentication failed. Please try again.', 'error');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (user) {
        // User authenticated successfully with Google
        showMessage('Google login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard_users.html';
        }, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Check Google Auth result on page load
    checkGoogleAuthResult();

    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Get form values
        const email = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;

        // Basic validations
        if (!email || !password) {
            showMessage("Please complete all fields", 'error');
            return;
        }

        // Button processing state
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {
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
                showMessage(data.message, 'success');

                // Store token if present
                if (data.data && data.data.token) {
                    localStorage.setItem("authToken", data.data.token);
                    localStorage.setItem("userData", JSON.stringify(data.data.user));

                    // Also store user type if available
                    const userType = data.data.user.user_type || 'user';
                    localStorage.setItem("userType", userType);
                }

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = "dashboard_users.html";
                }, 1000);

            } else {
                let errorMessage = "Invalid credentials";

                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(", ");
                }

                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            showMessage("Could not connect to the server. Make sure the backend is running on port 3000.", 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

// Function to handle Google login (called from HTML)
function handleGoogleLogin() {
    console.log('Starting login with Google...');

    // Change Google button text while redirecting
    const googleBtn = document.querySelector('.google-login');
    if (googleBtn) {
        googleBtn.innerHTML = '...';
        googleBtn.disabled = true;
    }

    // Redirect to Google OAuth route
    window.location.href = 'http://localhost:3000/auth/google';
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem("authToken") !== null;
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem("authToken");
}

// Logout user
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "login.html";
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
