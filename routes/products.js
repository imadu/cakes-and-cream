const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');

// get all categories
router.get('/categories', productController.getCategory);

// get a category by id
router.get('/categories/:id', productController.getCategoryId);

// create a category
router.post('/new-category', productController.createCategory);

// edit a category
router.put('/edit-category/:id', productController.updateCategory);

// remove a category
router.delete('/remove-category/:id', productController.deleteCategory);

// get all Products
router.get('/', productController.getProducts);

// get a particular Product
router.get('/:id', productController.getProduct);

//  make a Product
router.post('/new-Product', productController.makeProduct);

// edit a Product
router.put('/edit-Product/:id', productController.editProduct);

// delete a Product
router.delete('/remove-Product/:id', productController.deleteProduct);

module.exports = router;
