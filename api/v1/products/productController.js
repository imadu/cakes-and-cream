
const { Product, ProductCategory } = require('./productModel');

const CategoryController = {
  // get all categories
  async index(req, res) {
    try {
      const data = await ProductCategory.find({}).and({ storeid: req.createdBy.storeid }).populate('Products');
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).send({ success: false, message: 'no categories found' });
    }
  },

  // get category by id
  async get(req, res) {
    const idparams = req.params.id;
    try {
      const data = await ProductCategory.findOne({ storeid: req.createdBy.storeid }).and({ _id: idparams }).populate('Products');
      return res.status(200).send({ success: true, data });
    } catch (error) {
      return res.status(400).send({ success: false, message: `no category found with id  ${req.params.id}`, error });
    }
  },

  async getName(req, name) {
    try {
      const nameExists = await ProductCategory.findOne({ storeid: req.createdBy.id }).and({ name });
      return nameExists.name;
    } catch (error) {
      throw error;
    }
  },

  // create a new Product category
  async create(req, res) {
    const { name } = req.body;
    const nameExists = await this.getName(req, name);
    if (nameExists) {
      return res.status(409).send({ success: false, message: ' categories with same names are not allowed' }); 
    }
    let categoryForm = {};
    categoryForm = req.body;
    categoryForm.storeid = req.createdBy.storeid;
    const newCategory = new ProductCategory(categoryForm);
    // file upload for category
    if (typeof req.file !== 'undefined') {
      newCategory.categoryThumbnail = {
        name: req.file.public_id,
        url: req.file.url,
      };
    } else {
      newCategory.categoryThumbnail = null;
    }
    // save the category;
    try {
      await newCategory.save();
    } catch (error) {
      return res.status(500).send({ success: false, message: 'something went wrong', error });
    }
    return res.status(200).send({ success: true, category: newCategory.id });
  },
  // update a category
  async update(req, res) {
    const idParams = req.params.id;
    const newSectionData = req.body;
    try {
      const data = await ProductCategory.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      return res.status(200).send({ success: true, message: 'category updated', data });
    } catch (error) {
      return res.status(500).send({ success: false, message: `could not update category with id ${req.params.id}`, error });
    }
  },
  // remove the category
  async delete(req, res) {
    const idParams = req.params.id;
    // find the category first
    const oldCategory = await this.get(req);
    // check if there is a category named 'uncategorized'
    let uncategorised = await this.getName(req, 'uncategorized');
    // if no uncategorized category, create a new one
    if (!uncategorised) {
      try {
        uncategorised = await this.create(req);
        // then push the products into the new uncategorised category
        oldCategory.Products.forEach((element) => {
          uncategorised.Products.push(element);
        });
        await uncategorised.save();
      } catch (error) {
        res.status(500).send({ success: false, message: 'could not create uncategorized category to move products into', error });
        return;
      }
      try {
        // update all the products with the new product category
        await Product.updateMany({ category: idParams }, { category: uncategorised.id }, { new: true });
      } catch (error) {
        res.status(500).send({ success: false, message: 'could not update products with uncategorized id', error });
        return;
      }
      // then remove the product finally
      try {
        await ProductCategory.removeOne({ _id: idParams });
        res.status(200).send({ success: true, message: `category with id ${req.params.id} successfully removed` });
        return;
      } catch (error) {
        res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
      }
      return;
    }

    // if  uncaregorized category exists then do the following this has been a lot...whew!
    if (uncategorised) {
      try {
        await Product.updateMany({ category: idParams }, { category: uncategorised.id }, { new: true });
      } catch (error) {
        res.status(500).send({ success: false, message: 'could not update products with uncategorized id', error });
        return;
      }
      try {
        oldCategory.Products.forEach((element) => {
          uncategorised.Products.push(element);
        });
        await uncategorised.save();
        await ProductCategory.removeOne({ _id: idParams });
        res.status(200).send({ success: true, message: `category with id ${req.params.id} successfully removed` });
        return;
      } catch (error) {
        res.status(500).send({ success: false, message: 'An error occured', error });
      }
    }
  },
};

