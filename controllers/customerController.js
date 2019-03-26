const Customer = require('../models/customer');

const customerController = {
  async createCustomer(req, res) {
    try {
      req.checkBody('firstname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('lastname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('phone', 'empty phone number ').isLength({ min: 11 }).trim().notEmpty();
      req.checkBody('email', 'email must be provided').notEmpty().isEmail();
      req.checkBody('password', 'password cant be empty').notEmpty();
      // check for duplicate mails
      const { email } = req.body;
      const duplicateName = await Customer.find({ email });
      if (duplicateName) res.status(409).send({ success: false, message: 'duplicate names exist for Product' });
      else {
        let customerForm = {};
        customerForm = req.body;
        const newCustomer = new Customer(customerForm);
        const result = await newCustomer.save();
        console.log('result is ', result);
        if (result) res.status(201).send({ success: true, message: 'customer account created', result });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: 'something went wrong', error });
    }
  },

  async getCustomerDetails(req, res) {
    try {
      const { email } = req.body;
      const result = await Customer.find({ email }, '-password');
      res.status(200).send({ success: true, message: 'customer found', result })
    } catch (error) {
      res.status(500).send({ success: false, message: 'something went wrong', error });
    }
  },

  async updateCustomerDetails(req, res) {
    try {
      req.checkBody('firstname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('lastname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('phone', 'empty phone number ').isLength({ min: 11 }).trim().notEmpty();
      req.checkBody('email', 'email must be provided').notEmpty().isEmail();  
      const newSectionData = req.body;
      const idParams = req.params.id;
      const customer = await Customer.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      if (customer) res.status(200).send({ success: true, message: 'updated the data', customer });
    } catch (error) {
      res.status(500).send({ success: false, message: 'something went wrong', error });
    }
  },

  deleteCustomerAccount(req, res) {
    if (req.createdBy.role !== 'superuser') res.status(403).send({ success: false, message: 'unauthorized to this route' });
    else {
      const idParams = req.params.id;
      Customer.remove({ _id: idParams }, (err, removed) => {
        if (err) throw err;
        else return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
      });
    }
  },
};

module.exports = customerController;
