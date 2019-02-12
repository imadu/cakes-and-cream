const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');

// list all orders
router.get('/', orderController.getOrders);

// get order by custom order_id
router.get('/search-order/', orderController.getOrderByOrderId);
// get order by id
router.get('/search-orders/:id', orderController.getOrderbyId);
// place order
router.post('/new-order', orderController.makeOrder);
// cancel order
router.delete('/cancel-order', orderController.deleteOrder);
module.exports = router;
