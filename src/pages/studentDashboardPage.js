// Archivo: src/pages/student/studentDashboardPage.js

import { addToCart, getCategories, getProducts } from '../services/api.js';
import { initShoppingCart } from './student/ShoppingCart.js';
import { initProductList} from './student/ProductList.js';
import { initCategoryFilter} from './student/CategoryFilter.js';


export async function initStudentDashboardPage() {
  const filterContainer = document.getElementById('category-filters');
  const productContainer = document.getElementById('product-list');

  // ... (el código de carga y filtros se mantiene igual)

  try {
    let allProducts = [];
    let currentFilter = 'all';

    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    allProducts = products;

    const handleAddToCart = (productId) => {
      addToCart(productId).catch(err => {
        console.error(err);
        alert('Hubo un error al añadir el producto.');
      });
      // Opcional: mostrar una notificación visual más elegante
    };

    const renderFilteredProducts = () => {
      let productsToShow = allProducts;
      if (currentFilter !== 'all') {
        productsToShow = allProducts.filter(product => product.category?.id == currentFilter);
      }
      initProductList(productContainer, productsToShow, handleAddToCart);
    };

    initCategoryFilter(filterContainer, categories, (selectedCategoryId) => {
      currentFilter = selectedCategoryId;
      renderFilteredProducts();
    });

    renderFilteredProducts();
    
    // Inicializamos la lógica del carrito al final
    initShoppingCart();

  } catch (error) {
    // ... (manejo de errores)
  }
}