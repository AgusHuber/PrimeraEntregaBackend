//Clase cartsManager con metodos para obetener carritos, obtener carrito por id, agregar carrito y agregar producto al carrito

import { json } from 'express';
import Cart from '../models/cartsModels.js';
import Product from '../models/productModels.js';
import mongoose from 'mongoose';



export class CartsManager {
    constructor(path) {
        this.path = path;
    }

    // Método para obtener los carritos.
    async getCarts() {
        try {
            const carts = await Cart.find().populate('products.product');  // Esto carga los productos completos
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
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
            const carts = await Cart.find();
            const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;

            const newCart = new Cart({ id, products: [] });
            await newCart.save();

            return newCart;
        } catch (error) {
            return { error: 'Error al guardar el carrito' }
        }
    }


    // Método para agregar un producto a un carrito, validando que exista el producto en la persistencia.
    async addProductToCart(cartId, productId, quantity) {
        try {
        // Buscar el carrito por su id
        let cart = await Cart.findOne({ id: cartId });
    
        if (!cart) {
            // Crear el carrito si no existe
            cart = new Cart({ id: cartId, products: [] });
        }
    
        // Buscar el producto por el campo 'id'
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return { success: false, message: `Producto con id ${productId} no encontrado.` };
        }
    
        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === product._id.toString());
    
        if (productIndex >= 0) {
            // Incrementar la cantidad si el producto ya está en el carrito
            cart.products[productIndex].quantity += quantity;
        } else {
            // Agregar el producto al carrito si no está
            cart.products.push({ product: product._id, quantity });
        }
    
        // Guardar los cambios en el carrito
        await cart.save();
    
        return { success: true, message: `Producto con id ${productId} agregado al carrito con id ${cartId}.`, cart };
        } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return { success: false, error: "Error al agregar producto al carrito." };
        }
    }

    // Método para eliminar un producto de un carrito.
    async removeProductFromCart(cartID, id) {
        try {
            const cart = await Cart.findOne({ id: cartID });
            if (!cart) {
                return { success: false, message: `Carrito con id ${cartID} no encontrado.` };
            }
    
            // Convierte el id a un ObjectId para hacer la comparación correcta
            const productId = await Product.findOne({ id: id });
            if (!productId) {
                return { success: false, message: `Producto con id ${id} no encontrado.` };
            }

            console.log(productId);
    
            // Convierte el productId a ObjectId si es necesario
            const productObjectId = productId._id;
    
            const productIndex = cart.products.findIndex(p => p.product.toString() === productObjectId.toString());
            if (productIndex === -1) {
                return { success: false, message: `Producto con id ${productObjectId} no encontrado en el carrito.` };
            }
    
            cart.products.splice(productIndex, 1); // Elimina el producto del carrito
            await cart.save();
    
            return { success: true, message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al eliminar el producto del carrit manager' };
        }
    }

    // Método para actualizar la cantidad y el producto de un carrito.
    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findOne({ id: cartId });
            if (!cart) return { success: false, message: 'Carrito no encontrado' };
    
            cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
            await cart.save();
    
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    // Método para actualizar la cantidad de un producto en un carrito.
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            // Buscar el carrito por su id
            const cart = await Cart.findOne({ id: cartId });
            if (!cart) return { success: false, message: 'Carrito no encontrado' };

            const product = await Product.findOne({id: productId});
            const productObjectId = product._id;

            // Buscar el producto dentro del carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === productObjectId.toString());
            if (productIndex === -1) return { success: false, message: 'Producto no encontrado en el carrito' };

            // Actualizar la cantidad
            cart.products[productIndex].quantity = quantity;
            await cart.save();

            return { success: true, message: 'Cantidad actualizada', cart };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al actualizar la cantidad del producto' };
        }
    }
    
    // Método para vaciar un carrito.
    async clearCart(cartId) {
        try {
            const cart = await Cart.findOne({ id: cartId });
            if (!cart) return { success: false, message: 'Carrito no encontrado' };
    
            cart.products = []; // Vaciar el carrito
            await cart.save();
    
            return { success: true, message: 'Carrito vaciado correctamente' };
        } catch (error) {
            console.error(error);
            throw new Error('Error al vaciar el carrito');
        }
    }

    // Método para eliminar un carrito.
    async deleteCart(id) {
        try {
            const result = await Cart.deleteOne({ id: id });
            return result; // Devuelve el resultado de la operación
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }
    

}