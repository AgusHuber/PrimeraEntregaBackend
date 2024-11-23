// routers/viewsRouter.js

import express from 'express';
import { ProductsManager } from '../managers/productsManager.js';

const router = express.Router();
const productsManager = new ProductsManager;

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await productsManager.getProducts();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', message: 'Lista de Productos', productos });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Nueva ruta para la vista de gestión de carritos
router.get('/manage-carts', (req, res) => {
    res.render('manageCarts', { title: 'Gestión de Carritos' });
});

export default router;