
document.addEventListener('DOMContentLoaded', () => {

    const homeAddToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    homeAddToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;
            const quantity = 1;
            await addToCart(productId, quantity);
        });
    });
    const productDetailAddToCartButton = document.getElementById('add-to-cart-detail-btn');
    const quantityInput = document.getElementById('quantity');
    if (productDetailAddToCartButton) {
        productDetailAddToCartButton.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            const quantity = parseInt(quantityInput.value, 10);

            if (isNaN(quantity) || quantity < 1) {
                alert('La cantidad debe ser un número válido y mayor a 0.');
                return;
            }
            await addToCart(productId, quantity);
        });
    }
    async function addToCart(productId, quantity) {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto agregado al carrito con éxito!');

            } else {

                console.error('Error al agregar al carrito:', data.message || response.statusText);
                alert('Hubo un error al agregar el producto al carrito: ' + (data.message || 'Error desconocido.'));
            }
        } catch (error) {

            console.error('Error de red o JavaScript al agregar al carrito:', error);
            alert('Error de conexión. Intenta de nuevo más tarde.');
        }
    }
});