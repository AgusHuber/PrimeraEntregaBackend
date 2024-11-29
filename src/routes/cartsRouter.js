import { Router } from "express";
import { CartsMongoManager } from "../dao/managers/CartsMongoManager.js";
import { ProductsMongoManager } from "../dao/managers/ProductsMongoManager.js";
import { cartsModel } from "../dao/models/cartsModel.js";

export const router = Router();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    let cart = await CartsMongoManager.getCarts();
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error al buscar los carritos:", error);
    return res.status(500).json({
      error: "Error al buscar los carritos",
      detail: error.message,
    });
  }
});

// Obtener un carrito por ID y calcular el precio total de sus productos
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsModel.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }

    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.error("Error al buscar el carrito:", error);
    res.status(500).json({ error: "Error al buscar el carrito" });
  }
});

// Crear un nuevo carrito vacío
router.post("/", async (req, res) => {
  try {
    let newCart = await CartsMongoManager.createCart();
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ newCart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${error.message}` });
  }
});

// Añadir un producto a un carrito específico
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Verificar si el producto existe
    const product = await ProductsMongoManager.getProductsBy({ _id: pid });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar el carrito y verificar su existencia
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid
    );
    if (productInCart) {
      productInCart.quantity += 1; 
    } else {
      cart.products.push({ product: pid, quantity: 1 }); 
    }

    await cart.save();

    res.status(200).json({ message: "Producto añadido al carrito!", cart });
  } catch (error) {
    console.error("Error al añadir el producto al carrito:", error);
    res.status(500).json({ error: "Error al añadir el producto al carrito" });
  }
});

// Actualizar la cantidad de un producto en un carrito específico
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    // Buscar el carrito y el producto
    const cart = await cartsModel.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }

    const productInCart = cart.products.find(
      (p) => p.product._id.toString() === pid
    );
    if (!productInCart) {
      return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito` });
    }

    // Validar cantidad y actualizar
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser un número mayor a cero" });
    }

    productInCart.quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "La cantidad se ha actualizado correctamente",
      cart,
    });
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
    res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
});

// Reemplazar todos los productos de un carrito
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const updatedProducts = req.body.products;

  try {
    // Validar la lista de productos
    if (!Array.isArray(updatedProducts) || updatedProducts.length === 0) {
      return res.status(400).json({ error: "Los productos no son válidos" });
    }

    const cart = await CartsMongoManager.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }

    cart.products = updatedProducts; 
    await cart.save();

    res.status(200).json({ message: "El carrito se actualizó correctamente", cart });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

// Eliminar un producto de un carrito específico
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Buscar el carrito
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito` });
    }

    // Eliminar producto
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: `Producto con ID ${pid} eliminado del carrito` });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({
      error: "Error al eliminar el producto del carrito",
      detail: error.message,
    });
  }
});

// Vaciar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartsMongoManager.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }

    cart.products = []; 
    await cart.save();

    res.status(200).json({ message: "Todos los productos del carrito fueron eliminados" });
  } catch (error) {
    console.error("Error al eliminar los productos del carrito:", error);
    res.status(500).json({ error: "Error al eliminar los productos del carrito" });
  }
});