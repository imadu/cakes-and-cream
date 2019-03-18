const express = require('express');
const passport = require('passport');

const router = express.Router();
const productController = require('../controllers/productController');
const ensureToken = require('../strategies/auth-authorization');
const productUploads = require('../strategies/image_upload_strategy');


// get all categories
router.get('/categories', productController.getCategory);

// get a category by id
router.get('/categories/:id', productController.getCategoryId);

// create a category
router.post('/new-category', ensureToken, passport.authenticate('jwt', { session: false }), productController.createCategory);

// edit a category
router.put('/edit-category/:id', ensureToken, passport.authenticate('jwt', { session: false }), productController.updateCategory);

// remove a category
router.delete('/remove-category/:id', ensureToken, passport.authenticate('jwt', { session: false }), productController.deleteCategory);

// get all Products
router.get('/', productController.getProducts);

// get a particular Product
router.get('/:id', productController.getProduct);

//  make a Product
router.post('/new-Product', ensureToken, productUploads.saveImage, passport.authenticate('jwt', { session: false }), productController.makeProduct);

// edit a Product
router.put('/edit-Product/:id', ensureToken, productUploads.saveImage, passport.authenticate('jwt', { session: false }), productController.editProduct);

// delete a Product
router.delete('/remove-Product/:id', ensureToken, passport.authenticate('jwt', { session: false }), productController.deleteProduct);

module.exports = router;
