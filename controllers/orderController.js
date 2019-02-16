const Order = require('../models/order');
const makeId = require('../strategies/random_generator');

const orderController = {
  // get  all orders by sub store
  // eslint-disable-next-line consistent-return
  async getOrderBySubStore(req, res) {
    try {
      const substore = req.createdBy.substore;
      let order;
      if (substore === 'ALL') {
        order = await Order.find({ });
      } else {
        order = await Order.find({ substore });
      }
      if (!order) res.status(404).send({ success: false, message: 'could not find the order' });
      else return res.status(200).send({ success: true, order });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

  // get order by id
  // eslint-disable-next-line consistent-return
  async getOrderbyId(req, res) {
    try {
      const idParams = req.params.id;
      const order = await Order.findOne({ _id: idParams });
      if (!order) res.status(404).send({ success: false, message: 'could not find the order' });
      else return res.status(200).send({ success: true, order });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },
  // create order
  // eslint-disable-next-line consistent-return
  async makeOrder(req, res) {
    try {
      req.checkBody('customer_name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('customer_phone', 'empty size').notEmpty();
      req.checkBody('customer_email', 'empty mail').notEmpty().isEmail();
      req.checkBody('substore', 'empty location').notEmpty();
      const err = await req.validationErrors();
      if (err) return res.status(400).send({ success: false, message: 'there are errors in your form', err });

      let orderForm = {};
      orderForm = req.body;
      switch (orderForm.substore) {
        case orderForm.substore === 'OP':
          orderForm.order_id = makeId(1);
          break;
        case orderForm.substore === 'SUR':
          orderForm.order_id = makeId(2);
          break;
        case orderForm.substore === 'VI':
          orderForm.order_id = makeId(3);
          break;
        case orderForm.substore === 'BG':
          orderForm.order_id = makeId(4);
          break;
        default:
          orderForm.order_id = makeId(1);
          break;
      }
      const newOrderForm = new Order(orderForm);
      const result = await newOrderForm.save();
      if (result) return res.status(201).send({ success: true, message: 'cake made successfully!', result: result.id });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },
  // update the order
  // eslint-disable-next-line consistent-return
  async updateOrder(req, res) {
    try {
      const newSectionData = req.body;
      const idParams = req.params.id;
      const result = await Order.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      if (result) return res.status(200).send({ success: true, message: 'updated the order', result });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },
  // cancel orders
  // eslint-disable-next-line consistent-return
  async deleteOrder(req, res) {
    try {
      const idParams = req.params.id;
      const result = await Order.remove({ _id: idParams });
      if (result) return res.status(200).send({ success: true, message: 'order has been cancelled', result });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

};

module.exports = orderController;
