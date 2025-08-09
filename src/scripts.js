// src/main.js

import { initLoginPage } from './pages/loginPage.js';
import { initRegisterPage } from './pages/registerPage.js'; // Debes crear este archivo
import { initAdminDashboardPage } from './pages/adminDashboardPage.js';
// import { initStudentDashboardPage } from './pages/studentDashboardPage.js'; // Debes crear este archivo
import './index.css';

// El evento DOMContentLoaded se asegura de que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Revisa qué elementos existen para saber en qué página estamos
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }
    
    if (document.getElementById('registerForm')) {
        initRegisterPage();
    }

    if (document.getElementById('admin-dashboard')) { // Sugerencia: añade un id al body o a un div principal del dashboard admin
        initAdminDashboardPage();
    }

    if (document.getElementById('student-dashboard')) { // Y también al del estudiante
        // initStudentDashboardPage();
    }
});