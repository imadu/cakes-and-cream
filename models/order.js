const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const orderSchema = new Schema({
  order_id: { type: String },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String, required: true },
  cakes: [{
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    category: { type: String },
  }],
  location: { type: String, enum: ['OPEBI', 'SURULERE', 'VICTORIA-ISLAND', 'BERGER'], default: 'OPEBI' },
  delivery_address: { type: String },
  payment_status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'failed' },
  cake_status: { type: String, enum: ['being-made', 'stopped', 'done'], default: 'being-made' },
});

const Order = mongoose.Schema('Order', orderSchema);
module.exports = Order;
