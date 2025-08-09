// src/services/api.js

const API_BASE = "http://localhost:3001";
const token = localStorage.getItem("token");

// --- Función existente ---
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar categorías");
  return await res.json();
}

// ==================================================
// ==           NUEVAS FUNCIONES CRUD            ==
// ==================================================

export async function createCategory(name) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error("Error al crear la categoría");
  return await res.json();
}

export async function updateCategory(id, name) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error("Error al actualizar la categoría");
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar la categoría");
  return { message: 'Categoría eliminada' }; // DELETE no suele devolver un body
}


// src/services/api.js

// ... (aquí están las funciones de getCategories, createCategory, etc.)

// =======================================================
// ==           NUEVAS FUNCIONES PARA PRODUCTOS         ==
// =======================================================

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar productos");
  return await res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error("Error al crear el producto");
  return await res.json();
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error("Error al actualizar el producto");
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar el producto");
  return { message: 'Producto eliminado' };
}
