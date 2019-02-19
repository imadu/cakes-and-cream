const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;
const  ObjectId  = Schema.Types.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  size: [{ type: Number, required: true }],
  flavor: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: ObjectId, ref: 'ProductCategory' },
});

const productCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  Products: [{ type: ObjectId, ref: 'Product' }],
});

const Product = mongoose.model('Product', productSchema);
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = { Product, ProductCategory };
