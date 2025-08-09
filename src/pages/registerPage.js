// src/pages/registerPage.js

import { registerStudent } from '../services/auth.js';

export function initRegisterPage() {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const messageElement = document.getElementById("registerMessage");

    try {
      messageElement.textContent = ""; // Limpiar mensajes de error previos
      await registerStudent(email, password);
      
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "index.html";
    } catch (err) {
      messageElement.textContent = err.message;
    }
  });
}