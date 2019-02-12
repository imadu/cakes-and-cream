
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userController = {
  // get  a user by id
  get(req, res) {
    const idParams = req.params.id;
    User.findOne({ _id: idParams }, '-password', (err, data) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      return res.status(200).send({ success: true, message: 'Here is the data', data });
    });
  },
  // get a user by email
  getByEmail(req, res) {
    const idParams = req.params.email;
    User.findOne({ email: idParams }, '-password', (err, data) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      return res.status(200).send({ success: true, message: 'Here is the data', data });
    });
  },
  // get all users
  getAll(req, res) {
    User.find({ }, '-password', (err, data) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      return res.status(200).send({ success: true, message: 'Here is the data ', data });
    });
  },
  // create method
  create(req, res) {
    // validate the form fields
    req.checkBody('firstname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('role', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('username', 'house address cant be empty').notEmpty().isString();
    req.checkBody('email', 'email must be provided').notEmpty().isEmail();
    req.checkBody('location', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('password', 'password cant be empty').notEmpty();

    // return validation error
    const validationErrors = req.validationErrors();
    if (validationErrors) res.status(400).send({ success: false, message: 'there are some erros in your form', error: validationErrors });

    // create the user
    const email = req.body.email;

    User.findOne({ email }, (err, user) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      if (user) res.status(409).send({ success: false, message: 'duplicate users cant exist, please use another email' });

      let userForm = {};
      userForm = req.body;

      // userForm.createdBy = req.createdBy.email;
      const newUser = new User(userForm);
      newUser.save((error) => {
       
        if (error) {
          res.status(500).send({ success: false, message: 'something went wrong', error });
        } else {
          return res.status(201).json({ success: true, user: newUser.id });
        }
      });
    });
  },

  // update or edit method
  update(req, res) {
    req.checkBody('username', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('role', 'empty role').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('location', 'empty location').isLength({ min: 1 }).trim().notEmpty();

    const validationErrors = req.validationErrors();
    if (validationErrors) res.status(400).send({ success: false, message: 'there are some erros in your form', error: validationErrors });
    const newSectionData = req.body;
    const idParams = req.params.id;
    User.update({ _id: idParams }, { $set: newSectionData }, { upsert: true }, (err, data) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, message: 'updated the data', data });
    });
  },

  // delete method
  delete(req, res) {
    if (req.createdBy.role !== 'superuser') res.status(403).send({ success: false, message: 'unauthorized to this route' });
    const idParams = req.params.id;
    User.remove({ _id: idParams }, (err, removed) => {
      if (err) throw err;
      return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
    });
  },
};

module.exports = userController;
