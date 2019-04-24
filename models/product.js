const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const productSchema = new Schema({
  name: { type: String, required: true },
  size: [{ value: Number, price: Number }],
  flavor: [{ name: String }],
  description: { type: String },
  category: { type: ObjectId, ref: 'ProductCategory' },
  productThumbnail: [{ name: String, url: String }],
  featured: { type: Boolean, default: false },
});
const productCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  categoryThumbnail: { name: String, url: String },
  Products: [{ type: ObjectId, ref: 'Product' }],
});

const Product = mongoose.model('Product', productSchema);
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = { Product, ProductCategory };
