//router en donde se definen las rutas para los productos

import { Router } from 'express';
import { ProductsManager } from '../managers/productsManager.js';
import Product from '../models/productModels.js';

const router = Router();
const productsManager = new ProductsManager;

//integro io como variable global para poder ser utilizada.
let io;
export const setSocketIo = (socketIo) => {
    io = socketIo;
};

//Ruta para obtener los productos, con un limite de productos.
router.get('/', async (req, res) => {
    try {

        const {
            limit = 10, 
            page = 1, 
            sort, 
            query 
        } = req.query;


        const filter = query ? { $or: [
            { title: { $regex: query, $options: "i" } }, 
            { category: { $regex: query, $options: "i" } } 
        ] } : {};


        const options = {
            limit: parseInt(limit), 
            page: parseInt(page), 
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
        };


        const products = await Product.paginate(filter, options);


        const prevLink = products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query || ''}` : null;
        const nextLink = products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query || ''}` : null;


        res.status(200).json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink,
            nextLink
        });

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
});

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
    const productos = await productsManager.getProducts();


    req.serverSocket.emit('updateProducts', productos);

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


         req.serverSocket.emit('updateProducts', await productsManager.getProducts());
         return res.status(200).json(product);
     } catch (error) {
         return res.status(500).json({error: 'Error al eliminar el producto router'})
     }
})

export default router;
