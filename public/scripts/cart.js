
document.addEventListener('DOMContentLoaded', () => {

    const homeAddToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    homeAddToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id; // Asumo que en la vista general usas data-id
            const quantity = 1;
            await addToCart(productId, quantity); // Llama a la función addToCart
        });
    });

    // --- Lógica para la página de detalle de producto ---
    const productDetailAddToCartButton = document.getElementById('add-to-cart-detail-btn');
    const quantityInput = document.getElementById('quantity');

    if (productDetailAddToCartButton) {
        productDetailAddToCartButton.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId; // Correcto: obtiene de data-product-id
            const quantity = parseInt(quantityInput.value, 10);

            if (isNaN(quantity) || quantity < 1) {
                alert('La cantidad debe ser un número válido y mayor a 0.');
                return;
            }
            
            // *** CAMBIO CLAVE AQUÍ: Llama a la función 'addToCart' ***
            await addToCart(productId, quantity); 
        });
    }


    async function addToCart(productId, quantity) {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Si usas tokens de autenticación (JWT) y los envías por cabecera, añádelo aquí
                    // 'Authorization': 'Bearer TU_TOKEN_AQUI'
                    // NOTA: Si estás usando cookies HTTP-only (como te sugerí), no necesitas esta línea.
                },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });

            const data = await response.json();

            if (response.ok) { // Si la respuesta es 2xx (ej. 200, 201)
                alert('Producto agregado al carrito con éxito!');
                // Opcional: Redirigir al carrito o actualizar un mini-carrito en la UI
                // window.location.href = '/cart';
            } else {
                // Manejo de errores de la API (ej. 400, 401, 403, 404, 500)
                console.error('Error al agregar al carrito:', data.message || response.statusText);
                alert('Hubo un error al agregar el producto al carrito: ' + (data.message || 'Error desconocido.'));
            }
        } catch (error) {
            // Manejo de errores de red o errores de JavaScript antes de la petición
            console.error('Error de red o JavaScript al agregar al carrito:', error);
            alert('Error de conexión. Intenta de nuevo más tarde.');
        }
    }
});