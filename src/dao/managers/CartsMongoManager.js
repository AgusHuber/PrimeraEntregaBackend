import { cartsModel } from "../models/cartsModel.js";

// Clase para gestionar los carritos utilizando MongoDB.
export class CartsMongoManager {

    // Obtiene un carrito por su ID y lo popula con los detalles de los productos.
    static async getById(id) {
        try {
            return await cartsModel.findById(id).populate("products.product");
        } catch (error) {
            throw new Error("Error al obtener el carrito: " + error.message);
        }
    }

    // Obtiene todos los carritos almacenados en la base de datos.
    static async getCarts() {
        try {
            return await cartsModel.find();
        } catch (error) {
            throw new Error("Error al obtener los carritos: " + error.message);
        }
    }

    // Crea un nuevo carrito vacío y lo retorna.
    static async createCart() {
        try {
            let newCart = await cartsModel.create({ products: [] });
            return newCart.toJSON();
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    // Actualiza un carrito existente por su ID.
    static async updateCart(id, cart) {
        try {
            return await cartsModel.findByIdAndUpdate(id, cart, { new: true });
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    }

    // Elimina un carrito por su ID.
    static async deleteCart(id) {
        try {
            return await cartsModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error al eliminar el carrito: " + error.message);
        }
    }
}