const express = require('express');
const passport = require('passport');
const expressJoi = require('express-joi-validator');

const router = express.Router();
const orderController = require('./orderController');
const orderSchema = require('./orderSchema');
const ensureToken = require('../strategies/authAuthorization');

// list all orders
router.get('/', orderController.index);

// get order by custom order_id

// get order by id
router.get('/search-orders/:id', orderController.get);
// place order
router.post('/new-order', expressJoi(orderSchema), orderController.create);
// cancel order
router.delete('/cancel-order', ensureToken, passport.authenticate('jwt', { session: false }), orderController.delete);
module.exports = router;
