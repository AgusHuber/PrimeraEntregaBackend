import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartsRouter } from "./routes/cartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tinhuber:Coder24@cluster0.ddxkffp.mongodb.net/",
      {
        dbName: "Agustin-ecommerce",
      }
    );
    console.log("Base de datos conectada!");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error connecting: ${error.message}`);
  }
};

connectDB();

