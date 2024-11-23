import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://tinhuber:Alcatel23@cluster0.ddxkffp.mongodb.net/',{
        });
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;