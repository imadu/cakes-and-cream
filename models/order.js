const mongoose = require('mongoose');
const config = require('../config')();

const { Schema } = mongoose;

const orderSchema = new Schema({
  order_id: { type: String },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String, required: true },
  products: [{
    name: { type: String },
    size: [{ value: Number, price: Number }],
    flavor: { type: String },
    quantity: { type: Number },
  }],
  substore: {
    type: String, enum: config.substore, default: config.substore[0], required: true,
  },
  delivery_address: { type: String },
  payment_status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  payment_method: { type: String, enum: ['card', 'transfer', 'cash'], default: 'card' },
  product_status: { type: String, enum: ['being-made', 'stopped', 'done'], default: 'being-made' },
  grandTotal: { type: Number },
  createdAt: { type: Date, default: new Date() },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
