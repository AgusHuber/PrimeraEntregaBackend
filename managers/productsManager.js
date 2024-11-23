//Clase ProductsManager con métodos para obtener, agregar, modificar y eliminar productos

import  Product  from '../models/productModels.js';

export class ProductsManager {
    constructor(path) {
        this.path = path;
    }

    // Método para obtener los productos con un limite de productos.
    async getProducts(limit) {
        try {
            const products = await Product.find();
            const plainProducts = products.map(product => product.toObject());

            if(!limit){
                return plainProducts;
            }
            if (isNaN(limit)|| limit < 1) {
                return {error: 'Limit debe ser un número y mayor a 0'}
            }
            return plainProducts.slice(0, limit);

        }catch (error) {
            return [];
        }
    }

    // Método para obtener un producto por id.
    async getProducById(productId){
        try {
            const product = await Product.findOne({id:productId});
            return product;
        } catch (error) {
            return {error: 'Error al obtener el producto'}
        }
    }

    // Método para agregar un producto.
    async addProduct(product) {
        try {
            // Obtiene el último producto para determinar el mayor ID actual
            const lastProduct = await Product.findOne().sort({ id: -1 }); // Ordena por `id` descendente
            const nextId = lastProduct ? lastProduct.id + 1 : 1; // Si no hay productos, el ID comienza en 1
    
            // Agrega el ID autogenerado al nuevo producto
            product.id = nextId;
    
            const newProduct = new Product(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return { error: 'Error al crear el producto' };
        }
    }

    // Método para modificar un producto filtrando por id.
    async updateProduct(id, updates) {
        try {
          // Intentamos encontrar y actualizar el producto
          const updatedProduct = await Product.findOneAndUpdate({ id },updates,{ new: true });
          if (updatedProduct) {
            return { success: true, message: "Producto actualizado con éxito.", product: updatedProduct };
          } else {
            return { success: false, message: `No se encontró un producto con id ${id}.` };
          }
        } catch (error) {
          // Capturamos cualquier error durante la operación
          console.error("Error al actualizar el producto:", error);
          return { success: false, error: "Ocurrió un error al intentar actualizar el producto." };
        }
    }


    // Método para eliminar un producto filtrando por id.
    async deleteProduct(id) {
        try {
        // Intentamos eliminar el producto con el id dado
        const result = await Product.deleteOne({ id });
    
        if (result.deletedCount > 0) {
            return { success: true, message: `Producto con id ${id} eliminado con éxito.` };
        } else {
            return { success: false, message: `No se encontró un producto con id ${id}.` };
        }
        } catch (error) {
        // Capturamos cualquier error durante la operación
        return onsole.error("Error al eliminar el producto:", error);
        }
    }
    
    }

