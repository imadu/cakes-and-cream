const mongoose = require('mongoose');
const config = require('../../../config')();

const { Schema } = mongoose;

const orderSchema = new Schema({
  order_id: { type: String },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  products: [{
    name: { type: String },
    price: { type: Number },
    attributes: [{ name: String, options: [{ option: String, value: Number }] }],
    quantity: { type: Number },
  }],
  substore: {
    type: String, enum: config.substore, default: config.substore[0], required: true,
  },
  deliveryAddress: { type: String },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  paymentMethod: { type: String, enum: ['card', 'transfer', 'cash'], default: 'card' },
  productStatus: { type: String, enum: ['being-made', 'stopped', 'done'], default: 'being-made' },
  grandTotal: { type: Number },
  createdAt: { type: Date, default: new Date() },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
