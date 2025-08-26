import './style.css';

// main.js

const app = document.getElementById('app');

// Templates de cada página
const loginPage = `
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <input type="email" placeholder="Email" class="border p-2 mb-2 w-full"/>
        <input type="password" placeholder="Password" class="border p-2 mb-2 w-full"/>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        <p class="mt-2 text-sm">No tienes cuenta? <a href="#register" class="text-blue-500">Regístrate</a></p>
    </div>
`;

const registerPage = `
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Register</h1>
        <input type="text" placeholder="Nombre" class="border p-2 mb-2 w-full"/>
        <input type="email" placeholder="Email" class="border p-2 mb-2 w-full"/>
        <input type="password" placeholder="Password" class="border p-2 mb-2 w-full"/>
        <button class="bg-green-500 text-white px-4 py-2 rounded">Register</button>
        <p class="mt-2 text-sm">Ya tienes cuenta? <a href="#login" class="text-blue-500">Login</a></p>
    </div>
`;

const dashboardPage = `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Bienvenido a tu panel!</p>
        <button id="logoutBtn" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
`;

app.innerHTML = registerPage
