// src/main.js

import { initLoginPage } from './pages/loginPage.js';
import { initRegisterPage } from './pages/registerPage.js'; // Debes crear este archivo
import { initAdminDashboardPage } from './pages/adminDashboardPage.js';
import './index.css';
import { initStudentDashboardPage } from './pages/studentDashboardPage.js';

// El evento DOMContentLoaded se asegura de que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Revisa qué elementos existen para saber en qué página estamos
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }
    
    if (document.getElementById('registerForm')) {
        initRegisterPage();
    }

    if (document.getElementById('admin-dashboard')) {
        initAdminDashboardPage();
    }

    if (document.getElementById('student-dashboard')) { 
        initStudentDashboardPage();
    }

});