const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const cakeSchema = new Schema({
  name: { type: String },
  size: { type: Number },
  flavor: { type: String },
  description: { type: String },
  price: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'CakeCategory' },
});

const cakeCategorySchema = new Schema({
  name: { type: String },
  desc: { type: String },
  cakes: [{ type: Schema.Types.ObjectId, ref: 'Cake' }],
});

const Cake = mongoose.model('Cake', cakeSchema);
const CakeCategory = mongoose.model('CakeCategory', cakeCategorySchema);
module.exports = { Cake, CakeCategory };
