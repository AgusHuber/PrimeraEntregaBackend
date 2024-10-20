//router en donde se definen las rutas para los productos

import { Router } from 'express';
import { ProductsManager } from '../managers/productsManager.js';

const router = Router();
const productsManager = new ProductsManager('./data/productos.json');

//Ruta para obtener los productos, con un limite de productos.
router.get('/',async(req, res)=>{
    try{
        const {limit} = req.query;
        const productos = await productsManager.getProducts(limit);
        return res.status(200).json(productos);
    }catch(error){
        console.log(error)
        return res.status(500).json({error: 'Error al obtener los productos'})
    }
})

//Ruta para obtener un producto por id.
router.get('/:pid', async (req, res)=>{
    try {
        const product = await productsManager.getProducById(req.params.pid);
        return res.status(200).json(product);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Error al obtener el producto'})
    }
})

//Ruta para agregar un producto en donde todos los campos son obligatorios excepto thumbnails.
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category} = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const newProduct = await productsManager.addProduct(req.body);
    res.status(201).json(newProduct);

    } catch (error) {
        return res.status(500).json({error: 'Error al guardar el producto'})
    }
    
});

//Ruta para modificar un producto por id.
router.put('/:pid', async (req, res) => {
    try {
        const product = await productsManager.updateProduct(parseInt(req.params.pid), req.body);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({error: 'Error al modificar el producto'})
    }
})

//Ruta para eliminar un producto por id.
router.delete('/:pid', async (req, res) => {
    try {
        const product = await productsManager.deleteProduct(parseInt(req.params.pid));
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({error: 'Error al eliminar el producto'})
    }
})

export default router;
