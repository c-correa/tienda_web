// src/services/api.js

const API_BASE = "http://localhost:3001";
const token = localStorage.getItem("token");

function decodeJwt(token) {
  try {
    const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payloadBase64));
  } catch (error) {
    console.error("Token malformado o inválido:", error);
    return null;
  }
}

function getAuthContext() {
  if (!token) {
    throw new Error("No se encontró el token de autenticación. Inicia sesión.");
  }
  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    throw new Error("El token es inválido.");
  }
  
  const userId = decodedToken.sub;
  
  return { token, userId };
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al cargar categorías");
  return await res.json();
}

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


function dispatchCartUpdateEvent() {
  window.dispatchEvent(new CustomEvent('cart-updated'));
}


export async function getCartItems() {
  const { token, userId } = getAuthContext(); // Usamos el helper
  const res = await fetch(`${API_BASE}/cart-items/user/${userId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function addToCart(productId) {
  const { token, userId } = getAuthContext(); // Usamos el helper
  const currentItems = await getCartItems();
  const existingItem = currentItems.find(item => item.product.id === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    await fetch(`${API_BASE}/cart-items/${existingItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ quantity: newQuantity })
    });
  } else {
    // Usamos el userId decodificado del token
    const dto = { user_id: userId, product_id: productId, quantity: 1 };
    await fetch(`${API_BASE}/cart-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
      body: JSON.stringify(dto)
    });
  }
  dispatchCartUpdateEvent();
}

export async function removeFromCart(cartItemId) {
  const { token } = getAuthContext(); // Usamos el helper
  await fetch(`${API_BASE}/cart-items/${cartItemId}`, {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${token}` }
  });
  dispatchCartUpdateEvent();
}

export async function getCartTotalItems() {
  try {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    return 0;
  }
}

export async function clearCart() {
  const { token } = getAuthContext(); // Reutilizamos el helper de autenticación
  const items = await getCartItems(); // Obtenemos los items actuales

  if (items.length === 0) return; // Si no hay nada, no hacemos nada

  // Creamos una promesa de borrado para cada item
  const deletePromises = items.map(item => 
    fetch(`${API_BASE}/cart-items/${item.id}`, {
      method: 'DELETE',
      headers: { "Authorization": `Bearer ${token}` }
    })
  );

  // Esperamos a que todas las promesas de borrado se completen
  await Promise.all(deletePromises);
  
  // Notificamos a la UI que el carrito está ahora vacío
  dispatchCartUpdateEvent();
}
