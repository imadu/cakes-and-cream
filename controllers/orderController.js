const Order = require('../models/order');
const makeId = require('../strategies/random_generator');

const orderController = {
  // get all orders
  // eslint-disable-next-line consistent-return
  async getOrders(req, res) {
    try {
      const orders = await Order.find({});
      if (!orders) res.status(500).send({ success: false, message: 'something is wrong with the orders' });
      else return res.status(200).send({ success: true, orders });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

  // get order by order_id
  // eslint-disable-next-line consistent-return
  async getOrderByOrderId(req, res) {
    try {
      const order_id = req.query.orderId;
      const order = await Order.findOne({ order_id });
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
      req.checkBody('location', 'empty location').notEmpty();
      const err = await req.validationErrors();
      if (err) return res.status(400).send({ success: false, message: 'there are errors in your form', err });

      let orderForm = {};
      orderForm = req.body;
      switch (orderForm.location) {
        case orderForm.location === 'OPEBI':
          orderForm.order_id = makeId(1);
          break;
        case orderForm.location === 'SURULERE':
          orderForm.order_id = makeId(2);
          break;
        case orderForm.location === 'VICTORIA-ISLAND':
          orderForm.order_id = makeId(3);
          break;
        case orderForm.location === 'BERGERI':
          orderForm.order_id = makeId(4);
          break;
        default:
          orderForm.order_id = makeId(1);
          break;
      }
      console.log('order_id is', orderForm.order_id);
      const newOrderForm = new Order(orderForm);
      const result = await newOrderForm.save();
      if (result) return res.status(201).send({ success: true, message: 'cake made successfully!', result: result.id });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },
  // update the order
  // eslint-disable-next-line consistent-return

  // cancel orders
  // eslint-disable-next-line consistent-return
  async deleteOrder(req, res) {
    try {
      const idParams = req.params.id;
      const result = await Order.remove({ _id: idParams });
      if (result) return res.status(200).send({ success: true, message: 'successfully deleted the user', result });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

};

module.exports = orderController;
