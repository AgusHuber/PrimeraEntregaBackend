// Autor: Agustin Huber

//Dependencias
import express from 'express';
import productsRouter from './routers/productsRouter.js';
import cartsRouter from './routers/cartsRouter.js';

const app = express();
const PORT = 8080;


app.use(express.json());

//Endpoints
app.use('/api/products', productsRouter);  
app.use('/api/carts', cartsRouter);

//Middleware
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
