const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no definida');
    process.exit(1);
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB para seeding');

        const email = 'admin@powerguard.com';
        const password = 'admin123'; // <--- ESTA ES LA CLAVE

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('ℹ️ El usuario admin ya existe. Actualizando contraseña...');
            existingUser.password = password;
            await existingUser.save();
        } else {
            const admin = new User({
                nombre: 'Administrador Principal',
                email: email,
                password: password,
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Usuario admin creado exitosamente');
        }

        console.log('\n-----------------------------------');
        console.log('USUARIO:', email);
        console.log('CLAVE:', password);
        console.log('-----------------------------------\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedAdmin();
