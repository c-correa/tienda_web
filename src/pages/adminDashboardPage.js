// src/pages/adminDashboardPage.js

import { checkAuthAndRole, logout } from '../services/auth.js';
// Importamos los inicializadores de nuestras sub-vistas
import { initCategoriesView } from './admin/categoriesView.js';
import { initProductsView } from './admin/productsView.js';
// import { initProductsView } from './admin/productsView.js'; // <-- Futuro

export function initAdminDashboardPage() {
  if (!checkAuthAndRole(["admin", "professor"])) return;

  // Elementos principales de la página
  const adminContent = document.getElementById("content");
  const btnCategories = document.getElementById("btn-categories");
  const btnProducts = document.getElementById("btn-products"); // <-- Nuevo botón
  const logoutBtn = document.getElementById("logoutBtn");

  // --- Listeners del Menú de Navegación ---
  
  btnCategories.addEventListener("click", () => {
    // Delega el trabajo a la vista de categorías
    initCategoriesView(adminContent); 
  });

  btnProducts.addEventListener("click", () => {
    // Delega el trabajo a la vista de productos
    adminContent.innerHTML = initProductsView(adminContent);
  });

  logoutBtn.addEventListener("click", logout);

  // --- Carga inicial por defecto ---
  // Al entrar al dashboard, cargamos la vista de categorías por defecto.
  initCategoriesView(adminContent);
}