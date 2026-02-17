import mongoose from 'mongoose';

// IMPORTANTE: Reemplaza <db_password> con tu contraseña real de la base de datos
const uri = process.env.MONGODB_URI || "mongodb+srv://w:ender1@w.tssdudb.mongodb.net/?appName=w";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`¡Conectado a MongoDB Atlas exitosamente: ${conn.connection.host}!`);
    return conn;
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;