const ProductController = {
  async index(req, res) {
    try {
      const data = await Product.find({ storeid: req.createdBy.storeid });
      return res.status(200).send({ success: true, data });
    } catch (error) {
      return res.status(500).send({ success: false, message: 'could not find any products', error });
    }
  },
  // get a particular Product
  async get(req, res) {
    const idParams = req.params.id;
    try {
      const data = await Product.findOne({ _id: idParams }).populate('category', 'name');
      return res.status(200).send({ success: true, data });
    } catch (error) {
      return res.status(404).send({ success: false, message: `something went wrong, could not find product with id ${idParams}`, error });
    }
  },

  // create a Product
  async create(req, res) {
    const { name } = req.body;
    const cat = req.body.category;
    const category = await ProductController.getName(req, cat);
    const nameExists = await Product.findOne({ name });
    // check if category for Product exist and ensure that no Product has duplicate names
    if (!category) {
      return res.status(400).send({ success: false, message: 'category does not exist, cannot create Product without category' });
    }
    if (nameExists) {
      return res.status(409).send({ success: false, message: 'name already exists for Product, please choose a different name' });
    }
    // if it pass tests then create Product
    let ProductForm = {};
    ProductForm = req.body;
    ProductForm.category = category._id;
    const newProduct = new Product(ProductForm);
    if (typeof req.files !== 'undefined') {
      ProductForm.productThumbnail = [];
      req.files.forEach((element) => {
        newProduct.productThumbnail.push({
          name: element.public_id,
          url: element.secure_url,
        });
      });
    } else {
      newProduct.productThumbnail = null;
    }
    try {
      await newProduct.save();
    } catch (error) {
      return res.status(400).send({ success: false, message: 'unable to upload new product', error });
    }
    category.Products.push(newProduct.id);
    await category.save();
    return res.status(201).send({ success: true, message: 'Product made successfully!', category: category.id });
  },
  // update a Product
  async edit(req, res) {
    const newSectionData = req.body;
    const idParams = req.params.id;
    const PreviousCategory = await ProductCategory.findOne({ Products: idParams });
    const newCategory = await ProductCategory.findOne({ name: newSectionData.category });
    // // if product category is not the same as the old
    if (!PreviousCategory || !newCategory) {
      res.status(400).send({ success: false, message: 'unable to find old or new category, please check and try again' });
      return;
    }
    if (PreviousCategory.name !== newCategory.name) {
      try {
        // remove product id from previous product category
        PreviousCategory.Products.pull(idParams);
        await PreviousCategory.save();
      } catch (error) {
        res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
        return;
      }
      // update the new product category
      newSectionData.category = newCategory.id;
      try {
        const updateProduct = await Product.updateOne({ _id: idParams }, { $set: newSectionData }, { upsert: true });
        newCategory.Products.push(idParams);
        await newCategory.save();
        // return the success message
        res.status(200).send({ success: true, message: 'updated the product', updateProduct });
        return;
      } catch (error) {
        res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
      }
    } else {
      try {
        // update the product as usual
        const updateProduct = await Product.updateOne({ _id: idParams }, { $set: newSectionData }, { upsert: true });
        res.status(200).send({ success: true, message: 'updated the product', updateProduct });
        return;
      } catch (error) {
        res.status(500).send({ success: false, message: `failed to  update the product with name ${req.body.name}`, error });
      }
    }
  },
  // delete a Product
  async delete(req, res) {
    const idParams = req.params.id;
    const currentCategory = await ProductCategory.findOne({ Products: idParams });
    currentCategory.Products.pull(idParams);
    await currentCategory.save();
    try {
    //   // and then delete the product
      const removed = await Product.deleteOne({ _id: idParams });
      res.status(200).send({ success: true, message: `successfully deleted the product with id ${idParams}`, removed });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `failed to remove the category with id ${req.params.id}`, error });
    }
  },
};

module.exports = { CategoryController, ProductController };
