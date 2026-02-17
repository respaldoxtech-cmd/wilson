import mongoose from 'mongoose';

// IMPORTANTE: Reemplaza <db_password> con tu contraseña real de la base de datos
const uri = "mongodb+srv://w:ender1@w.tssdudb.mongodb.net/?appName=w";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('¡Conectado a MongoDB Atlas exitosamente!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

connectDB();