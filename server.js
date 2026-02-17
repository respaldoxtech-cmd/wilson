import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './db_connect.js';

dotenv.config();

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a Base de Datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Gesti funcionando' });
});

// --- SERVIR ARCHIVOS ESTÁTICOS ---

// 1. Panel de Administrador (GestiAdmin)
// Se sirve en la ruta /admin usando los archivos de la carpeta 'dist'
app.use('/admin', express.static(path.join(__dirname, 'dist')));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 2. Página de Visitantes/Usuarios (Public)
// Se sirve en la raíz / usando los archivos de la carpeta 'public'
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`- Visitantes: http://localhost:${PORT}/`);
  console.log(`- Admin:      http://localhost:${PORT}/admin`);
});