import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api.js';

// La lógica está encapsulada. Recibe el contenedor donde debe trabajar.
export function initCategoriesView(container) {
  
  // --- Elementos del DOM (relativos al modal global) ---
  const modal = document.getElementById('category-modal');
  const categoryForm = document.getElementById('category-form');
  const modalTitle = document.getElementById('modal-title');
  const categoryIdInput = document.getElementById('category-id');
  const categoryNameInput = document.getElementById('category-name');
  const btnCancelModal = document.getElementById('btn-cancel');

  // --- Renderizar la UI de Categorías ---
  const render = (categories) => {
    let rows = categories.map(cat => `
      <tr class="border-b">
        <td class="py-2 px-4">${cat.name}</td>
        <td class="py-2 px-4 text-right">
          <button class="btn-edit text-blue-500 hover:underline mr-4" data-id="${cat.id}" data-name="${cat.name}">Editar</button>
          <button class="btn-delete text-red-500 hover:underline" data-id="${cat.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Gestión de Categorías</h2>
        <button id="btn-new-category" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Crear Categoría</button>
      </div>
      <table class="w-full text-left">
        <thead><tr class="border-b-2"><th class="py-2 px-4">Nombre</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  // --- Lógica del Modal ---
  const showModal = (isEditMode = false, category = {}) => {
    categoryForm.reset(); // Limpia el formulario
    if (isEditMode) {
      modalTitle.textContent = 'Editar Categoría';
      categoryIdInput.value = category.id;
      categoryNameInput.value = category.name;
    } else {
      modalTitle.textContent = 'Crear Nueva Categoría';
      categoryIdInput.value = '';
    }
    modal.classList.remove('hidden');
  };

  const hideModal = () => {
    modal.classList.add('hidden');
  };

  // --- Cargar y Mostrar ---
  const loadAndRender = async () => {
    try {
      container.innerHTML = `<p>Cargando categorías...</p>`;
      const categories = await getCategories();
      render(categories);
    } catch (error) {
      container.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
  };

  // --- Manejo de Eventos (delegados al contenedor) ---
  container.addEventListener('click', e => {
    // Botón para crear nueva categoría
    if (e.target.id === 'btn-new-category') {
      showModal();
    }
    // Botón para editar una categoría
    if (e.target.classList.contains('btn-edit')) {
      const category = { id: e.target.dataset.id, name: e.target.dataset.name };
      showModal(true, category);
    }
    // Botón para eliminar una categoría
    if (e.target.classList.contains('btn-delete')) {
      if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        deleteCategory(e.target.dataset.id)
          .then(loadAndRender) // Si se borra, recarga la lista
          .catch(err => alert(err.message));
      }
    }
  });

  // --- Evento para guardar desde el formulario del modal ---
  categoryForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = categoryIdInput.value;
    const name = categoryNameInput.value;

    try {
      if (id) {
        // Si hay un ID, estamos editando
        await updateCategory(id, name);
      } else {
        // Si no hay ID, estamos creando
        await createCategory(name);
      }
      hideModal();
      loadAndRender(); // Recarga la lista para ver los cambios
    } catch (err) {
      alert(err.message);
    }
  };

  // Asigna el evento al botón de cancelar del modal
  btnCancelModal.onclick = hideModal;

  // --- Carga inicial al activar la vista ---
  loadAndRender();
}