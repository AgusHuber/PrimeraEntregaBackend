import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"; // Plugin para paginación.

// Esquema para los productos en MongoDB.
const productSchema = new mongoose.Schema(
  {
    // Título del producto.
    title: String,
    // Descripción del producto.
    description: String,
    // Código único del producto.
    code: {
      type: String,
      unique: true,
    },
    // Precio del producto.
    price: Number,
    // Cantidad disponible en el inventario.
    stock: {
      type: Number,
      default: 0,
    },
    // Categoría del producto.
    category: String,
    // Array de URLs de imágenes del producto.
    thumbnails: {
      type: Array,
      default: [],
    },
  },
  {
    collection: "products", 
  }
);

// Agrega el plugin de paginación al esquema.
productSchema.plugin(paginate);

// Modelo para interactuar con la colección "products".
export const productsModel = mongoose.model("products", productSchema);


