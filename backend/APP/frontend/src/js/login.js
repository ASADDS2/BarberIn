// js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const username = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;

        try {
            // Determinar el tipo de usuario y endpoint correspondiente
            const userType = document.querySelector('.dropdown-item.selected')?.textContent || 'User';
            const endpoint = userType === 'Barber' ? '/api/barbershops/login' : '/api/users/login';
            
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ " + data.message);
                // If backend sends token, store it
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                // Redirect to dashboard
                window.location.href = "dashboard.html";
            } else {
                alert("❌ Error: " + (data.message || "Invalid credentials"));
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("⚠ Could not connect to the server");
        }
    });
});
