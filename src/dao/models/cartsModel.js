import mongoose from "mongoose";

// Esquema para los carritos en MongoDB.
const cartSchema = new mongoose.Schema(
  {
    // Array de productos en el carrito.
    products: [
      {
        // Referencia a la colección "products".
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        // Cantidad de ese producto en el carrito.
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Modelo para interactuar con la colección "Cart".
export const cartsModel = mongoose.model("Cart", cartSchema);

