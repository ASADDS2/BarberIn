export function router() {
    const hash = window.location.hash || "#login";
    switch (hash) {
        case "#login":
            app.innerHTML = loginPage;
            break;
        case "#register":
            app.innerHTML = registerPage;
            break;
        case "#dashboard":
            app.innerHTML = dashboardPage;
            document.getElementById('logoutBtn').addEventListener('click', () => {
                window.location.hash = "#login";
            });
            break;
        default:
            app.innerHTML = loginPage;
    }
}

// Escuchar cambios de hash (rutas)
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
