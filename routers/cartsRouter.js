//router en donde se definen las rutas para los carritos

import { Router } from "express";
import { CartsManager } from "../managers/cartsManager.js";

const router = Router();
const cartsManager = new CartsManager('./data/carrito.json');

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

//Ruta para agregar un carrito.
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.addCart();
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ error: 'Error al guardar el carrito' });
    }
})

//Ruta para agregar un producto a un carrito.
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartsManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
})

export default router;
