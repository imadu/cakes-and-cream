const express = require('express');
const passport = require('passport');

const router = express.Router();
const orderController = require('../controllers/orderController');
const ensureToken = require('../strategies/auth-authorization');

// list all orders
router.get('/', orderController.getOrderBySubStore);

// get order by custom order_id

// get order by id
router.get('/search-orders/:id', orderController.getOrderbyId);
// place order
router.post('/new-order', orderController.makeOrder);
// cancel order
router.delete('/cancel-order', ensureToken, passport.authenticate('jwt', { session: false }), orderController.deleteOrder);
module.exports = router;
