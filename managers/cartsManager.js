//Clase cartsManager con metodos para obetener carritos, obtener carrito por id, agregar carrito y agregar producto al carrito

import fs from 'fs/promises';
import { ProductsManager } from './productsManager.js';



export class CartsManager {
    constructor(path) {
        this.path = path;
    }

    // Método para obtener los carritos.
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    // Método para obtener un carrito por id.
    async getCartsById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id == id);
        } catch (error) {
            return { error: 'Error al obtener el carrito' }
        }
    }

    // Método para agregar un nuevo carrito sin productos.
    async addCart() {
        try {
            const carts = await this.getCarts();
            const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;

            const newCart = { id, products: [] };
            carts.push(newCart);
            await this.saveCarts(carts);

            return newCart;
        } catch (error) {
            return { error: 'Error al guardar el carrito' }
        }
    }

    // Método para agregar un producto a un carrito, validando que exista el producto en la persistencia.
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const product = await new ProductsManager('./data/productos.json').getProducById(productId);
            
            const index = carts.findIndex(cart => cart.id === cartId);
            if (index === -1){
                return {error: 'Carrito no encontrado'}
            }

            if (product === undefined) {
                return { error: 'Producto no encontrado' }
            }

            const productIndex = carts[index].products.findIndex(p => p.product === productId);
            
            if (productIndex === -1) {
                carts[index].products.push({ product: productId, quantity: 1 });
            } else {
                carts[index].products[productIndex].quantity++;
            }

            await this.saveCarts(carts);
            return carts[index];

        } catch (error) {
            return { error: 'Error al agregar el producto al carrito' }
        }
    }

    // Método para guardar los carritos.
    async saveCarts(carts){
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.log(error);
        }
    }

}