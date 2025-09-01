// js/register.js

const API_BASE_URL = 'http://localhost:3000/api';

let isUserMode = true;

function toggleRegisterMode() {
    const userPanel = document.getElementById('user-register');
    const barberPanel = document.getElementById('barber-register');
    const toggleText = document.getElementById('toggle-text');
    const navLeft = document.querySelector('.nav-left');

    if (isUserMode) {
        // Switch to barbershop mode
        userPanel.classList.add('hidden');
        barberPanel.classList.remove('hidden');
        toggleText.textContent = 'Register Users';
        navLeft.textContent = 'Barbershop Registration';
        isUserMode = false;
    } else {
        // Switch to user mode
        barberPanel.classList.add('hidden');
        userPanel.classList.remove('hidden');
        toggleText.textContent = 'Register Barbershops';
        navLeft.textContent = 'User Registration';
        isUserMode = true;
    }
}

// 🆕 NEW FUNCTION: Handle Google Registration
function handleGoogleRegister() {
    console.log('🎯 Starting registration with Google...');
    window.location.href = 'http://localhost:3000/auth/google';
}

// Function to show error messages
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

    const activeForm = isUserMode ?
        document.querySelector('#user-register .form-section') :
        document.querySelector('#barber-register .form-section');

    const oldErrors = activeForm.querySelectorAll('.error-message');
    oldErrors.forEach(err => err.remove());

    activeForm.insertBefore(errorDiv, activeForm.firstChild);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Function to show success messages
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

    const activeForm = isUserMode ?
        document.querySelector('#user-register .form-section') :
        document.querySelector('#barber-register .form-section');

    const oldMessages = activeForm.querySelectorAll('.success-message, .error-message');
    oldMessages.forEach(msg => msg.remove());

    activeForm.insertBefore(successDiv, activeForm.firstChild);

    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// 🔧 IMPROVED: Get user form data
function getUserFormData() {
    const userFormSection = document.querySelector('#user-register .form-section');
    const inputs = userFormSection.querySelectorAll('input');
    const select = userFormSection.querySelector('select');

    const formData = {
        first_name: inputs[0].value.trim(),
        last_name: inputs[1].value.trim(),
        email: inputs[2].value.trim(),
        phone: inputs[3].value.trim(),
        password: inputs[4].value,
        address: inputs[5].value.trim(),
        age_range: select.value
    };

    console.log('Collected user data:', formData);
    return formData;
}

// 🔧 IMPROVED: Get barbershop form data
function getBarbershopFormData() {
    const barberFormSection = document.querySelector('#barber-register .form-section');
    const inputs = barberFormSection.querySelectorAll('input');
    const textarea = barberFormSection.querySelector('textarea');

    const formData = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        phone: inputs[2].value.trim(),
        password: inputs[3].value,
        owner_name: inputs[4].value.trim(),
        owner_id: inputs[5].value.trim(),
        owner_phone: inputs[6].value.trim(),
        address: textarea.value.trim()
    };

    console.log('Collected barbershop data:', formData);
    return formData;
}

// Function to register user
async function registerUser(formData) {
    try {
        console.log('🚀 Sending user data to backend:', formData);

        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('📡 Response status:', response.status);

        const data = await response.json();
        console.log('📡 Response data:', data);

        if (response.ok && data.success) {
            showSuccess('User registered successfully!');
            resetUserForm();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorMessage = data.message || data.error || 'Registration failed';
            showError(errorMessage);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        showError('Connection error. Make sure the backend is running on port 3000.');
    }
}

function resetUserForm() {
    document.querySelectorAll(
        '#user-register .form-section input, #user-register .form-section textarea, #user-register .form-section select'
    ).forEach(el => {
        if (el.tagName === "SELECT") {
            el.selectedIndex = 0;
        } else {
            el.value = "";
        }
    });
}

// Function to register barbershop
async function registerBarbershop(formData) {
    try {
        console.log('🚀 Sending barbershop data to backend:', formData);

        const response = await fetch(`${API_BASE_URL}/barbershops/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('📡 Barbershop response status:', response.status);

        const data = await response.json();
        console.log('📡 Barbershop response data:', data);

        if (response.ok && data.success) {
            showSuccess('Barbershop registered successfully!');
            document.querySelectorAll('#barber-register .form-section input, #barber-register .form-section textarea, #barber-register .form-section select')
                .forEach(el => el.value = '');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorMessage = data.message || data.error || 'Registration failed';
            showError(errorMessage);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showError('Connection error with the server');
    }
}

// 🔧 VALIDATION FUNCTIONS
function validateUserForm(formData) {
    const errors = [];

    if (!formData.first_name) errors.push('First name is required');
    if (!formData.last_name) errors.push('Last name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.password) errors.push('Password is required');
    if (!formData.age_range || formData.age_range === 'Select...') {
        errors.push('You must select an age range');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Invalid email format');
    }

    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

function validateBarbershopForm(formData) {
    const errors = [];

    if (!formData.name) errors.push('Barbershop name is required');
    if (!formData.email) errors.push('Barbershop email is required');
    if (!formData.password) errors.push('Password is required');
    if (!formData.owner_name) errors.push('Responsible person name is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Invalid email format');
    }

    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

// 🆕 NEW FUNCTION: Check Google OAuth result
function checkGoogleAuthResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'auth_failed') {
        showError('Google authentication failed. Please try again.');
    }

    const authSuccess = urlParams.get('auth_success');
    if (authSuccess === 'true') {
        showSuccess('Successfully registered with Google!');
    }
}

// Event listeners on DOM load
document.addEventListener('DOMContentLoaded', function () {

    checkGoogleAuthResult();

    const userRegisterBtn = document.querySelector('#user-register .btn-login');
    if (userRegisterBtn) {
        userRegisterBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('🎯 User register button clicked');

            const originalText = this.textContent;
            this.disabled = true;
            this.textContent = 'REGISTERING...';

            try {
                const formData = getUserFormData();

                const errors = validateUserForm(formData);
                if (errors.length > 0) {
                    showError(errors.join('. '));
                    return;
                }

                await registerUser(formData);
            } finally {
                this.disabled = false;
                this.textContent = originalText;
            }
        });
    } else {
        console.error('❌ User register button not found');
    }

    const barberRegisterBtn = document.querySelector('#barber-register .register-btn');
    if (barberRegisterBtn) {
        barberRegisterBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('🎯 Barbershop register button clicked');

            const originalText = this.textContent;
            this.disabled = true;
            this.textContent = 'REGISTERING...';

            try {
                const formData = getBarbershopFormData();

                const errors = validateBarbershopForm(formData);
                if (errors.length > 0) {
                    showError(errors.join('. '));
                    return;
                }

                await registerBarbershop(formData);
            } finally {
                this.disabled = false;
                this.textContent = originalText;
            }
        });
    } else {
        console.error('❌ Barbershop register button not found');
    }

    const loginLinks = document.querySelectorAll('.login-link a');
    loginLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });

    const googleBtns = document.querySelectorAll('.btn-signup');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Google OAuth button clicked');

            const originalText = this.innerHTML;
            this.innerHTML = '<span class="google-icon">G</span> Redirecting...';
            this.disabled = true;

            handleGoogleRegister();
        });
    });

    console.log('✅ Event listeners successfully registered');
    console.log('🔗 Google OAuth URL: http://localhost:3000/auth/google');
});
