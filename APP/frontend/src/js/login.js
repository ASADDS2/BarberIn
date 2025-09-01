// js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const username = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
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
