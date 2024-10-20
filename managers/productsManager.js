//Clase ProductsManager con métodos para obtener, agregar, modificar y eliminar productos

import fs from 'fs/promises'

export class ProductsManager {
    constructor(path) {
        this.path = path;
    }

    // Método para obtener los productos con un limite de productos.
    async getProducts(limit) {
        try {
            const products = await fs.readFile(this.path, 'utf-8');

            if(!limit){
                return JSON.parse(products);
            }
            if (isNaN(limit)|| limit < 1) {
                return {error: 'Limit debe ser un número y mayor a 0'}
            }
            return JSON.parse(products).slice(0, limit);

        }catch (error) {
            return [];
        }
    }

    // Método para obtener un producto por id.
    async getProducById(id){
        try {
            const product = await this.getProducts();
            return product.find(product => product.id == id);
        } catch (error) {
            return {error: 'Error al obtener el producto'}
        }
    }

    // Método para agregar un producto.
    async addProduct(product){
        try {
            const products = await this.getProducts();
            let newId = 1
            if (products.length >= 1) {
                newId = products[products.length - 1].id + 1;
            }
            const newProduct = { id: newId, status: true, ...product };

            products.push(newProduct);
            await this.saveProducts(products);
            return newProduct;
        } catch (error) {
            
        }
    }

    // Método para modificar un producto filtrando por id.
    async updateProduct(id, modificaciones){
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return {error: 'Producto no encontrado'}
            }else{
                products[index] = {...products[index], ...modificaciones, id};
                await this.saveProducts(products);
                return products[index];
            }
        } catch (error) {
            return {error: 'Error al modificar el producto'}
        }
    }

    // Método para eliminar un producto filtrando por id.
    async deleteProduct(id){
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return {error: 'Producto no encontrado'}
            }else{
                const productoEliminado = products[index];
                products.splice(index, 1);
                await this.saveProducts(products);
                return {"Producto eliminado": productoEliminado};
            }
        } catch (error) {
            return {error: 'Error al eliminar el producto'}
            
        }
    }

    // Método para guardar los productos en el archivo productos.json.
    async saveProducts(products){
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        }catch (error) {
            console.log(error)
        }
    }
}

