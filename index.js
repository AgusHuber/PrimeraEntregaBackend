// Autor: Agustin Huber

// Dependencias
import express from 'express';
import productsRouter from './routers/productsRouter.js';
import cartsRouter from './routers/cartsRouter.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars'; 
import { ProductsManager } from './managers/productsManager.js';
import viewsRouter from './routers/viewsRouter.js';
import { setSocketIo } from './routers/productsRouter.js';
import connectDB from './db.js';

//defino io como variable global.
let io;

// Configuración de express
const app = express();
const PORT = 8080;

//Conectar a MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Configuración de handlebars
app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

// Integración de socket.io
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

io = new Server(httpServer);
setSocketIo(io);


// Inicializa el ProductsManager para traer los productos
const productsManager = new ProductsManager('./data/productos.json');

app.get('/home', async (req, res) => {
    try {
        const productos = await productsManager.getProducts();
        res.render('home', { title: 'Bienvenido a la tienda', message: 'Explora nuestros productos', productos });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    } 
});


// Rutas para API
app.use('/api/products', (req, res, next) => {
    req.serverSocket = io;
    next();
}, productsRouter);

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on("connection", socket => {

    socket.on('addProduct', async (product) => {
        await productsManager.addProduct(product);
        const productos = await productsManager.getProducts();
        io.emit('updateProducts', productos);
    });
});

