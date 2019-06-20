const { AdminModel, CustomerModel, RoleModel } = require('./userModel');

const AdminController = {
  // get all users
  async index(req, res) {
    if (req.createdBy.role !== 'superadmin') {
      return res.status(403).send({ success: false, message: 'Unauthorized to access this route, you must be super admin' });
    }
    try {
      const users = await AdminModel.find({ storeId: req.createdBy.storeId }, '-password');
      return res.status(200).send({ success: true, users });
    } catch (error) {
      return res.status(400).send({ success: false, message: 'could not find any users' });
    }
  },
  // get  a user by id
  async get(req, res) {
    const idParams = req.params.id;
    try {
      const data = await AdminModel.findOne({ _id: idParams }, '-password').and([{ storeId: req.createdBy.storeId }]);
      return res.status(200).send({ success: true, message: 'Here is the user data', data });
    } catch (error) {
      return res.status(404).send({ success: false, message: `something went wrong. could not find user with id ${idParams}`, error });
    }
  },
  // create method
  async create(req, res) {
    // create the user
    const { email } = req.body;
    const nameExists = await AdminModel.findOne({ storeId: req.createdBy.storeId }).and([{ email }]);
    if (nameExists) {
      return res.status(409).send({ success: false, message: 'email already exists for a user, please use another email' });
    }

    let userForm = {};
    userForm = req.body;
    userForm.storeId = req.createdBy.storeId;
    const newUser = new AdminModel(userForm);
    try {
      await newUser.save();
    } catch (error) {
      return res.status(500).send({ success: false, message: 'something went wrong while trying to save the user', error });
    }
    return res.status(201).send({ success: true, user: newUser.id });
  },
  // add a new role
  async addRole(req, res) {
    if (req.role.privileges !== 'can add roles') {
      return res.status(403).send({ success: false, message: 'Auth Failed, sorry you are  not allowed to create roles ' });
    }
    let roleForm = {};
    roleForm = req.body;
    roleForm.storeId = req.createdBy.storeId;
    const newRole = new RoleModel(roleForm);
    try {
      await newRole.save();
    } catch (error) {
      return res.status(500).send(
        { success: false, message: 'something went wrong while trying to save the new rolw', error },
      );
    }
    return res.status(201).send({ success: true, user: newRole.id });
  },

  async modifyRole(req, res) {
    const newSectionData = req.body;
    newSectionData.storeId = req.createdBy.storeId;
    const idParams = req.params.id;
    if (req.role.privileges !== 'can create roles') {
      return res.status(403).send({ success: false, message: 'Auth Failed, sorry you are  not allowed to create roles ' });
    }
    try {
      const user = await RoleModel.update(
        { _id: idParams }, { $set: newSectionData }, { upsert: true },
      );
      return res.status(200).send({ success: true, message: 'updated the user data', user });
    } catch (error) {
      return res.status(500).send(
        { success: false, message: `something went wrong while trying to save the user with id ${req.params.id}`, error },
      );
    }
  },
  // update or edit method
  async update(req, res) {
    if (req.createdBy.role !== 'superadmin') {
      res.status(403).send({ success: false, message: 'you cannot update the user details, please contact the superadmin' });
      return;
    }
    const newSectionData = req.body;
    const idParams = req.params.id;
    try {
      const user = await AdminModel.update(
        { _id: idParams }, { $set: newSectionData }, { upsert: true },
      );
      res.status(200).send({ success: true, message: 'updated the user data', user });
    } catch (error) {
      res.status(500).send({ success: false, message: `something went wrong while trying to save the user with id ${req.params.id}`, error });
    }
  },
  // delete method
  async delete(req, res) {
    const idParams = req.params.id;
    if (req.createdBy.role !== 'superuser') {
      return res.status(403).send({ success: false, message: 'unauthorized to this route' });
    }
    try {
      const removed = await AdminController.removeOne({ _id: idParams });
      return res.status(200).send({ success: true, message: `removed user with id ${req.params.id}`, removed });
    } catch (error) {
      return res.status(500).send({ success: false, message: `could not remove user with id ${req.params.id}`, error });
    }
  },
};

const CustomerController = {
  async index(req, res) {
    try {
      const data = await CustomerModel.find({ storeId: req.createdBy.id }, '-password');
      return res.status(200).send({ success: true, data });
    } catch (error) {
      return res.status(400).send({ success: false, message: 'could not find any customers for this store', error });
    }
  },

  async get(req, res) {
    const idParams = req.params.id;
    try {
      const data = await CustomerModel.findOne({ _id: idParams }, '-password').and([{ storeId: req.createdBy.storeId }]);
      return res.status(200).send({ success: true, message: 'Here is the user data', data });
    } catch (error) {
      return res.status(404).send({ success: false, message: `something went wrong. could not find user with id ${idParams}`, error });
    }
  },

  // create method
  async create(req, res) {
    // create the customer
    const { email } = req.body;
    const nameExists = await CustomerModel.findOne(
      { storeId: req.createdBy.storeId },
    ).and([{ email }]);
    if (nameExists) {
      return res.status(409).send({ success: false, message: 'email already exists for a user, please use another email' });
    }

    let userForm = {};
    userForm = req.body;
    userForm.storeId = req.storeId;
    const newUser = new CustomerModel(userForm);
    try {
      await newUser.save();
    } catch (error) {
      return res.status(500).send({ success: false, message: 'something went wrong while trying to save the user', error });
    }
    return res.status(201).send({ success: true, user: newUser.id });
  },

  async update(req, res) {
    if (req.createdBy.role !== 'superadmin') {
      return res.status(403).send({ success: false, message: 'you cannot update the user details, please contact the superadmin' });
    }
    const newSectionData = req.body;
    const idParams = req.params.id;
    try {
      const user = await CustomerModel.update(
        { _id: idParams }, { $set: newSectionData }, { upsert: true },
      );
      return res.status(200).send({ success: true, message: 'updated the user data', user });
    } catch (error) {
      return res.status(500).send(
        { success: false, message: `something went wrong while trying to save the user with id ${req.params.id}`, error },
      );
    }
  },

};

module.exports = { AdminController, CustomerController };
