const Model = require('../models/product');

const { Product, ProductCategory } = Model;

const ProductController = {
  // get all categories
  getCategory(req, res) {
    ProductCategory.find({}).populate('Products').exec((err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    });
  },

  // get category by id
  getCategoryId(req, res) {
    const idparams = req.params.id;
    ProductCategory.find({ _id: idparams }).populate('Products').exec((err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    });
  },

  // create a new Product category
  createCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const err = req.validationErrors();
    if (err) res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
    const name = req.body.name;
    ProductCategory.findOne({ name }, (error, category) => {
      if (error) {
        res.status(500).send({ success: false, message: 'something went wrong', err });
      }
      if (category) {
        res.status(409).send({ success: false, message: 'duplicate categories cannot exist' });
      } else {
        let categoryForm = {};
        categoryForm = req.body;
        const newCategory = new ProductCategory(categoryForm);
        newCategory.save((error2) => {
          if (error2) {
            res.status(500).send({ success: false, message: 'something went wrong', error });
          } else {
            res.status(200).send({ success: true, category: newCategory.id });
          }
        });
      }
    });
  },

  // update a category
  updateCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const idParams = req.params.id;
    const newSectionData = req.body;
    ProductCategory.update({ _id: idParams },
      { $set: newSectionData }, { upsert: true }, (err, data) => {
        if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
        else res.status(200).send({ success: true, message: 'updated the data', data });
      });
  },

  // remove the category
  deleteCategory(req, res) {
    const idParams = req.params.id;
    ProductCategory.remove({ _id: idParams }, (err, removed) => {
      if (err) throw err;
      return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
    });
  },

  // get all Products
  getProducts(req, res) {
    Product.find({}, (err, Product) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, Product });
    });
  },
  // get a particular Product
  getProduct(req, res) {
    const idParams = req.params.id;
    Product.find({ _id: idParams }, (err, Product) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, Product });
    });
  },

  // create a Product
  async makeProduct(req, res) {
    try {
      req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('size', 'empty size').notEmpty();
      req.checkBody('price', 'empty price').notEmpty();
      const cat = req.body.category;
      const name = req.body.name;
      const category = await ProductCategory.findOne({ name: cat });
      const duplicateName = await Product.findOne({ name });
      // check if category for Product exist and ensure that no Product has duplicate names
      if (!category) return res.status(400).send({ success: false, message: 'category does not exist, cannot create Product without category' });
      if (duplicateName) return res.status(400).send({ success: false, message: 'duplicate names exist for Product' });
      // if it pass tests then create Product
      let ProductForm = {};
      ProductForm = req.body;
      ProductForm.category = category.id;
      const newProductForm = new Product(ProductForm);
      newProductForm.save(() => {
        category.Products = newProductForm.id;
        category.save(() => {
          res.status(201).send({ success: true, message: 'Product made successfully!', category: category.id });
        });
      });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

  // update a Product
  editProduct(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('size', 'empty size').notEmpty();
    req.checkBody('price', 'empty price').notEmpty();
    const err = req.validationErrors();
    if (err) res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
    const newSectionData = req.body;
    const idParams = req.params.id;
    Product.update({ _id: idParams }, { $set: newSectionData }, { upsert: true }, (error, data) => {
      if (error) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, message: 'updated the data', data });
    });
  },
  // delete a Product
  deleteProduct(req, res) {
    const idParams = req.params.id;
    Product.remove({ _id: idParams }, (err, removed) => {
      if (err) throw err;
      return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
    });
  },

};

module.exports = ProductController;
