const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: Number
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pendiente', 'Pagado', 'Enviado', 'Entregado'], default: 'Pendiente' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
