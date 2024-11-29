import { Router } from "express";
import { ProductsMongoManager } from "../dao/managers/ProductsMongoManager.js";
import { CartsMongoManager } from "../dao/managers/CartsMongoManager.js";
import { cartsModel } from "../dao/models/cartsModel.js";

export const router = Router();

// Ruta para renderizar la página principal
router.get("/", (req, res) => {
  res.render("home"); // Renderiza la vista 'home'
});

// Ruta para mostrar productos con paginación, filtros y ordenamiento
router.get("/products", async (req, res) => {
  // Extraer parámetros de consulta con valores predeterminados
  let { page = 1, limit = 10, query = "", sort = "" } = req.query;

  // Convertir los parámetros a números y asegurar que sean válidos
  page = parseInt(page);
  limit = parseInt(limit);
  if (isNaN(page) || page <= 0) page = 1; 
  if (isNaN(limit) || limit <= 0) limit = 10; 

  // Filtro para buscar por categoría (o cualquier campo que coincida con el query)
  let filter = {};
  if (query) {
    filter.category = new RegExp(query, "i"); 
  }

  // Configuración de ordenamiento según el precio
  let sortOption = {};
  if (sort === "asc") {
    sortOption.price = 1; 
  } else if (sort === "desc") {
    sortOption.price = -1; 
  }

  try {
    // Obtener los productos con filtros, paginación y ordenamiento
    let {
      docs: products,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    } = await ProductsMongoManager.getProducts(filter, page, limit, sortOption);

    let cart = await CartsMongoManager.getCarts();

    // Renderizar la vista 'index' con los datos obtenidos
    res.render("index", {
      products,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      page,
      limit,
      query,
      sort,
      cartId: cart[0]._id.toString(), 
    });
  } catch (error) {
    console.error("Error al renderizar:", error);
    res.status(500).send("Error al renderizar");
  }
});

// Ruta para mostrar detalles de un producto específico
router.get("/products/:id", async (req, res) => {
  const { id } = req.params; 

  try {
    const product = await ProductsMongoManager.getProductsBy({ _id: id });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Renderizar la vista 'productDetails' con los datos del producto
    res.render("productDetails", { product });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta para mostrar todos los carritos
router.get("/carts", async (req, res) => {
  try {
    let cart = await CartsMongoManager.getCarts();

    // Renderizar la vista 'carts' con la lista de carritos
    res.render("carts", { cart });
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).send("Error al obtener los carritos");
  }
});

// Ruta para mostrar detalles de un carrito específico
router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params; 

  try {
    const cart = await cartsModel.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Calcular el precio total del carrito
    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    
    const products = cart.products.map((p) => p.toJSON());

    // Renderizar la vista 'carts' con los datos del carrito
    res.render("carts", {
      cartId: cid,
      products,
      totalPrice,
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});
