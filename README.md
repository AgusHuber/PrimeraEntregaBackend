# Ecommerce en Node.js

Este proyecto es una tienda en línea construida con **Node.js**, **Express**, **MongoDB**, **Handlebars** y **Mongoose**. Permite gestionar productos, carritos de compras, y realizar operaciones como agregar productos al carrito, ver el total de la compra, ordenar los productos y más.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para crear la API y gestionar las rutas.
- **MongoDB**: Base de datos NoSQL para almacenar productos y carritos.
- **Mongoose**: ODM (Object Data Modeling) para interactuar con MongoDB.
- **Nodemon**: Herramienta para reiniciar automáticamente el servidor durante el desarrollo.
- **Handlebars**: Motor de plantillas para renderizar las vistas.

## Instalacion de dependencias necesarias

npm install express express-handlebars mongo mongodb mongoose mongoose-paginate-v2 nodemon socket.io


## Endpoint de la API

**Productos**

**GET** /api/products: Obtener todos los productos.
**GET** /api/products/:pid: Obtener un producto por su ID.
**POST** /api/products: Crear un nuevo producto.
**PUT** /api/products/:pid: Actualizar un producto por su ID.
**DELETE** /api/products/:pid: Eliminar un producto por su ID.

**Carritos**

**GET** /api/carts: Obtener todos los carritos.
**GET** /api/carts/:cid: Obtener un carrito por su ID.
**POST** /api/carts: Crear un nuevo carrito.
**POST** /api/carts/:cid/products/:pid: Agregar un producto al carrito.
**PUT** /api/carts/:cid/products/:pid: Actualizar la cantidad de un producto en el carrito.
**DELETE** /api/carts/:cid/products/:pid: Eliminar un producto del carrito.
**DELETE** /api/carts/:cid: Vaciar el carrito.

## Inicio de la API

**Scripts**
**npm run dev**: Inicia el servidor en modo desarrollo con nodemon.
**npm start**: Inicia el servidor en modo producción.

## Rutas de las vistas

**ruta del home:** http://localhost:8080/
**ruta de gestion de productos:** http://localhost:8080/products
**ruta de gestion de carrito** http://localhost:8080/carts




