// Archivo: src/pages/student/components/ProductList.js

// --> CAMBIO 1: Añadimos 'onAddToCartCallback' como tercer parámetro.
export function initProductList(container, products, onAddToCartCallback) {
  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No hay productos disponibles.</p>`;
    return;
  }

  const productCards = products.map(product => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src="https://placehold.co/600x400/EEE/31343C?text=${product.name}" alt="${product.name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <p class="text-sm text-gray-500 mb-1">${product.category?.name || 'Sin categoría'}</p>
        <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
        <p class="text-xl font-semibold text-blue-600 mt-2">$${product.price_sell}</p>
        <button 
          data-id="${product.id}" 
          class="btn-add-to-cart w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">
          Añadir al carrito
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = productCards;

  // --> CAMBIO 2: Añadimos un 'listener' para capturar los clics.
  // Usamos delegación de eventos para tener un solo listener en el contenedor principal.
  container.addEventListener('click', (e) => {
    // Verificamos si el elemento clickeado tiene la clase del botón.
    if (e.target.classList.contains('btn-add-to-cart')) {
      // Obtenemos el ID del producto desde el atributo data-id.
      const productId = parseInt(e.target.dataset.id);
      // Llamamos a la función que nos pasó el controlador.
      onAddToCartCallback(productId);
    }
  });
}