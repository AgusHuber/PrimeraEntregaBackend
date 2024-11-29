import { Router } from "express";
import { ProductsMongoManager } from "../dao/managers/ProductsMongoManager.js";

export const router = Router();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    // Obtener todos los productos de la base de datos
    const products = await ProductsMongoManager.getProducts();
    res.status(200).json(products); // Responder con los productos en formato JSON
  } catch (error) {
    console.error("Error al buscar los productos:", error);
    res.status(500).json({ error: "Error al buscar los productos" }); 
  }
});

// Ruta para obtener un producto específico por su ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params; 

  try {
    // Buscar el producto en la base de datos por su ID
    const product = await ProductsMongoManager.getProductsByIds({ _id: pid });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" }); 
    }
    res.status(200).json(product); 
  } catch (error) {
    console.error("Error al buscar el producto:", error);
    res.status(500).json({ error: "Error al buscar el producto" }); 
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body; 

  try {
    // Verificar si ya existe un producto con el mismo código
    const existingProduct = await ProductsMongoManager.getProductsBy({ code });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con dicho código" }); 
    }

    // Crear un nuevo producto en la base de datos
    const newProduct = await ProductsMongoManager.createProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });

    res.status(201).json({ newProduct }); 
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
  const { pid } = req.params; 
  const { title, description, code, price, stock, category, thumbnails } =
    req.body; 

  try {
    // Actualizar el producto en la base de datos
    const updatedProduct = await ProductsMongoManager.updateProduct(pid, {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" }); 
    }

    res
      .status(200)
      .json({ message: "Producto actualizado con éxito!", updatedProduct }); 
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params; 

  try {
    // Eliminar el producto de la base de datos
    const deletedProduct = await ProductsMongoManager.deleteProduct(pid);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" }); 
    }

    res.status(200).json({ message: "Producto eliminado con éxito!" });
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    res.status(500).json({ error: "Error al eliminar el producto" }); 
  }
});
