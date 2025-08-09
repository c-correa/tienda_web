// src/pages/loginPage.js

import { loginUser, saveSession } from "../services/auth";

export function initLoginPage() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const messageElement = document.getElementById("loginMessage");

    try {
      messageElement.textContent = ""; // Limpiar mensajes previos
      const data = await loginUser(email, password);
      console.log('Login response:', data);

      saveSession(data.access_token, data.role);

      // Redireccionar
      if (data.role === "student") {
        window.location.href = "dashboard-student.html";
      } else if (data.role === "professor" || data.role === "admin") {
        window.location.href = "dashboard-admin.html";
      }
    } catch (err) {
      messageElement.textContent = err.message;
    }
  });
}