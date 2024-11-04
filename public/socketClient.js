console.log("Script index cargado");
const socket = io();

//Scripts que se encargan de la vista de productos en tiempo real

const productList = document.getElementById('productList');

socket.on('updateProducts', (productos) => {
    productList.innerHTML = '';
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ID:</strong> ${producto.id} <br>
            <strong>Nombre:</strong> ${producto.name} <br>
            <strong>Precio:</strong> ${producto.price} <br>
            <strong>Estado:</strong> ${producto.status ? 'Disponible' : 'No disponible'}
            
            <button onclick="deleteProduct(${producto.id})">Eliminar</button> <!-- Botón de eliminar -->
            
        `;
        productList.appendChild(li);
    });
});


// Función para eliminar un producto

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



