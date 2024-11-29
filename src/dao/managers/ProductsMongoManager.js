import { productsModel } from "../models/productsModel.js";

// Clase para gestionar productos utilizando MongoDB.
export class ProductsMongoManager {
    // Obtiene una lista paginada de productos con filtro, página, límite y opciones de ordenamiento.
    static async getProducts(filter = {}, page = 1, limit = 10, sortOption = {}) {
        const sort = sortOption.price ? { price: sortOption.price } : {}; // Ordena por precio si se proporciona.
        
        return await productsModel.paginate(filter, {
        limit,
        page,
        lean: true,
        sort,
        });
    }

    // Busca un único producto por el filtro proporcionado.
    static async getProductsBy(filter = {}) {
        return await productsModel.findOne(filter).lean();
    }

    // Obtiene múltiples productos utilizando una lista de IDs.
    static async getProductsByIds(ids) {
        return await productsModel.find({ _id: { $in: ids } }).lean();
    }

    // Crea un nuevo producto en la base de datos.
    static async createProduct(product = {}) {
        let newProduct = await productsModel.create(product);
        return newProduct;
    }

    // Actualiza un producto existente por su ID.
    static async updateProduct(id, product) {
        return await productsModel
        .findByIdAndUpdate(id, product, { new: true })
        .lean();
    }

    // Elimina un producto por su ID.
    static async deleteProduct(id) {
        return await productsModel.findByIdAndDelete(id).lean();
    }
}

