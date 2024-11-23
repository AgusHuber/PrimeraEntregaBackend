//router en donde se definen las rutas para los carritos

import { Router } from "express";
import { CartsManager } from "../managers/cartsManager.js";

const router = Router();
const cartsManager = new CartsManager;

//Ruta para obtener los carritos.
router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        return res.status(200).json(carts);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los carritos' });
    }
})

//Ruta para obtener un carrito por id.
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartsManager.getCartsById(req.params.cid);
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
})

// Ruta para agregar un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.addCart();  // Crear el nuevo carrito

        // Obtener la lista actualizada de carritos
        const carts = await cartsManager.getCarts();

        // Emitir el evento 'updateCarts' para notificar a todos los clientes conectados
        io.emit('updateCarts', carts);  // Emitir la lista de carritos actualizada

        // Retornar el nuevo carrito al cliente
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ error: 'Error al guardar el carrito' });
    }
});


//Ruta para agregar un producto a un carrito.
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Obtener los parámetros de la URL
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Obtener la cantidad desde el cuerpo de la solicitud (si no se proporciona, predeterminar a 1)
        const quantity = req.body.quantity || 1;

        // Llamar al método para agregar el producto al carrito
        const cart = await cartsManager.addProductToCart(cartId, productId, quantity);

        // Retornar el carrito actualizado
        return res.status(200).json(cart);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Ruta para eliminar un carrito por su ID
router.delete('/:cid', async (req, res) => {
    try {
        const cartID = parseInt(req.params.cid);
        const result = await cartsManager.deleteCart(cartID);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Carrito con ID ${cartID} no encontrado.` });
        }

        return res.status(200).json({ message: `Carrito con ID ${cartID} eliminado correctamente.` });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        return res.status(500).json({ error: 'Error al eliminar el carrito.' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartsManager.removeProductFromCart(cid, pid); // Usamos el método del manager

        if (!result.success) {
            return res.status(404).json({ error: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});


// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }

        // Llamar al método del cartsManager para actualizar la cantidad
        await cartsManager.updateProductQuantity(cid, pid, quantity);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
});


export default router;

