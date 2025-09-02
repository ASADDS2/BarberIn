// js/login.js

const API_BASE_URL = 'http://localhost:3000/api';

// Variable to store the selected user type
let selectedUserType = 'User'; // Default User

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

        // Basic validations
        if (!email || !password) {
            showMessage("Please complete all fields", 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email", 'error');
            return;
        }

        // Change button text while processing
        const submitBtn = form.querySelector(".btn-login");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {
            // Determine endpoint based on selected user type
            const endpoint = selectedUserType === 'Barber' 
                ? '/barbershops/login' 
                : '/users/login';
            
            console.log(`Attempting login as ${selectedUserType} at endpoint: ${endpoint}`);

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
            console.log('Server response:', data);

            if (response.ok && data.success) {
                showMessage(data.message, 'success');
                
                // Store authentication data
                if (selectedUserType === 'Barber') {
                    // Barbershop data
                    if (data.data && data.data.token) {
                        localStorage.setItem("authToken", data.data.token);
                        localStorage.setItem("barbershopData", JSON.stringify(data.data.barbershop));
                        localStorage.setItem("userType", "barbershop");
                    }
                } else {
                    // User data
                    if (data.data && data.data.token) {
                        localStorage.setItem("authToken", data.data.token);
                        localStorage.setItem("userData", JSON.stringify(data.data.user));
                        localStorage.setItem("userType", "user");
                    }
                }
                
                // Redirect to corresponding dashboard
                setTimeout(() => {
                    if (selectedUserType === 'Barber') {
                        window.location.href = "dashboard_barbers.html";
                    } else {
                        window.location.href = "dashboard_users.html";
                    }
                }, 1000);
                
            } else {
                // Handle backend errors
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
            showMessage("Could not connect to server. Please verify that the backend is running on port 3000", 'error');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Function to select user type (modified to work with current HTML)
function selectUserType(type) {
    selectedUserType = type;
    console.log("Selected user type:", type);
    
      const userCard = document.getElementById("userCard");
      const barberCard = document.getElementById("barberCard");
      const placeholderInput = document.getElementById("usuario");

      if (type === "User") {
        userCard.style.border = "3px solid #e53e3e";
        barberCard.style.border = "1px solid #ccc";
        placeholderInput.placeholder = "user@email.com";
      } else if (type === "Barber") {
        barberCard.style.border = "3px solid #007bff";
        userCard.style.border = "1px solid #ccc";
        placeholderInput.placeholder = "barbershop@email.com";
      }
      console.log("Selected type:", type);
}

// Function to show messages
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
    
    // Clear previous messages
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

// Check if user comes from Google Auth
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const user = urlParams.get('user');
    
    if (error === 'auth_failed') {
        showMessage('Error in Google authentication. Please try again.', 'error');
        // Clear URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (user) {
        // User was successfully authenticated with Google
        showMessage('Google login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard_users.html';
        }, 1500);
    }
}

// Function to handle Google login
function handleGoogleLogin() {
    console.log('Starting Google login...');
    
    const googleBtn = document.querySelector('.google-login');
    if (googleBtn) {
        googleBtn.innerHTML = '...';
        googleBtn.disabled = true;
    }
    
    window.location.href = 'http://localhost:3000/auth/google';
}

// Utility functions for authentication handling
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

// Function to protect routes (use in dashboards)
function protectRoute(requiredUserType = null) {
    if (!isAuthenticated()) {
        showMessage('You must log in to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    if (requiredUserType && getUserType() !== requiredUserType) {
        showMessage('You do not have permission to access this page', 'error');
        setTimeout(() => {
            logout();
        }, 2000);
        return false;
    }
    
    return true;
}

// Helper function to make authenticated requests to API
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