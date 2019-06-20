const Order = require('./orderModel');
const makeid = require('../strategies/randomGenerator');

const orderController = {
  // get  all orders by sub store
  async index(req, res) {
    try {
      const data = await Order.find({});
      return res.status(200).send({ success: true, data });
    } catch (error) {
      return res.status(500).send({ success: false, message: 'something went wrong', error });
    }
  },

  // get order by id
  async get(req, res) {
    const idParams = req.params.id;
    const order = await Order.findOne({ _id: idParams });
    if (!order) {
      res.status(404).send({ success: false, message: 'could not find the order' });
      return;
    }
    res.status(200).send({ success: true, order });
  },
  // create order

  async create(req, res) {
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

  async update(req, res) {
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
  async delete(req, res) {
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
