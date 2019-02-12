const express = require('express');

const router = express.Router();
const cakeController = require('../controllers/cakeController');

// get all categories
router.get('/categories', cakeController.getCategory);

// get a category by id
router.get('/categories/:id', cakeController.getCategoryId);

// create a category
router.post('/new-category', cakeController.createCategory);

// edit a category
router.put('/edit-category/:id', cakeController.updateCategory);

// remove a category
router.delete('/remove-category/:id', cakeController.deleteCategory);

// get all cakes
router.get('/', cakeController.getCakes);

// get a particular cake
router.get('/:id', cakeController.getCake);

//  make a cake
router.post('/new-cake', cakeController.makeCake);

// edit a cake
router.put('/edit-cake/:id', cakeController.editCake);

// delete a cake
router.delete('/remove-cake/:id', cakeController.deleteCake);

module.exports = router;
