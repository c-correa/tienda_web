import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api.js';

export function initProductsView(container) {

  // --- Elementos del DOM del modal de PRODUCTOS ---
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const modalTitle = document.getElementById('product-modal-title');
  const cancelBtn = document.getElementById('btn-product-cancel');
  // Inputs del formulario
  const productIdInput = document.getElementById('product-id');
  const productNameInput = document.getElementById('product-name');
  const productCategorySelect = document.getElementById('product-category');
  const productPriceBuyInput = document.getElementById('product-price-buy');
  const productPriceSellInput = document.getElementById('product-price-sell');
  const productStockInput = document.getElementById('product-stock');
  
  // Variable para guardar las categorías y no pedirlas a la API repetidamente
  let allCategories = []; 

  // --- Función para renderizar la tabla de productos ---
  const render = (products) => {
    let rows = products.map(p => `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-3 px-4">${p.name}</td>
        <td class="py-3 px-4 text-center">${p.stock}</td>
        <td class="py-3 px-4 text-green-600 font-medium">$${p.price_sell}</td>
        <td class="py-3 px-4 text-gray-600">${p.category?.name || 'Sin categoría'}</td>
        <td class="py-3 px-4 text-right">
          <button class="btn-edit-product text-blue-600 hover:underline font-semibold mr-4" data-id='${p.id}'>Editar</button>
          <button class="btn-delete-product text-red-600 hover:underline font-semibold" data-id='${p.id}'>Eliminar</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Gestión de Productos</h2>
        <button id="btn-new-product" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 shadow">Crear Producto</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left bg-white shadow rounded-lg">
          <thead>
            <tr class="border-b-2 bg-gray-50">
              <th class="py-3 px-4 font-semibold">Nombre</th>
              <th class="py-3 px-4 font-semibold text-center">Stock</th>
              <th class="py-3 px-4 font-semibold">Precio Venta</th>
              <th class="py-3 px-4 font-semibold">Categoría</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  };

  // --- Funciones para manejar el Modal ---
  const showModal = (isEditMode = false, product = {}) => {
    form.reset();
    
    // Poblar el select de categorías con las que ya cargamos
    productCategorySelect.innerHTML = allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    if (isEditMode) {
      modalTitle.textContent = 'Editar Producto';
      productIdInput.value = product.id;
      productNameInput.value = product.name;
      productCategorySelect.value = product.category?.id;
      productPriceBuyInput.value = product.price_buy;
      productPriceSellInput.value = product.price_sell;
      productStockInput.value = product.stock;
    } else {
      modalTitle.textContent = 'Crear Nuevo Producto';
    }
    modal.classList.remove('hidden');
  };

  const hideModal = () => modal.classList.add('hidden');

  // --- Carga los datos necesarios y renderiza la vista ---
  const loadAndRender = async () => {
    try {
      container.innerHTML = `<p>Cargando productos...</p>`;
      // Usamos Promise.all para cargar productos y categorías en paralelo para mayor eficiencia
      const [products, categories] = await Promise.all([getProducts(), getCategories()]);
      allCategories = categories; // Guardar categorías para usarlas en el modal
      render(products);
    } catch (error) {
      container.innerHTML = `<p class="text-red-500 font-bold">Error: ${error.message}</p>`;
    }
  };

  // --- Manejo de Eventos con delegación ---
  container.addEventListener('click', async (e) => {
    if (e.target.id === 'btn-new-product') {
      showModal();
    }
    if (e.target.classList.contains('btn-delete-product')) {
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        await deleteProduct(e.target.dataset.id);
        loadAndRender(); // Recarga la lista para ver los cambios
      }
    }
    if (e.target.classList.contains('btn-edit-product')) {
      // Necesitamos el objeto completo del producto para llenar el formulario
      const products = await getProducts();
      const productToEdit = products.find(p => p.id == e.target.dataset.id);
      if (productToEdit) {
        showModal(true, productToEdit);
      }
    }
  });

  // --- Evento para guardar el formulario del modal ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = productIdInput.value;
    // Creamos el objeto con los datos del producto del formulario
    const productData = {
      name: productNameInput.value,
      categoryId: parseInt(productCategorySelect.value),
      price_buy: parseFloat(productPriceBuyInput.value),
      price_sell: parseFloat(productPriceSellInput.value),
      stock: parseInt(productStockInput.value),
    };

    try {
      if (id) { // Si hay un ID, actualizamos
        await updateProduct(id, productData);
      } else { // Si no, creamos uno nuevo
        await createProduct(productData);
      }
      hideModal();
      loadAndRender(); // Recargamos para ver el producto nuevo o actualizado
    } catch (error) {
      alert(`Error al guardar el producto: ${error.message}`);
    }
  });

  // Asignar evento al botón de cancelar del modal
  cancelBtn.addEventListener('click', hideModal);
  
  // --- Carga inicial cuando se activa esta vista ---
  loadAndRender();
}