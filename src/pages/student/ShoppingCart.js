
  import { clearCart, getCartItems, getCartTotalItems, removeFromCart } from "../../services/api";


export async function initShoppingCart() {
  const cartButton = document.getElementById('cart-button');
  const cartCount = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');

  const updateCartIcon = async () => {
    try {
      cartCount.textContent = await getCartTotalItems();
    } catch (error) {
      cartCount.textContent = '0';
    }
  };

  const renderCart = async () => {
    try {
      const items = await getCartItems();
      if (items.length === 0) {
        cartModal.innerHTML = `
          <div class="fixed inset-0 bg-black/20 bg-opacity-50" id="cart-backdrop"></div>
          <div class="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl p-6 flex flex-col items-center justify-center text-center">
            <h2 class="text-2xl font-bold mb-4">Tu Carrito está Vacío</h2>
            <p class="text-gray-600">Añade productos para verlos aquí.</p>
          </div>`;
        return;
      }
      
      const total = items.reduce((sum, item) => sum + item.product.price_sell * item.quantity, 0);

      cartModal.innerHTML = `
        <div class="fixed inset-0 bg-black/20 bg-opacity-50" id="cart-backdrop"></div>
        <div class="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl p-6 flex flex-col">
          <h2 class="text-2xl font-bold mb-6">Tu Carrito</h2>
          <div class="flex-grow overflow-y-auto -mr-6 pr-6">
            ${items.map(item => `
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-semibold">${item.product.name}</h3>
                  <p class="text-gray-600">$${item.product.price_sell} x ${item.quantity}</p>
                </div>
                <button data-id="${item.id}" class="btn-remove-from-cart text-red-500 hover:text-red-700 font-semibold">Eliminar</button>
              </div>
            `).join('')}
          </div>
          <div class="border-t pt-4 mt-4">
            <p class="text-xl font-bold flex justify-between"><span>Total:</span><span>$${total}</span></p>
            
            CAMBIO 2: Añadimos un ID al botón de pago -->
            <button id="btn-checkout" class="w-full mt-4 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Proceder al Pago</button>
          </div>
        </div>
      `;
    } catch(err) {
      console.error("Error al renderizar el carrito:", err);
      cartModal.innerHTML = `<div class="bg-white p-8 rounded shadow-lg text-center"><h2>Error al cargar el carrito.</h2></div>`;
    }
  };

  cartButton.addEventListener('click', async () => {
    await renderCart();
    cartModal.classList.remove('hidden');
  });

  // --> CAMBIO 3: Actualizamos el listener para incluir la lógica de pago
  cartModal.addEventListener('click', async (e) => {
    const backdrop = e.target.closest('#cart-backdrop');
    const removeButton = e.target.closest('.btn-remove-from-cart');
    const checkoutButton = e.target.closest('#btn-checkout');

    if (removeButton) {
      const cartItemId = parseInt(removeButton.dataset.id);
      removeFromCart(cartItemId);
    }
    
    if (checkoutButton) {
      await clearCart(); // Llama a la nueva función
      alert('¡Pago exitoso! Gracias por tu compra.');
    }

    // Cierra el modal si se hace clic en el fondo o después de pagar
    if (backdrop || checkoutButton) {
      cartModal.classList.add('hidden');
    }
  });

  window.addEventListener('cart-updated', () => {
    updateCartIcon();
    if (!cartModal.classList.contains('hidden')) {
      renderCart();
    }
  });
  
  updateCartIcon();
}