const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;
const  ObjectId  = Schema.Types.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  size: [{ value: Number }],
  flavor: [{ name: String }],
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: ObjectId, ref: 'ProductCategory' },
  productThumbnail: [{ name: String, url: String, blob: String }],
});

const productCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  Products: [{ type: ObjectId, ref: 'Product' }],
});

const Product = mongoose.model('Product', productSchema);
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = { Product, ProductCategory };
