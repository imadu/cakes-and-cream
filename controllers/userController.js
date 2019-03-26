/* eslint-disable consistent-return */
const User = require('../models/user');

const userController = {
  // get  a user by id
  async get(req, res) {
    const idParams = req.params.id;
    try {
      const data = await User.findOne({ _id: idParams }, '-password');
      res.status(200).send({ success: true, message: 'Here is the user data', data });
      return;
    } catch (error) {
      res.status(404).send({ success: false, message: `something went wrong. could not find user with id ${idParams}`, error }); 
    }
  },
  // get a user by email
  async getByEmail(req, res) {
    const idParams = req.params.email;
    try {
      const data = User.findOne({ email: idParams }, '-password');
      res.status(200).send({ success: true, message: 'Here is the data', data });
      return;
    } catch (error) {
      res.status(404).send({ success: false, message: `something went wrong. could not get user with email ${idParams}`, error });
    }
  },
  // get all users
  async getAll(req, res) {
    if (req.createdBy.role !== 'superadmin') {
      res.status(403).send({ success: false, message: 'Unauthorized to access this route, you must be super admin' });
      return;
    }
    const users = await User.find({}, '-password');
    if (!users) {
      res.status(400).send({ success: false, message: 'could not find any users' });
      return;
    }
    res.status(200).send({ success: true, users });
  },
  // create method
  async create(req, res) {
    // validate the form fields
    req.checkBody('firstname', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('role', 'empty role').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('username', 'username cant be empty').notEmpty().isString();
    req.checkBody('email', 'email must be provided').notEmpty().isEmail();
    req.checkBody('substore', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('password', 'password cant be empty').notEmpty();

    // return validation error
    const validationErrors = req.validationErrors();
    if (validationErrors) {
      res.status(400).send({ success: false, message: 'there are some erros in your form', error: validationErrors });
      return;
    }
    // create the user
    const { email } = req.body;
    const nameExists = await User.findOne({ email });
    if (nameExists) {
      res.status(409).send({ success: false, message: 'email already exists for a user, please use another email' });
      return;
    }

    let userForm = {};
    userForm = req.body;
    const newUser = new User(userForm);
    try {
      await newUser.save()
    } catch (error) {
      res.status(500).send({ success: false, message: 'something went wrong while trying to save the user', error });
      return;
    }
    res.status(201).json({ success: true, user: newUser.id });
  },
  // update or edit method
  async update(req, res) {
    if (req.createdBy.role !== 'superadmin') {
      res.status(403).send({ success: false, message: 'you cannot update the user details, please contact the superadmin' });
      return;
    }
    req.checkBody('username', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('role', 'empty role').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('location', 'empty location').isLength({ min: 1 }).trim().notEmpty();
    const validationErrors = req.validationErrors();
    if (validationErrors) {
      res.status(400).send({ success: false, message: 'there are some erros in your form', error: validationErrors });
      return;
    }
    const newSectionData = req.body;
    const idParams = req.params.id;
    try {
      const user = await User.update({ _id: idParams }, { $set: newSectionData }, { upsert: true });
      res.status(200).send({ success: true, message: 'updated the user data', user });
    } catch (error) {
      res.status(500).send({ success: false, message: `something went wrong while trying to save the user with id ${req.params.id}`, error });
    }
  },
  // delete method
  async delete(req, res) {
    if (req.createdBy.role !== 'superuser') {
      res.status(403).send({ success: false, message: 'unauthorized to this route' });
      return;
    }
    const idParams = req.params.id;
    try {
      const removed = await User.remove({ _id: idParams });
      if (removed) {
        res.status(200).send({ success: true, message: `removed user with id ${req.params.id}`});
        return;
      }
    } catch (error) {
      res.status(500).send({ success: false, message: `could not remove user with id ${req.params.id}`, error })
    }
  },
};

module.exports = userController;
