const express = require('express');
const passport = require('passport');
const expressJoi = require('express-joi-validator');

const router = express.Router();
const { ProductController, CategoryController } = require('./productController');
const { productSchema } = require('./productsSchema');
const ensureToken = require('../strategies/authAuthorization');
const Uploads = require('../strategies/imageUploadStrategy');

const { productUploads, categoryUploads } = Uploads;


// get all categories
router.get('/categories', CategoryController.index);

// get a category by id
router.get('/categories/:id', CategoryController.get);

// create a category
router.post('/new-category', ensureToken, categoryUploads.saveImage, passport.authenticate('jwt', { session: false }), CategoryController.create);

// edit a category
router.put('/edit-category/:id', ensureToken, passport.authenticate('jwt', { session: false }), CategoryController.update);

// remove a category
router.delete('/remove-category/:id', ensureToken, passport.authenticate('jwt', { session: false }),CategoryController.delete);

// get all Products
router.get('/', ProductController.index);

// get a particular Product
router.get('/:id', ProductController.get);

//  make a Product
router.post('/new-Product', ensureToken, expressJoi(productSchema), productUploads.saveImage, passport.authenticate('jwt', { session: false }), ProductController.create);

// edit a Product
router.put('/edit-Product/:id', ensureToken, productUploads.saveImage, passport.authenticate('jwt', { session: false }), ProductController.edit);

// delete a Product
router.delete('/remove-Product/:id', ensureToken, passport.authenticate('jwt', { session: false }), ProductController.delete);

module.exports = router;
