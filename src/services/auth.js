// src/services/auth.js

const API_BASE = "http://localhost:3001";

// Realiza la petición de login
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error en login");
  return data;
}

// Guarda la sesión en localStorage
export function saveSession(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

// Limpia la sesión
export function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Verifica el rol y el token
export function checkAuthAndRole(allowedRoles) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || !allowedRoles.includes(role)) {
    logout(); // Simplificado para siempre cerrar sesión si no es válido
    return false;
  }
  return true;
}

export async function registerStudent(email, password) {
  const res = await fetch(`${API_BASE}/register-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // El rol se envía directamente aquí, ya que este endpoint es solo para estudiantes
    body: JSON.stringify({ email, password, role: "estudiante" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error en el registro");
  return data;
}