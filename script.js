document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const cartButton = document.querySelector('.cart-button');
    const modal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Referencias del Buscador
    const searchIcon = document.getElementById('search-icon'); 
    const searchInput = document.getElementById('search-input');
    const productGrid = document.getElementById('product-grid'); 
    const allProducts = productGrid ? productGrid.querySelectorAll('.product-card') : []; 

    let cart = [];

    // --- FUNCIÓN DE BÚSQUEDA Y FILTRADO (LUPA) ---
    if (searchIcon && searchInput && productGrid) {
        // 1. Alternar visibilidad del campo de búsqueda al hacer clic en la lupa
        searchIcon.addEventListener('click', () => {
            searchInput.classList.toggle('visible');
            if (searchInput.classList.contains('visible')) {
                searchInput.focus(); 
            } else {
                searchInput.value = '';
                filterProducts(); // Muestra todos los productos al ocultar
            }
        });

        // 2. Filtrar productos al escribir
        searchInput.addEventListener('keyup', filterProducts);

        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();

            allProducts.forEach(card => {
                const productName = card.getAttribute('data-name').toLowerCase();
                
                if (productName.includes(searchTerm)) {
                    card.style.display = 'flex'; 
                } else {
                    card.style.display = 'none'; 
                }
            });
        }
    }
    // --- FIN FUNCIÓN DE BÚSQUEDA ---
    
    // --- Funcionalidad del Modal (Mostrar/Ocultar) ---
    cartButton.addEventListener('click', () => {
        modal.style.display = 'block';
        renderCart();
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Funcionalidad del Carrito ---

    // 1. Añadir Producto
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.getAttribute('data-name');
            
            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: productName, quantity: 1 });
            }

            updateCartCount();
            productCard.classList.add('added');
            setTimeout(() => {
                productCard.classList.remove('added');
            }, 500);
        });
    });

    // 2. Actualizar Contador del Carrito
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    // 3. Renderizar el Carrito en el Modal
    function renderCart() {
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>El carrito está vacío. ¡Añade tu primera fragancia!</p>';
            return;
        }

        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <p>${item.quantity} x ${item.name}</p>
                <span class="cart-item-remove" data-index="${index}"><i class="fas fa-trash-alt"></i> Eliminar</span>
            </div>
        `).join('');

        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }
    
    // 4. Eliminar Producto del Carrito
    function removeItem(e) {
        const index = parseInt(e.target.closest('.cart-item-remove').getAttribute('data-index'));
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
    }

    // 5. Funcionalidad del Botón "Solicitar Pedido" (WhatsApp)
    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor, añade productos antes de solicitar un pedido.');
            return;
        }

        const orderSummary = cart.map(item => `* ${item.quantity}x ${item.name.trim()}`).join('%0A');
        
        const whatsappNumber = '1128770800'; 
        
        const message = 
            `¡Hola Perfumes Select!%0A%0AMe gustaría hacer un pedido de perfumes:%0A%0A${orderSummary}%0A%0APor favor, envíenme los precios finales (unidad/mayorista) y la confirmación de stock. ¡Gracias!`;
        
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

        window.open(whatsappURL, '_blank');
        
        modal.style.display = 'none';
    });
});
