const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en las variables de entorno.');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- SERVIR ARCHIVOS ESTÁTICOS ---

// 1. Panel de Administrador (React Build)
const distPath = path.join(__dirname, '../dist');
app.use('/admin', express.static(distPath));

// 2. Página de Visitantes/Tienda (Public)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// --- MANEJO DE RUTAS SPA ---

// Rutas de Admin (React Router)
app.get(/\/admin\/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send('Error: Admin build not found. Run npm run build.');
        }
    });
});

// Rutas de la Tienda (Fallback a index.html)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
