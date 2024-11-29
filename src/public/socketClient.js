console.log("Script cargado");
const socket = io();

// Scripts que se encargan de la vista de productos en tiempo real

// Variables del DOM
const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const closeModal = document.querySelector('.close');

// Abrir el modal
addProductBtn.addEventListener('click', () => {
    productModal.style.display = 'block';
});


// Cerrar el modal
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Enviar formulario de nuevo producto
productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(productForm);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        thumbnails: formData.get('thumbnails') ? formData.get('thumbnails').split(',') : [],
    };

    // Enviar solicitud al servidor
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error al crear el producto: ' + data.error);
            } else {
                alert('Producto creado con éxito.');
                productModal.style.display = 'none';
                productForm.reset();
            }
        })
        .catch(error => console.error('Error:', error));
});

// Escuchar actualizaciones de productos en tiempo real
socket.on('updateProducts', (productos) => {
    productList.innerHTML = '';
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ID:</strong> ${producto.id} <br>
            <strong>Nombre:</strong> ${producto.title} <br>
            <strong>Precio:</strong> ${producto.price} <br>
            <strong>Estado:</strong> ${producto.status ? 'Disponible' : 'No disponible'}
            
            <button onclick="deleteProduct(${producto.id})" class="btn btn-danger">Eliminar</button>
            <button onclick="addToCart(${producto.id})" class="btn btn-primary">Agregar al carrito</button>
            <button onclick="viewProductDetails(${producto.id})" class="btn btn-info">Ver detalles</button>
        `;
        productList.appendChild(li);
    });
});

let selectedCartId = null;

// Eliminar un producto
function deleteProduct(id) {
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}


// Agregar un producto al carrito seleccionado

function addToCart(productId) {
    fetch('/api/carts') 
        .then(response => response.json())
        .then(carts => {
            const cartOptions = carts.map(cart => `ID: ${cart.id}`).join('\n');
            const cartId = prompt(`Selecciona el carrito al que deseas agregar el producto:\n${cartOptions}`);

            if (!cartId || isNaN(cartId)) {
                alert('Selección de carrito inválida.');
                return;
            }


            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: 1 })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Producto agregado al carrito ${cartId}`);
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                })
                .catch(error => console.error('Error al agregar producto al carrito:', error));
        })
        .catch(error => console.error('Error al obtener la lista de carritos:', error));
}



// Función para mostrar detalles de un producto
function viewProductDetails(productId) {
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (!product || product.error) {
                alert('Producto no encontrado o error al obtenerlo');
                return;
            }

            productDetails.innerHTML = `
                <h3>Detalles del Producto</h3>
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Nombre:</strong> ${product.title}</p>
                <p><strong>Descripción:</strong> ${product.description || 'No disponible'}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Categoría:</strong> ${product.category || 'No disponible'}</p>
                <p><strong>Stock:</strong> ${product.stock || 'No disponible'}</p>
                <p><strong>Estado:</strong> ${product.status ? 'Disponible' : 'No disponible'}</p>
            `;
        })
        .catch(error => {
            console.error('Error al obtener detalles del producto:', error);
            alert('Error al obtener los detalles del producto');
        });
}

// Botón para gestionar carritos
const manageCartsBtn = document.getElementById('manageCartsBtn');

manageCartsBtn.addEventListener('click', () => {
    window.open('/manage-carts', '_blank'); 
});



