const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;
const  ObjectId  = Schema.Types.ObjectId;

const cakeSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  flavor: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: ObjectId, ref: 'CakeCategory' },
});

const cakeCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  Cakes: [{ type: ObjectId, ref: 'Cake' }],
});

const Cake = mongoose.model('Cake', cakeSchema);
const CakeCategory = mongoose.model('CakeCategory', cakeCategorySchema);
module.exports = { Cake, CakeCategory };
