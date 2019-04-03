
const Model = require('../models/product');

const { Product, ProductCategory } = Model;

const ProductController = {
  // get all categories
  async getCategory(req, res) {
    const data = await ProductCategory.find({}).populate('Products');
    if (!data) {
      res.status(400).send({ success: false, message: 'no categories found' });
      return;
    }
    res.status(200).json(data);
  },

  // get category by id
  async getCategoryId(req, res) {
    try {
      const idparams = req.params.id;
      const data = await ProductCategory.find({ _id: idparams }).populate('Products');
      res.status(200).json(data);
      return;
    } catch (error) {
      res.status(400).send({ success: false, message: `no category found with id  ${req.params.id}`, error });
    }
  },

  // create a new Product category
  async createCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const err = req.validationErrors();
    if (err) {
      res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
      return;
    }
    const { name } = req.body;
    const nameExists = await ProductCategory.find({ name });
    if (nameExists) {
      res.status(409).send({ success: false, message: ' categories with same names are not allowed' });
      return;
    }
    let categoryForm = {};
    categoryForm = req.body;
    const newCategory = new ProductCategory(categoryForm);
    try {
      await newCategory.save();
    } catch (error) {
      res.status(500).send({ success: false, message: 'something went wrong', error });
      return;
    }
    res.status(200).send({ success: true, category: newCategory.id });
  },
  // update a category
  async updateCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const err = req.validationErrors();
    if (err) {
      res.status(400).send({ success: false, message: 'there are some errors in your form', err });
      return;
    }
    const idParams = req.params.id;
    const newSectionData = req.body;
    try {
      const data = await ProductCategory.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      res.status(200).send({ success: true, message: 'category updated', data });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `could not update category with id ${req.params.id}`, error });
    }
  },
  // remove the category
  async deleteCategory(req, res) {
    const idParams = req.params.id;
    try {
      await ProductCategory.remove({ _id: idParams });
      res.status(200).send({ success: true, message: `category with id ${req.params.id} successfully removed` });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
    }
  },
  // get all Products
  async getProducts(req, res) {
    try {
      const data = await Product.find({});
      res.status(200).send({ success: true, data });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: 'could not find any products', error });
    }
  },
  // get a particular Product
  async getProduct(req, res) {
    const idParams = req.params.id;
    try {
      const data = await Product.find({ _id: idParams });
      res.status(200).send({ success: true, data });
      return;
    } catch (error) {
      res.status(404).send({ success: false, message: `something went wrong, could not find product with id ${idParams}`, error });
    }
  },

  // create a Product
  async makeProduct(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('size', 'empty size').notEmpty();
    req.checkBody('price', 'empty price').notEmpty();
    const { name } = req.body;
    const cat = req.body.category;
    const category = await ProductCategory.findOne({ name: cat });
    console.log('category is', category);
    const nameExists = await Product.findOne({ name });
    // check if category for Product exist and ensure that no Product has duplicate names
    if (!category) {
      res.status(400).send({ success: false, message: 'category does not exist, cannot create Product without category' });
      return;
    }
    if (nameExists) {
      res.status(409).send({ success: false, message: 'name already exists for Product, please choose a different name' });
      return;
    }
    // if it pass tests then create Product
    let ProductForm = {};
    ProductForm = req.body;
    ProductForm.category = category.id;
    const newProduct = new Product(ProductForm);
    if (typeof req.files !== 'undefined') {
      ProductForm.productThumbnail = [];
      req.files.forEach((element) => {
        newProduct.productThumbnail.push({
          name: element.fieldname,
          url: element.url,
          blob: element.blobName,
        });
      });
    } else {
      newProduct.productThumbnail = null;
    }
    try {
      await newProduct.save();
    } catch (error) {
      res.status(400).send({ success: false, message: 'unable to upload new product', error });
      return;
    }
    category.Products.push(newProduct.id);
    await category.save();
    res.status(201).send({ success: true, message: 'Product made successfully!', category: category.id });
  },
  // update a Product
  async editProduct(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('size', 'empty size').notEmpty();
    req.checkBody('price', 'empty price').notEmpty();
    const err = req.validationErrors();
    if (err) {
      res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
      return;
    }
    const newSectionData = req.body;
    const idParams = req.params.id;
    try {
      const data = await Product.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      res.status(200).send({ success: true, message: 'updated the data', data });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `could not update the product with id ${req.params.id}`, error });
    }
  },
  // delete a Product
  async deleteProduct(req, res) {
    const idParams = req.params.id;
    try {
      const removed = await Product.remove({ _id: idParams });
      res.status(200).send({ success: true, message: `successfully deleted the product with id ${idParams}`, removed });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
    }
  },

};

module.exports = ProductController;
