// src/pages/student/components/CategoryFilter.js

/**
 * Renderiza los botones de filtro y maneja los clics.
 * @param {HTMLElement} container - El <aside> donde se insertarán los filtros.
 * @param {Array} categories - La lista de categorías para crear los botones.
 * @param {Function} onFilterChangeCallback - La función a llamar cuando un filtro es seleccionado.
 */
export function initCategoryFilter(container, categories, onFilterChangeCallback) {
  // Creamos el HTML para los botones: uno para "Todos" y uno por cada categoría.
  const filterButtonsHtml = `
    <button class="filter-btn block w-full text-left py-2 px-3 mb-2 rounded transition-colors duration-200 bg-blue-500 text-white" data-id="all">
      Todos
    </button>
    ${categories.map(category => `
      <button class="filter-btn block w-full text-left py-2 px-3 mb-2 rounded transition-colors duration-200 hover:bg-blue-100" data-id="${category.id}">
        ${category.name}
      </button>
    `).join('')}
  `;
  
  container.innerHTML = filterButtonsHtml;

  const buttons = container.querySelectorAll('.filter-btn');

  // Añadimos un solo event listener al contenedor para manejar todos los clics.
  container.addEventListener('click', (e) => {
    // Verificamos si el clic fue en un botón de filtro.
    const button = e.target.closest('.filter-btn');
    if (!button) return;

    // Actualizamos el estado visual de los botones.
    buttons.forEach(btn => {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('hover:bg-blue-100');
    });
    button.classList.add('bg-blue-500', 'text-white');
    button.classList.remove('hover:bg-blue-100');
    
    // Obtenemos el ID de la categoría del atributo data-id.
    const selectedCategoryId = button.dataset.id;
    
    // Llamamos al callback para notificar al controlador principal del cambio.
    onFilterChangeCallback(selectedCategoryId);
  });
}