const Order = require('../models/order');
const makeid = require('../strategies/random_generator');

const orderController = {
  // get  all orders by sub store
  async getOrderBySubStore(req, res) {
    const { substore } = req.createdBy;
    let order;
    if (substore === 'ALL') {
      order = await Order.find({ });
    } else {
      order = await Order.find({ substore });
    }
    if (!order) {
      res.status(404).send({ success: false, message: 'could not find the order' });
      return;
    }
    res.status(200).send({ success: true, order });
  },

  // get order by id
  async getOrderbyId(req, res) {
    const idParams = req.params.id;
    const order = await Order.findOne({ _id: idParams });
    if (!order) {
      res.status(404).send({ success: false, message: 'could not find the order' });
      return;
    }
    res.status(200).send({ success: true, order });
  },
  // create order

  async makeOrder(req, res) {
    req.checkBody('customer_name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('customer_phone', 'empty phone').notEmpty();
    req.checkBody('customer_email', 'empty mail').notEmpty().isEmail();
    req.checkBody('substore', 'empty location').notEmpty();
    const err = req.validationErrors();
    if (err) {
      res.status(400).send({ success: false, message: 'there are errors in your form', err });
      return;
    }
    let orderForm = {};
    orderForm = req.body;
    const { substore } = orderForm;
    switch (substore) {
      case 'OP':
        orderForm.order_id = makeid(1);
        break;
      case 'SUR':
        orderForm.order_id = makeid(2);
        break;
      case 'VI':
        orderForm.order_id = makeid(3);
        break;
      case 'BG':
        orderForm.order_id = makeid(4);
        break;
      default:
        orderForm.order_id = makeid(1);
        break;
    }
    const newOrderForm = new Order(orderForm);
    try {
      const result = await newOrderForm.save();
      res.status(201).send({ success: true, message: 'cake made successfully!', result: result.id });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: ' could not save the cake ', error });
    }
  },
  // update the order

  async updateOrder(req, res) {
    const { role } = req.createdBy;
    if (role === 'customer') {
      res.status(403).send({ success: false, message: 'unauthorized to make updates on orders' });
      return;
    }
    const newSectionData = req.body;
    const idParams = req.params.id;
    try {
      const result = await Order.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      res.status(200).send({ success: true, message: 'updated the order', result });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: `could not update the cake with id ${idParams} `, error });
    }
  },

  // cancel orders
  async deleteOrder(req, res) {
    const idParams = req.params.id;
    try {
      const result = await Order.remove({ _id: idParams });
      res.status(200).send({ success: true, message: 'order has been cancelled', result });
      return;
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

};

module.exports = orderController;
