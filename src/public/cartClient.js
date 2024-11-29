console.log("Gestión de carritos cargada");

const socket = io();
const cartList = document.getElementById('cartList');

// Obtener carritos desde el servidor
function fetchCarts() {
    fetch('/api/carts')
        .then(response => response.json())
        .then(data => {
            cartList.innerHTML = ''; 
            if (data.length === 0) {
                cartList.innerHTML = '<p>No hay carritos disponibles.</p>';
            }

            data.forEach(cart => {
                renderCart(cart);
            });
        })
    .catch(error => console.error('Error al obtener carritos:', error));
}

// Función para renderizar un carrito
function renderCart(cart) {
    const div = document.createElement('div');
    div.classList.add('card', 'mb-3');
    div.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">Carrito ID: ${cart.id}</h5>
            <p class="card-text">Productos:</p>
            <ul>
                ${cart.products.map(p => `
                    <li>
                        <strong>Producto ID:</strong> ${p.product.id} <br>
                        <strong>Nombre:</strong> ${p.product.title} <br>
                        <strong>Precio:</strong> $${p.product.price} <br>
                        <strong>Cantidad:</strong> ${p.quantity} <br>
                        <button onclick="deleteProductFromCart(${cart.id}, ${p.product.id})" class="btn btn-danger">Eliminar Producto</button> 
                        <button onclick="showUpdateQuantity(${cart.id}, ${p.product.id})" class="btn btn-warning">Actualizar Cantidad</button>
                    </li>
                `).join('')}
            </ul>
            <button onclick="deleteCart(${cart.id})" class="btn btn-danger">Eliminar Carrito</button>
        </div>
    `;
    cartList.appendChild(div);
}

// Escuchar el evento 'updateCarts' y actualizar la lista de carritos
socket.on('updateCarts', (carts) => {
    cartList.innerHTML = ''; 
    if (carts.length === 0) {
        cartList.innerHTML = '<p>No hay carritos disponibles.</p>';
    } else {
        carts.forEach(cart => {
            renderCart(cart); 
        });
    }
});

// Crear un nuevo carrito
function createCart() {
    fetch('/api/carts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);  
            if (data && data.cart) {
                alert(`Carrito creado con ID: ${data.cart.id}`);
                fetchCarts(); 
            } else {
                alert('Error al crear el carrito');
            }
        })
        .catch(error => {
            console.error('Error al crear carrito:', error);
            alert('Error al crear el carrito');
        });
}

// Eliminar un carrito
function deleteCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Carrito eliminado');
            fetchCarts();  
        })
        .catch(error => console.error('Error al eliminar carrito:', error));
}

// Eliminar un producto de un carrito
function deleteProductFromCart(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Producto eliminado del carrito');
        fetchCarts();  
    })
    .catch(error => console.error('Error al eliminar producto del carrito:', error));
}

// Mostrar un formulario para actualizar la cantidad de un producto
function showUpdateQuantity(cartId, productId) {
    const newQuantity = prompt("Ingresa la nueva cantidad para este producto:");
    if (newQuantity && !isNaN(newQuantity) && newQuantity > 0) {
        updateProductQuantity(cartId, productId, newQuantity);
    } else {
        alert("Cantidad no válida");
    }
}

// Actualizar la cantidad de un producto
function updateProductQuantity(cartId, productId, newQuantity) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            console.log('Cantidad actualizada:', data);
            fetchCarts(); 
        } else {
            alert(`Error al actualizar la cantidad: ${data.message}`);
        }
    })
        
    .catch(error => {
        console.error('Error al actualizar la cantidad:', error);
    });
}


fetchCarts();  